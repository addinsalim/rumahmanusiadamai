import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { rupiah } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [pillars, campaigns] = await Promise.all([
    prisma.pillar.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.campaign.findMany({
      where: { status: "PUBLISHED" },
      include: { pillar: true, donations: { where: { status: "PAID" }, select: { amount: true } } },
      orderBy: { publishedAt: "desc" }, take: 6
    })
  ]);

  return (
    <main>
      <section className="overflow-hidden bg-gradient-to-br from-brand-mint via-white to-white">
        <div className="container-page grid min-h-[520px] items-center gap-10 py-16 md:grid-cols-[1.1fr_.9fr]">
          <div>
            <span className="rounded-full bg-brand-lime/20 px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand-green">Bersama Menebar Kebaikan</span>
            <h1 className="mt-7 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">Kebaikan kecil, dampak besar bagi sesama.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Salurkan kepedulian melalui program kemanusiaan, pendidikan, kesehatan, dan wakaf Al-Qur’an dengan pengelolaan yang amanah dan transparan.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#program" className="btn-primary">Jelajahi Program</a><a href="#tentang" className="btn-secondary">Tentang Yayasan</a></div>
            <p className="mt-5 text-xs text-slate-500">Setiap donasi dilakukan setelah pengguna masuk ke akun.</p>
          </div>
          <div className="relative">
            <div className="rounded-[2rem] bg-brand-green p-8 text-white shadow-xl">
              <div className="text-sm font-semibold text-brand-lime">RUMAH MANUSIA DAMAI</div>
              <div className="mt-12 text-3xl font-bold leading-tight">Menjadi jalan hadirnya manfaat untuk manusia.</div>
              <p className="mt-5 text-white/80">Amanah dalam mengelola. Terbuka dalam melaporkan. Konsisten dalam menebar kebaikan.</p>
              <div className="mt-12 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4"><div className="text-2xl font-bold">4</div><div className="text-xs text-white/75">Pilar program</div></div>
                <div className="rounded-2xl bg-white/10 p-4"><div className="text-2xl font-bold">100%</div><div className="text-xs text-white/75">Komitmen amanah</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="program" className="container-page py-20">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-widest text-brand-green">Fokus Kebaikan</p><h2 className="mt-2 text-3xl font-extrabold">Pilar Program</h2></div><p className="max-w-lg text-slate-500">Beragam ikhtiar untuk menjawab kebutuhan masyarakat melalui program yang terarah.</p></div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, index) => <article key={pillar.id} className="rounded-2xl border bg-white p-6 shadow-sm"><div className="text-3xl">{["📖","💧","🎓","🩺"][index % 4]}</div><h3 className="mt-5 font-bold">{pillar.name}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{pillar.description}</p></article>)}
          {pillars.length === 0 && <p className="text-slate-500">Pilar program akan ditampilkan setelah data awal dimasukkan.</p>}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page">
          <p className="text-sm font-bold uppercase tracking-widest text-brand-green">Aksi Nyata</p><h2 className="mt-2 text-3xl font-extrabold">Campaign Pilihan</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => {
              const collected = campaign.donations.reduce((sum, donation) => sum + donation.amount, 0n);
              const progress = Math.min(100, Number((collected * 100n) / (campaign.targetAmount || 1n)));
              return <article key={campaign.id} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                <div className="grid h-40 place-items-center bg-gradient-to-br from-brand-green to-brand-lime text-5xl text-white">♡</div>
                <div className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-brand-green">{campaign.pillar.name}</p><h3 className="mt-2 text-lg font-bold">{campaign.title}</h3><p className="mt-2 line-clamp-2 text-sm text-slate-500">{campaign.shortDescription}</p>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-green" style={{ width: `${progress}%` }} /></div>
                  <div className="mt-2 flex justify-between text-xs text-slate-500"><span>{rupiah(collected)}</span><span>{progress}%</span></div>
                  <Link href={`/campaign/${campaign.slug}`} className="btn-primary mt-5 w-full">Lihat Campaign</Link>
                </div>
              </article>;
            })}
            {campaigns.length === 0 && <p className="text-slate-500">Campaign akan tampil di sini setelah dipublikasikan oleh admin.</p>}
          </div>
        </div>
      </section>

      <section id="tentang" className="container-page grid gap-8 py-20 md:grid-cols-2">
        <div><p className="text-sm font-bold uppercase tracking-widest text-brand-green">Tentang Kami</p><h2 className="mt-2 text-3xl font-extrabold">Menghadirkan manfaat dengan amanah.</h2></div>
        <p className="leading-8 text-slate-600">Rumah Manusia Damai berikhtiar menjadi jembatan kebaikan antara para donatur dan masyarakat penerima manfaat. Setiap program dikelola berdasarkan kebijakan penggunaan dana dan dilaporkan secara bertanggung jawab.</p>
      </section>
      <section id="transparansi" className="bg-brand-mint py-16"><div className="container-page flex flex-col items-start justify-between gap-5 md:flex-row md:items-center"><div><h2 className="text-2xl font-extrabold">Amanah perlu dibuktikan dengan keterbukaan.</h2><p className="mt-2 text-slate-600">Laporan campaign dan laporan berkala menjadi bagian dari komitmen transparansi.</p></div><Link href="/transparansi" className="btn-primary">Pusat Transparansi</Link></div></section>
    </main>
  );
}
