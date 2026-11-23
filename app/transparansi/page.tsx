import { prisma } from "@/lib/prisma";
import { rupiah } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function TransparencyPage() {
  const [paid, disbursed] = await Promise.all([
    prisma.donation.aggregate({ where: { status: "PAID" }, _sum: { amount: true }, _count: true }),
    prisma.disbursement.aggregate({ where: { status: "COMPLETED" }, _sum: { amount: true }, _count: true })
  ]);
  return <main className="container-page py-14"><p className="text-sm font-bold uppercase tracking-widest text-brand-green">Akuntabilitas</p><h1 className="mt-2 text-4xl font-extrabold">Pusat Transparansi</h1><p className="mt-3 max-w-2xl leading-7 text-slate-500">Ringkasan ini dihitung dari transaksi donasi yang telah dibayar dan penyaluran yang telah direalisasikan. Nilai bukan saldo kas tersedia.</p>
    <div className="mt-9 grid gap-4 md:grid-cols-2"><div className="rounded-3xl bg-brand-green p-7 text-white"><p className="text-sm text-white/75">Total donasi berhasil</p><p className="mt-2 text-3xl font-extrabold">{rupiah(paid._sum.amount ?? 0n)}</p><p className="mt-2 text-xs text-white/70">{paid._count} transaksi</p></div><div className="rounded-3xl border bg-white p-7"><p className="text-sm text-slate-500">Total penyaluran terealisasi</p><p className="mt-2 text-3xl font-extrabold">{rupiah(disbursed._sum.amount ?? 0n)}</p><p className="mt-2 text-xs text-slate-500">{disbursed._count} catatan penyaluran</p></div></div>
    <p className="mt-8 rounded-2xl bg-brand-mint p-5 text-sm leading-6 text-slate-600">Laporan publik lengkap per campaign dan periode dapat dikembangkan dari data transaksi, refund, kebijakan penggunaan dana, alokasi, dan bukti penyaluran. Informasi pribadi donatur tidak ditampilkan.</p>
  </main>;
}
