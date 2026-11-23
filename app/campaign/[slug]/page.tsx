import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { rupiah } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaign = await prisma.campaign.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { pillar: true, policies: { where: { isActive: true }, take: 1, orderBy: { version: "desc" } }, donations: { where: { status: "PAID" }, select: { amount: true } } }
  });
  if (!campaign) notFound();
  const collected = campaign.donations.reduce((sum, item) => sum + item.amount, 0n);
  const percent = Math.min(100, Number(collected * 100n / (campaign.targetAmount || 1n)));
  return <main className="container-page py-12">
    <Link href="/" className="text-sm font-semibold text-brand-green">← Kembali</Link>
    <div className="mt-6 grid gap-10 md:grid-cols-[1.2fr_.8fr]">
      <article><div className="grid h-64 place-items-center rounded-3xl bg-gradient-to-br from-brand-green to-brand-lime text-6xl text-white">♡</div><p className="mt-7 text-xs font-bold uppercase tracking-widest text-brand-green">{campaign.pillar.name}</p><h1 className="mt-2 text-3xl font-extrabold">{campaign.title}</h1><p className="mt-5 leading-8 text-slate-600">{campaign.description}</p>
        {campaign.policies[0] && <div className="mt-8 rounded-2xl border bg-white p-6"><h2 className="font-bold">Kebijakan Penggunaan Dana — Versi {campaign.policies[0].version}</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{campaign.policies[0].policyDescription}</p></div>}
      </article>
      <aside className="h-fit rounded-3xl border bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Dana terkumpul</p><p className="mt-2 text-2xl font-extrabold">{rupiah(collected)}</p><div className="mt-4 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-brand-green" style={{width:`${percent}%`}} /></div><div className="mt-2 flex justify-between text-xs text-slate-500"><span>{percent}% tercapai</span><span>Target {rupiah(campaign.targetAmount)}</span></div><Link href={`/donasi/${campaign.id}`} className="btn-primary mt-6 w-full">Donasi Sekarang</Link><p className="mt-3 text-xs leading-5 text-slate-400">Login diperlukan sebelum melakukan donasi.</p></aside>
    </div>
  </main>;
}
