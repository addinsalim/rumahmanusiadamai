import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createAndStoreOtp, sendVerificationEmail } from "@/lib/mail";

class EmailNotVerifiedError extends CredentialsSignin {
  code = "EMAIL_NOT_VERIFIED";
}

class InvalidCredentialsError extends CredentialsSignin {
  code = "INVALID_CREDENTIALS";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true
          })
        ]
      : []),
    Credentials({
      name: "Email atau Nomor Telepon",
      credentials: {
        identifier: { label: "Email atau Nomor Telepon", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const rawIdentifier = (credentials?.identifier || credentials?.email || "") as string;
        const identifier = rawIdentifier.trim();
        const password = (credentials?.password || "") as string;

        if (!identifier || !password) {
          throw new InvalidCredentialsError();
        }

        const isEmail = identifier.includes("@");
        let user = null;

        if (isEmail) {
          user = await prisma.user.findUnique({
            where: { email: identifier.toLowerCase() },
            include: { userRoles: { include: { role: true } } }
          });
        } else {
          // Cari berdasarkan variasi nomor ponsel
          const clean = identifier.replace(/[^0-9+]/g, "");
          const cleanDigits = identifier.replace(/[^0-9]/g, "");
          const variants = Array.from(
            new Set([
              identifier,
              clean,
              cleanDigits,
              cleanDigits.startsWith("0") ? "62" + cleanDigits.slice(1) : cleanDigits,
              cleanDigits.startsWith("0") ? "+62" + cleanDigits.slice(1) : "+62" + cleanDigits,
              cleanDigits.startsWith("62") ? "0" + cleanDigits.slice(2) : cleanDigits,
              cleanDigits.startsWith("62") ? "+" + cleanDigits : cleanDigits,
              "+" + cleanDigits
            ])
          );

          user = await prisma.user.findFirst({
            where: {
              phone: { in: variants }
            },
            include: { userRoles: { include: { role: true } } }
          });
        }

        if (!user || !user.isActive || !user.passwordHash) {
          throw new InvalidCredentialsError();
        }

        const valid = await compare(password, user.passwordHash);
        if (!valid) {
          throw new InvalidCredentialsError();
        }

        // Cek verifikasi email khusus untuk Donatur
        const roleCodes = user.userRoles.map((ur) => ur.role.code);
        const isDonorOnly = roleCodes.includes("DONOR") && !roleCodes.some((r) => r !== "DONOR");

        if (isDonorOnly && !user.emailVerified) {
          // Kirimkan OTP terbaru ke email agar pengguna dapat langsung verifikasi
          try {
            const code = await createAndStoreOtp(user.email);
            await sendVerificationEmail(user.email, user.name, code);
          } catch (e) {
            console.error("Gagal mengirim ulang OTP saat login:", e);
          }
          throw new EmailNotVerifiedError();
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          roles: roleCodes
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const email = user.email?.toLowerCase();
        if (!email) return false;

        // Cari user di database
        let dbUser = await prisma.user.findUnique({
          where: { email },
          include: { userRoles: { include: { role: true } } }
        });

        const donorRole = await prisma.role.findUnique({ where: { code: "DONOR" } });

        if (!dbUser) {
          // Pendaftaran pertama kali menggunakan akun Google
          // Simpan data profil (Nama, Foto Profil, Email) dari Google
          dbUser = await prisma.user.create({
            data: {
              name: user.name || (profile?.name as string) || "Donatur RMD",
              email,
              image: user.image || (profile?.picture as string) || null,
              emailVerified: null, // Verifikasi email pertama kali
              userRoles: donorRole ? { create: { roleId: donorRole.id } } : undefined
            },
            include: { userRoles: { include: { role: true } } }
          });

          // Hubungkan record akun OAuth
          await prisma.account.create({
            data: {
              userId: dbUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              id_token: account.id_token,
              token_type: account.token_type,
              scope: account.scope,
              expires_at: account.expires_at
            }
          });

          // Kirim kode verifikasi email untuk pendaftaran pertama Google
          const code = await createAndStoreOtp(email);
          await sendVerificationEmail(email, dbUser.name, code);

          // Arahkan ke halaman verifikasi email
          return `/verify-email?email=${encodeURIComponent(email)}&firstGoogle=true`;
        } else {
          // Pengguna sudah ada: perbarui profil (nama & foto) dari akun Google
          await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              name: user.name || dbUser.name,
              image: user.image || dbUser.image
            }
          });

          // Hubungkan akun Google jika belum tersambung
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId
              }
            }
          });

          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: dbUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                id_token: account.id_token,
                token_type: account.token_type,
                scope: account.scope,
                expires_at: account.expires_at
              }
            });
          }

          // Jika donatur belum pernah memverifikasi email pertama kali
          if (!dbUser.emailVerified) {
            const code = await createAndStoreOtp(email);
            await sendVerificationEmail(email, dbUser.name, code);
            return `/verify-email?email=${encodeURIComponent(email)}&firstGoogle=true`;
          }

          // Jika sudah terverifikasi sebelumnya, login langsung diizinkan tanpa verifikasi ulang
          return true;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        // Ambil data user dari database agar konsisten dengan UUID sistem
        const record = await prisma.user.findUnique({
          where: { email: user.email.toLowerCase() },
          include: { userRoles: { include: { role: true } } }
        });
        if (record) {
          token.sub = record.id;
          token.name = record.name;
          token.email = record.email;
          token.picture = record.image;
          token.roles = record.userRoles.map((item) => item.role.code);
        }
      } else if (token.sub && !token.roles) {
        const record = await prisma.user.findUnique({
          where: { id: token.sub },
          include: { userRoles: { include: { role: true } } }
        });
        if (record) {
          token.roles = record.userRoles.map((item) => item.role.code);
          token.name = record.name;
          token.picture = record.image;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).roles = token.roles ?? [];
        if (token.picture) {
          session.user.image = token.picture as string;
        }
        if (token.name) {
          session.user.name = token.name as string;
        }
      }
      return session;
    }
  }
});
