import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rupiah } from "@/lib/format";
import { AllocationActions } from "@/components/allocation-actions";

export const dynamic = "force-dynamic";

export default async function AllocationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const allowed = ["FINANCE_ADMIN", "SUPER_ADMIN"];
  if (!allowed.some((role) => session.user.roles?.includes(role))) redirect("/dashboard");

  const allocations = await prisma.allocation.findMany({
    include: { campaign: true, requester: { select: { id: true, name: true } }, approvalEvent: { include: { reviewer: { select: { name: true } } } } },
    orderBy: { requestedAt: "desc" }
  });

  return <main className="container-page py-12"><p className="text-sm font-bold uppercase tracking-widest text-brand-green">Administrasi Keuangan</p><h1 className="mt-2 text-3xl font-extrabold">Persetujuan Penyaluran Dana</h1><p className="mt-2 text-slate-500">Satu persetujuan sah dari Admin Keuangan atau Super Admin sudah cukup.</p>
    <div className="mt-8 space-y-4">{allocations.map((item) => <article key={item.id} className="rounded-2xl border bg-white p-6"><div className="flex flex-wrap justify-between gap-3"><div><p className="text-xs text-slate-500">{item.allocationNumber} · {item.campaign.title}</p><h2 className="mt-1 text-xl font-bold">{rupiah(item.amount)}</h2></div><span className="h-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{item.status}</span></div><p className="mt-3 text-sm text-slate-600">{item.purpose}</p><p className="mt-2 text-xs text-slate-400">Pemohon: {item.requester.name}</p>
      {item.approvalEvent && <p className="mt-3 text-sm">Keputusan: {item.approvalEvent.decision} oleh {item.approvalEvent.reviewer.name}. {item.approvalEvent.note}</p>}
      {item.status === "PENDING" && item.requestedBy !== session.user.id && <AllocationActions id={item.id} />}
      {item.status === "PENDING" && item.requestedBy === session.user.id && <p className="mt-3 text-xs text-amber-700">Anda adalah pemohon dan tidak dapat memutuskan pengajuan ini.</p>}
    </article>)}{allocations.length === 0 && <p className="rounded-2xl border bg-white p-6 text-slate-500">Belum ada pengajuan penyaluran.</p>}</div>
  </main>;
}
