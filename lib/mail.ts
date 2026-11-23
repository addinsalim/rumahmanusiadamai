import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createAndStoreOtp(email: string): Promise<string> {
  const cleanEmail = email.trim().toLowerCase();
  const code = generateOtpCode();
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 menit

  // Hapus token sebelumnya jika ada
  await prisma.verificationToken.deleteMany({
    where: { identifier: cleanEmail }
  });

  // Simpan token verifikasi baru
  await prisma.verificationToken.create({
    data: {
      identifier: cleanEmail,
      token: code,
      expires
    }
  });

  return code;
}

export async function sendVerificationEmail(email: string, name: string, code: string) {
  const cleanEmail = email.trim().toLowerCase();

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || `"Yayasan Rumah Manusia Damai" <no-reply@rumahmanusiadamai.id>`;

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #118B44; margin: 0; font-size: 24px; font-weight: 800;">Yayasan Rumah Manusia Damai</h2>
        <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Gerakan Kebaikan dan Kepedulian Bersama</p>
      </div>
      <div style="padding: 20px 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
        <p style="font-size: 16px; color: #1e293b; margin: 0 0 12px 0;">Halo, <strong>${name}</strong>!</p>
        <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
          Terima kasih telah bergabung sebagai donatur di Yayasan Rumah Manusia Damai. Untuk mengamankan akun dan memverifikasi alamat email Anda, silakan gunakan kode verifikasi (OTP) berikut:
        </p>
        <div style="text-align: center; margin: 28px 0;">
          <span style="display: inline-block; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #118B44; background: #f0fdf4; border: 2px dashed #8CC63F; border-radius: 12px; padding: 12px 28px;">
            ${code}
          </span>
        </div>
        <p style="font-size: 13px; color: #dc2626; text-align: center; margin: 0 0 16px 0; font-weight: 600;">
          *Kode ini hanya berlaku selama 15 menit. Jangan berikan kode ini kepada siapa pun.
        </p>
      </div>
      <div style="margin-top: 24px; text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.5;">
        <p style="margin: 0;">Jika Anda tidak merasa mendaftar di Rumah Manusia Damai, silakan abaikan email ini.</p>
        <p style="margin: 8px 0 0 0;">Gedung Graha Kencana Mas, Jakarta Timur | info@rumahmanusiadamai.id</p>
      </div>
    </div>
  `;

  // Catat ke server log untuk keperluan debugging/development
  console.log(`[VERIFIKASI EMAIL RMD] Tujuan: ${cleanEmail} | Kode OTP: ${code}`);

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      await transporter.sendMail({
        from: smtpFrom,
        to: cleanEmail,
        subject: `${code} adalah Kode Verifikasi Akun Rumah Manusia Damai`,
        text: `Halo ${name}, kode verifikasi akun Anda adalah: ${code}. Kode berlaku 15 menit.`,
        html: htmlContent
      });

      return { success: true, simulated: false };
    } catch (err) {
      console.error("[SMTP ERROR] Gagal mengirim email:", err);
      return { success: true, simulated: true, error: String(err) };
    }
  }

  // Jika SMTP belum dikonfigurasi, gunakan mode simulasi (tercatat di log dan dapat langsung diverifikasi)
  return { success: true, simulated: true };
}
