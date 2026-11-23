import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rupiah } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const roles = session.user.roles ?? [];
  const isAdmin = roles.some((role) => ["CONTENT_ADMIN","CAMPAIGN_ADMIN","FINANCE_ADMIN","SUPER_ADMIN"].includes(role));
  const donations = await prisma.donation.findMany({
    where: { userId: session.user.id },
    include: { campaign: true },
    orderBy: { createdAt: "desc" },
    take: 20
  });
  const totalPaid = donations.filter((item) => item.status === "PAID").reduce((sum, item) => sum + item.amount, 0n);

  return <main className="container-page py-12">
    <p className="text-sm font-bold uppercase tracking-widest text-brand-green">Ruang Donatur</p>
    <h1 className="mt-2 text-3xl font-extrabold">Halo, {session.user.name || "Sahabat Kebaikan"}</h1>
    <div className="mt-8 grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl bg-brand-green p-6 text-white"><p className="text-sm text-white/75">Total donasi berhasil</p><p className="mt-2 text-2xl font-bold">{rupiah(totalPaid)}</p></div>
      <div className="rounded-2xl border bg-white p-6"><p className="text-sm text-slate-500">Jumlah transaksi</p><p className="mt-2 text-2xl font-bold">{donations.length}</p></div>
      <div className="rounded-2xl border bg-white p-6"><p className="text-sm text-slate-500">Akses</p><p className="mt-2 text-lg font-bold">{isAdmin ? "Donatur & Admin" : "Donatur"}</p></div>
    </div>
    {isAdmin && <div className="mt-8 rounded-2xl border bg-white p-6"><h2 className="font-bold">Administrasi</h2><p className="mt-1 text-sm text-slate-500">Akses pengelolaan sesuai role akun.</p><Link href="/admin/allocations" className="btn-primary mt-4">Pengajuan Penyaluran Dana</Link></div>}
    <section className="mt-10 rounded-2xl border bg-white p-6"><h2 className="text-xl font-bold">Riwayat Donasi</h2>
      <div className="mt-5 space-y-3">{donations.map((donation) => <div key={donation.id} className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 last:border-0"><div><p className="font-semibold">{donation.campaign.title}</p><p className="text-xs text-slate-500">{donation.donationNumber} · {donation.status}</p></div><p className="font-bold">{rupiah(donation.amount)}</p></div>)}{donations.length === 0 && <p className="text-sm text-slate-500">Belum ada donasi.</p>}</div>
    </section>
  </main>;
}
