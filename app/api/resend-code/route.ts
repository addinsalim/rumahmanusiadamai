import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createAndStoreOtp, sendVerificationEmail } from "@/lib/mail";

const schema = z.object({
  email: z.string().trim().email("Format email tidak valid").toLowerCase()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });
    }

    const { email } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: "Akun dengan email ini tidak ditemukan." }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({
        message: "Email ini sudah terverifikasi sebelumnya. Anda dapat langsung masuk.",
        alreadyVerified: true
      }, { status: 200 });
    }

    // Buat kode OTP baru dan kirim
    const code = await createAndStoreOtp(email);
    const mailResult = await sendVerificationEmail(email, user.name, code);

    return NextResponse.json({
      success: true,
      message: `Kode verifikasi baru telah dikirim ke ${email}.`,
      simulatedCode: mailResult.simulated ? code : undefined
    }, { status: 200 });

  } catch (error) {
    console.error("[RESEND CODE API ERROR]:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan sistem saat mengirim ulang kode." },
      { status: 500 }
    );
  }
}
