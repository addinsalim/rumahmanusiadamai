import { NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createAndStoreOtp, sendVerificationEmail } from "@/lib/mail";

const schema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(150),
  email: z.string().trim().email("Format email tidak valid").toLowerCase(),
  phone: z.string().trim().min(8, "Nomor ponsel minimal 8 digit").max(25),
  password: z.string().min(8, "Password minimal 8 karakter").max(72)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues?.[0]?.message || "Data formulir pendaftaran tidak valid.";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { name, email, phone, password } = parsed.data;

    // Bersihkan nomor ponsel (hanya digit dan awalan +)
    const cleanPhone = phone.replace(/[^0-9+]/g, "");

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      if (existingUser.emailVerified) {
        return NextResponse.json(
          { error: "Email sudah terdaftar dan terverifikasi. Silakan langsung masuk." },
          { status: 409 }
        );
      } else {
        // Akun sudah ada tapi belum terverifikasi: perbarui data dan kirim ulang OTP
        const passwordHash = await hash(password, 12);
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name,
            phone: cleanPhone,
            passwordHash
          }
        });

        const code = await createAndStoreOtp(email);
        const mailResult = await sendVerificationEmail(email, name, code);

        return NextResponse.json({
          message: "Akun Anda sebelumnya belum diverifikasi. Kode verifikasi baru telah dikirim ke email Anda.",
          email,
          needVerification: true,
          simulatedCode: mailResult.simulated ? code : undefined
        }, { status: 200 });
      }
    }

    // Cek apakah nomor ponsel sudah digunakan oleh akun lain yang aktif
    if (cleanPhone.length >= 8) {
      const phoneExists = await prisma.user.findFirst({
        where: {
          phone: cleanPhone,
          emailVerified: { not: null }
        }
      });
      if (phoneExists) {
        return NextResponse.json(
          { error: "Nomor ponsel sudah digunakan oleh akun donatur lain." },
          { status: 409 }
        );
      }
    }

    const passwordHash = await hash(password, 12);
    const donorRole = await prisma.role.findUnique({ where: { code: "DONOR" } });
    if (!donorRole) {
      return NextResponse.json({ error: "Konfigurasi role DONOR belum tersedia di sistem." }, { status: 500 });
    }

    // Buat akun donatur baru (status emailVerified masih null)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone: cleanPhone,
        passwordHash,
        emailVerified: null,
        userRoles: { create: { roleId: donorRole.id } }
      },
      select: { id: true, name: true, email: true, phone: true }
    });

    // Buat kode OTP dan kirimkan ke email pendaftar
    const code = await createAndStoreOtp(email);
    const mailResult = await sendVerificationEmail(email, name, code);

    return NextResponse.json({
      success: true,
      message: "Pendaftaran berhasil! Kode verifikasi telah dikirim ke email Anda.",
      user: newUser,
      email,
      needVerification: true,
      simulatedCode: mailResult.simulated ? code : undefined
    }, { status: 201 });

  } catch (error) {
    console.error("[REGISTER API ERROR]:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat mendaftarkan akun." },
      { status: 500 }
    );
  }
}
