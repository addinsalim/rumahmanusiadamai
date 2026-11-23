"use client";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(formData: FormData) {
    setBusy(true); setMessage("");
    const response = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      name: formData.get("name"), email: formData.get("email"), password: formData.get("password")
    }) });
    const data = await response.json();
    setMessage(response.ok ? "Akun berhasil dibuat. Silakan masuk." : data.error || "Registrasi gagal.");
    setBusy(false);
  }
  return <main className="container-page grid min-h-[70vh] place-items-center py-12"><div className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-sm">
    <p className="text-sm font-bold uppercase tracking-widest text-brand-green">Bergabung</p><h1 className="mt-2 text-3xl font-extrabold">Buat akun donatur</h1>
    <form action={submit} className="mt-7 space-y-4">
      <label className="block text-sm font-semibold">Nama lengkap<input name="name" className="input mt-2" required minLength={2} /></label>
      <label className="block text-sm font-semibold">Email<input name="email" type="email" className="input mt-2" required /></label>
      <label className="block text-sm font-semibold">Password<input name="password" type="password" minLength={8} className="input mt-2" required /></label>
      <button disabled={busy} className="btn-primary w-full">{busy ? "Memproses..." : "Daftar"}</button>
    </form>
    {message && <p className="mt-4 rounded-xl bg-brand-mint p-3 text-sm">{message}</p>}
    <p className="mt-6 text-center text-xs text-slate-500">Sudah memiliki akun? <Link href="/login" className="font-bold text-brand-green">Masuk</Link></p>
  </div></main>;
}
