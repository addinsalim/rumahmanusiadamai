"use client";
import { useState } from "react";

export function DonationForm({ campaignId }: { campaignId: string }) {
  const [amount, setAmount] = useState("50000");
  const [anonymous, setAnonymous] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    const response = await fetch("/api/donations", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId, amount: Number(amount), isAnonymous: anonymous, donorDisplayName: displayName })
    });
    const data = await response.json();
    setMessage(response.ok ? `Donasi ${data.donation.donationNumber} berhasil dibuat. Pembayaran akan diaktifkan setelah konfigurasi Midtrans Sandbox.` : data.error || "Donasi gagal dibuat.");
    setBusy(false);
  }

  return <form onSubmit={submit} className="mt-8 space-y-5 rounded-3xl border bg-white p-7">
    <label className="block text-sm font-semibold">Nominal donasi (Rupiah)<input className="input mt-2" type="number" min="1000" step="1000" value={amount} onChange={(e) => setAmount(e.target.value)} required /></label>
    <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} /> Tampilkan sebagai donatur anonim (default)</label>
    {!anonymous && <label className="block text-sm font-semibold">Nama yang ditampilkan<input className="input mt-2" value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={150} placeholder="Nama donatur" /></label>}
    <button disabled={busy} className="btn-primary w-full">{busy ? "Memproses..." : "Buat Donasi"}</button>
    {message && <p className="rounded-xl bg-brand-mint p-4 text-sm">{message}</p>}
  </form>;
}
