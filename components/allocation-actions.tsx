"use client";
import { useState } from "react";

export function AllocationActions({ id }: { id: string }) {
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function decide(decision: "approve" | "reject") {
    setBusy(true); setMessage("");
    const response = await fetch(`/api/admin/allocations/${id}/${decision}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note })
    });
    const data = await response.json();
    setMessage(response.ok ? data.message : data.error || "Gagal memproses keputusan.");
    setBusy(false);
    if (response.ok) window.location.reload();
  }

  return <div className="mt-5 border-t pt-4"><label className="block text-xs font-semibold text-slate-600">Catatan keputusan (wajib jika menolak)<textarea className="input mt-2 min-h-20" value={note} onChange={(e) => setNote(e.target.value)} /></label><div className="mt-3 flex gap-2"><button disabled={busy} onClick={() => decide("approve")} className="btn-primary">Setujui</button><button disabled={busy || note.trim().length < 5} onClick={() => decide("reject")} className="rounded-full border border-red-200 px-5 py-2 text-sm font-bold text-red-700">Tolak</button></div>{message && <p className="mt-2 text-sm">{message}</p>}</div>;
}
