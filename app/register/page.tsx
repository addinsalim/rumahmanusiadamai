"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  // Step 1: Form Registrasi, Step 2: Input OTP Verifikasi
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Verification State
  const [otpCode, setOtpCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown timer
  const triggerCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    setDevCode(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password })
      });
      const data = await res.json();

      if (res.ok) {
        if (data.simulatedCode) {
          setDevCode(data.simulatedCode);
        }
        setMessage({
          text: data.message || "Pendaftaran berhasil! Silakan masukkan kode verifikasi 6 digit yang telah dikirim ke email Anda.",
          type: "info"
        });
        setStep(2);
        triggerCooldown();
      } else {
        setMessage({ text: data.error || "Gagal melakukan pendaftaran. Silakan coba lagi.", type: "error" });
      }
    } catch {
      setMessage({ text: "Terjadi kesalahan jaringan. Periksa koneksi internet Anda.", type: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 4) {
      setMessage({ text: "Masukkan 6 digit kode verifikasi.", type: "error" });
      return;
    }

    setBusy(true);
    setMessage(null);

    try {
      const res = await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: otpCode.trim() })
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({
          text: "Alamat email berhasil diverifikasi! Mengalihkan ke halaman masuk...",
          type: "success"
        });
        setTimeout(() => {
          router.push(`/login?verified=true&email=${encodeURIComponent(email)}`);
        }, 1800);
      } else {
        setMessage({ text: data.error || "Kode verifikasi salah atau kedaluwarsa.", type: "error" });
      }
    } catch {
      setMessage({ text: "Gagal terhubung ke server saat memverifikasi.", type: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function handleResendCode() {
    if (resendCooldown > 0 || busy) return;
    setBusy(true);
    setMessage(null);

    try {
      const res = await fetch("/api/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() })
      });
      const data = await res.json();

      if (res.ok) {
        if (data.simulatedCode) {
          setDevCode(data.simulatedCode);
        }
        setMessage({
          text: "Kode verifikasi baru telah dikirimkan ke email Anda.",
          type: "info"
        });
        triggerCooldown();
      } else {
        setMessage({ text: data.error || "Gagal mengirim ulang kode.", type: "error" });
      }
    } catch {
      setMessage({ text: "Gagal meminta kode baru.", type: "error" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container-page grid min-h-[75vh] place-items-center py-12">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        {step === 1 ? (
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-block rounded-full bg-brand-mint/60 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-green">
                Pendaftaran Donatur
              </span>
              <span className="text-xs font-semibold text-slate-400">Langkah 1 dari 2</span>
            </div>

            <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Buat Akun Donatur</h1>
            <p className="mt-2 text-sm text-slate-600">
              Mari bergabung bersama Yayasan Rumah Manusia Damai untuk menyebarkan kebaikan dan manfaat seluas-luasnya.
            </p>

            <form onSubmit={handleRegister} className="mt-7 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input mt-1.5 w-full font-medium"
                  placeholder="Contoh: Muhammad Farhan"
                  required
                  minLength={2}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Alamat Email Aktif
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input mt-1.5 w-full font-medium"
                  placeholder="nama@email.com"
                  required
                />
                <p className="mt-1 text-[11px] text-slate-400">Kode verifikasi akun akan dikirimkan ke email ini.</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Nomor Ponsel / WhatsApp
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input mt-1.5 w-full font-medium"
                  placeholder="Contoh: 081234567890"
                  required
                  minLength={8}
                />
                <p className="mt-1 text-[11px] text-slate-400">Dapat digunakan sebagai identitas masuk akun.</p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-brand-green hover:underline"
                  >
                    {showPassword ? "Sembunyikan" : "Tampilkan"}
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input mt-1.5 w-full font-medium"
                  placeholder="Minimal 8 karakter"
                  required
                  minLength={8}
                />
              </div>

              {message && (
                <div
                  className={`rounded-2xl p-4 text-sm leading-relaxed ${
                    message.type === "error"
                      ? "bg-rose-50 text-rose-800 border border-rose-200"
                      : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="btn-primary w-full py-3.5 text-base font-bold shadow-md shadow-brand-green/20 disabled:opacity-50"
              >
                {busy ? "Memproses Pendaftaran..." : "Daftar & Dapatkan Kode Verifikasi"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-500">
              Sudah memiliki akun donatur?{" "}
              <Link href="/login" className="font-bold text-brand-green hover:underline">
                Masuk di Sini
              </Link>
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-green">
                Verifikasi Email Donatur
              </span>
              <span className="text-xs font-semibold text-brand-green">Langkah 2 dari 2</span>
            </div>

            <h1 className="mt-3 text-2xl font-black text-slate-900">Masukkan Kode Verifikasi</h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Kode verifikasi 6 digit telah dikirimkan ke email: <strong className="text-slate-800">{email}</strong>.
            </p>

            {devCode && (
              <div className="mt-4 rounded-xl border border-dashed border-brand-green bg-emerald-50/70 p-3 text-xs text-emerald-900">
                <span className="font-bold">Kode OTP Anda (Simulasi Mode Uji): </span>
                <span className="font-mono text-base font-black text-brand-green tracking-wider">{devCode}</span>
              </div>
            )}

            <form onSubmit={handleVerify} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Kode 6 Digit
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                  className="input mt-1.5 w-full text-center font-mono text-3xl font-extrabold tracking-[0.4em] text-brand-green"
                  placeholder="000000"
                  autoFocus
                  required
                />
                <p className="mt-1 text-center text-xs text-slate-400">Masa aktif kode verifikasi: 15 menit.</p>
              </div>

              {message && (
                <div
                  className={`rounded-2xl p-4 text-sm leading-relaxed ${
                    message.type === "error"
                      ? "bg-rose-50 text-rose-800 border border-rose-200"
                      : message.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-blue-50 text-blue-800 border border-blue-200"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={busy || !otpCode}
                className="btn-primary w-full py-3.5 text-base font-bold shadow-md shadow-brand-green/20 disabled:opacity-50"
              >
                {busy ? "Memverifikasi..." : "Konfirmasi & Masuk Akun"}
              </button>
            </form>

            <div className="mt-6 border-t border-slate-100 pt-5 text-center">
              <p className="text-xs text-slate-500">
                Tidak menerima email?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0 || busy}
                  className="font-bold text-brand-green hover:underline disabled:text-slate-400"
                >
                  {resendCooldown > 0 ? `Kirim ulang (${resendCooldown}s)` : "Kirim Ulang Kode"}
                </button>
              </p>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-3 text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                &larr; Ubah data pendaftaran
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
