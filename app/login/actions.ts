"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { createAndStoreOtp, sendVerificationEmail } from "@/lib/mail";

export type LoginResult = {
  success: boolean;
  error?: string;
  email?: string;
  simulatedCode?: string;
};

export async function loginWithCredentials(formData: FormData): Promise<LoginResult> {
  const rawIdentifier = ((formData.get("identifier") as string) || "").trim();
  const password = ((formData.get("password") as string) || "");

  if (!rawIdentifier || !password) {
    return { success: false, error: "Mohon masukkan email / nomor ponsel dan password Anda." };
  }

  const isEmail = rawIdentifier.includes("@");
  let user = null;

  if (isEmail) {
    user = await prisma.user.findUnique({
      where: { email: rawIdentifier.toLowerCase() },
      include: { userRoles: { include: { role: true } } }
    });
  } else {
    const cleanDigits = rawIdentifier.replace(/[^0-9]/g, "");
    const variants = [
      rawIdentifier,
      cleanDigits,
      cleanDigits.startsWith("0") ? "62" + cleanDigits.slice(1) : cleanDigits,
      cleanDigits.startsWith("0") ? "+62" + cleanDigits.slice(1) : "+62" + cleanDigits,
      cleanDigits.startsWith("62") ? "0" + cleanDigits.slice(2) : cleanDigits,
      cleanDigits.startsWith("62") ? "+" + cleanDigits : cleanDigits,
      "+" + cleanDigits
    ];

    user = await prisma.user.findFirst({
      where: { phone: { in: variants } },
      include: { userRoles: { include: { role: true } } }
    });
  }

  if (!user || !user.isActive || !user.passwordHash) {
    return { success: false, error: "Email atau nomor ponsel tidak terdaftar." };
  }

  const valid = await compare(password, user.passwordHash);
  if (!valid) {
    return { success: false, error: "Password yang Anda masukkan tidak sesuai." };
  }

  // Cek verifikasi email khusus Donatur
  const roleCodes = user.userRoles.map((ur) => ur.role.code);
  const isDonorOnly = roleCodes.includes("DONOR") && !roleCodes.some((r) => r !== "DONOR");

  if (isDonorOnly && !user.emailVerified) {
    const code = await createAndStoreOtp(user.email);
    const mailResult = await sendVerificationEmail(user.email, user.name, code);
    return {
      success: false,
      error: "EMAIL_NOT_VERIFIED",
      email: user.email,
      simulatedCode: mailResult.simulated ? code : undefined
    };
  }

  try {
    await signIn("credentials", {
      identifier: rawIdentifier,
      password,
      redirectTo: "/dashboard"
    });
  } catch (error: any) {
    // Next.js redirect throw is expected on success
    if (error?.digest?.startsWith("NEXT_REDIRECT") || error?.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    return { success: false, error: "Gagal memproses sesi masuk. Silakan coba lagi." };
  }

  return { success: true };
}

export async function loginWithGoogleAction() {
  await signIn("google", { redirectTo: "/dashboard" });
}
