"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const emailParam = searchParams.get("email") || "";
  const isFirstGoogle = searchParams.get("firstGoogle") === "true";

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      setMessage({ text: "Mohon masukkan alamat email Anda.", type: "error" });
      return;
    }
    if (!code || code.trim().length < 4) {
      setMessage({ text: "Mohon masukkan kode verifikasi 6 digit.", type: "error" });
      return;
    }

    setBusy(true);
    setMessage(null);

    try {
      const res = await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: code.trim() })
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({
          text: "Selamat! Alamat email Anda berhasil diverifikasi. Mengalihkan ke halaman masuk...",
          type: "success"
        });
        setTimeout(() => {
          router.push(`/login?verified=true&email=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        setMessage({ text: data.error || "Verifikasi gagal. Pastikan kode benar.", type: "error" });
      }
    } catch {
      setMessage({ text: "Gagal terhubung ke server. Periksa koneksi Anda.", type: "error" });
    } finally {
      setBusy(false);
    }
  }

  async function handleResend() {
    if (!email || cooldown > 0 || resending) return;

    setResending(true);
    setMessage(null);

    try {
      const res = await fetch("/api/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() })
      });
      const data = await res.json();

      if (res.ok) {
        setCooldown(60);
        setMessage({
          text: data.simulatedCode
            ? `Kode verifikasi baru terkirim! [Mode Dev Kode: ${data.simulatedCode}]`
            : "Kode verifikasi baru telah dikirimkan ke kotak masuk email Anda.",
          type: "info"
        });
      } else {
        setMessage({ text: data.error || "Gagal mengirim ulang kode.", type: "error" });
      }
    } catch {
      setMessage({ text: "Terjadi kesalahan saat meminta kode baru.", type: "error" });
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-brand-green">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Keamanan Akun
        </span>
        <span className="text-xs text-slate-400">Langkah Terakhir</span>
      </div>

      <h1 className="mt-3 text-2xl font-black text-slate-900">Verifikasi Email</h1>

      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
        {isFirstGoogle
          ? "Untuk pendaftaran pertama menggunakan akun Gmail, masukkan kode verifikasi yang telah kami kirimkan ke email Anda. Verifikasi ini hanya dilakukan sekali."
          : "Kami telah mengirimkan kode verifikasi 6 digit ke alamat email donatur Anda. Silakan masukkan kode tersebut di bawah ini."}
      </p>

      <form onSubmit={handleVerify} className="mt-6 space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Alamat Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input mt-1.5 w-full bg-slate-50 font-medium text-slate-700"
            placeholder="nama@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Kode Verifikasi (6 Digit OTP)
          </label>
          <input
            type="text"
            maxLength={8}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
            className="input mt-1.5 w-full text-center font-mono text-2xl font-bold tracking-[0.4em] text-brand-green placeholder:tracking-normal placeholder:text-sm placeholder:font-sans placeholder:text-slate-300"
            placeholder="Contoh: 123456"
            autoFocus
            required
          />
          <p className="mt-1.5 text-xs text-slate-400">Kode berlaku selama 15 menit dari saat pendaftaran.</p>
        </div>

        <button
          type="submit"
          disabled={busy || !code}
          className="btn-primary w-full py-3 text-base font-bold shadow-md shadow-brand-green/20 disabled:opacity-50"
        >
          {busy ? "Memverifikasi..." : "Verifikasi & Aktifkan Akun"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-5 rounded-2xl p-4 text-sm leading-relaxed ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : message.type === "error"
              ? "bg-rose-50 text-rose-800 border border-rose-200"
              : "bg-blue-50 text-blue-800 border border-blue-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mt-6 border-t border-slate-100 pt-5 text-center">
        <p className="text-xs text-slate-500">
          Tidak menerima kode verifikasi?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resending}
            className="font-bold text-brand-green hover:underline disabled:text-slate-400"
          >
            {cooldown > 0 ? `Kirim ulang dalam (${cooldown}s)` : resending ? "Mengirim..." : "Kirim Ulang Kode"}
          </button>
        </p>

        <p className="mt-3 text-xs text-slate-400">
          Sudah selesai atau salah email?{" "}
          <Link href="/login" className="font-semibold text-slate-600 hover:text-brand-green">
            Kembali ke Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="container-page grid min-h-[75vh] place-items-center py-12">
      <Suspense
        fallback={
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Memuat form verifikasi...
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </main>
  );
}
