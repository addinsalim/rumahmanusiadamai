import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().trim().email("Format email tidak valid").toLowerCase(),
  code: z.string().trim().min(4, "Kode verifikasi tidak lengkap").max(10)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Email atau kode verifikasi tidak valid." }, { status: 400 });
    }

    const { email, code } = parsed.data;

    // Cari token verifikasi di database
    const verification = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: code
      }
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Kode verifikasi salah atau tidak ditemukan. Pastikan Anda memasukkan 6 digit yang sesuai." },
        { status: 400 }
      );
    }

    // Cek apakah token sudah kedaluwarsa
    if (new Date() > verification.expires) {
      // Hapus token yang kedaluwarsa
      await prisma.verificationToken.deleteMany({
        where: { identifier: email, token: code }
      });
      return NextResponse.json(
        { error: "Kode verifikasi telah kedaluwarsa (berlaku 15 menit). Silakan klik 'Kirim Ulang Kode'." },
        { status: 400 }
      );
    }

    // Cari akun pengguna
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: "Akun pengguna tidak ditemukan." }, { status: 404 });
    }

    // Tandai email pengguna telah terverifikasi
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        isActive: true
      }
    });

    // Hapus semua token verifikasi yang berkaitan dengan email ini
    await prisma.verificationToken.deleteMany({
      where: { identifier: email }
    });

    return NextResponse.json({
      success: true,
      message: "Selamat! Alamat email Anda telah berhasil diverifikasi. Silakan masuk untuk melanjutkan."
    }, { status: 200 });

  } catch (error) {
    console.error("[VERIFY EMAIL API ERROR]:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan sistem saat memverifikasi kode." },
      { status: 500 }
    );
  }
}
