import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { rupiah } from "@/lib/format";
import { PROGRAM_DETAILS } from "@/lib/program-details";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = PROGRAM_DETAILS[slug];
  if (!program) return { title: "Program Tidak Ditemukan — Rumah Manusia Damai" };

  return {
    title: `${program.name} — Yayasan Rumah Manusia Damai`,
    description: `${program.summary} ${program.tagline}`
  };
}

export default async function ProgramDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = PROGRAM_DETAILS[slug];
  if (!program) notFound();

  // Ambil campaign aktif di database yang terkait dengan pilar ini
  const campaigns = await prisma.campaign.findMany({
    where: {
      status: "PUBLISHED",
      pillar: { slug }
    },
    include: {
      pillar: true,
      donations: { where: { status: "PAID" }, select: { amount: true } }
    },
    orderBy: { publishedAt: "desc" }
  });

  // Ambil 3 pilar lainnya untuk navigasi lintas program
  const otherPrograms = Object.values(PROGRAM_DETAILS).filter((p) => p.slug !== slug);

  return (
    <main className="bg-slate-50/50 pb-20">
      {/* Hero Header Program */}
      <section className="border-b border-slate-200 bg-gradient-to-br from-brand-mint via-white to-white py-14">
        <div className="container-page">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-brand-green">Beranda</Link>
            <span>/</span>
            <Link href="/#program" className="hover:text-brand-green">Program</Link>
            <span>/</span>
            <span className="text-brand-green">{program.name}</span>
          </nav>

          <div className="mt-8 grid gap-8 md:grid-cols-[1.2fr_.8fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-green">
                <span>{program.icon}</span>
                <span>Pilar Program #{program.no}</span>
              </div>
              <h1 className="mt-4 text-3xl font-extrabold text-slate-900 md:text-5xl leading-tight">
                {program.name}
              </h1>
              <p className="mt-3 text-lg font-medium text-brand-green italic">
                &ldquo;{program.tagline}&rdquo;
              </p>
              <p className="mt-5 text-base leading-8 text-slate-600">
                {program.summary}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#kegiatan" className="btn-primary">
                  Rincian Kegiatan
                </a>
                <a href="#dokumentasi" className="btn-secondary">
                  Dokumentasi Lapangan
                </a>
                <a href="#donasi" className="btn-secondary">
                  Salurkan Donasi
                </a>
              </div>
            </div>

            {/* Kotak Ringkasan Nilai & Rekening */}
            <div className="rounded-3xl border-2 border-brand-green/30 bg-white p-7 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
                Komitmen Amanah
              </span>
              <h3 className="mt-1 text-xl font-bold text-slate-900">
                Dukungan untuk {program.name}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Setiap donasi disalurkan tepat sasaran sesuai kebijakan akad program dan dilaporkan secara terbuka di pusat transparansi.
              </p>
              <div className="mt-6 rounded-2xl bg-brand-mint/60 p-4 border border-brand-green/20">
                <p className="text-[11px] font-bold text-slate-500 uppercase">Rekening Donasi BSI:</p>
                <p className="mt-1 font-mono text-2xl font-black text-brand-green tracking-wider">
                  7383733288
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  a.n. <strong>Yayasan Rumah Manusia Damai</strong>
                </p>
              </div>
              <a
                href={`https://wa.me/62811897319?text=Assalamu%27alaikum,%20saya%20ingin%20berdonasi%20untuk%20program%20${encodeURIComponent(program.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-5 w-full text-xs inline-flex items-center justify-center gap-2"
              >
                <span>Konfirmasi Donasi via WhatsApp</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Latar Belakang & Sasaran Penerima Manfaat */}
      <section className="container-page py-16">
        <div className="grid gap-10 md:grid-cols-2 items-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green">Latar Belakang</span>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Urgensi & Landasan Program</h2>
            <p className="mt-4 text-base leading-8 text-slate-600 whitespace-pre-line">
              {program.background}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green">Target Program</span>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Sasaran Penerima Manfaat</h2>
            <p className="mt-2 text-sm text-slate-500">
              Penerima manfaat program {program.name} ditetapkan melalui verifikasi data yang amanah dan transparan:
            </p>
            <ul className="mt-6 space-y-3">
              {program.targetBeneficiaries.map((target, idx) => (
                <li key={idx} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-green text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-semibold text-slate-700">{target}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Rincian Kegiatan Resmi Program */}
      <section id="kegiatan" className="bg-white py-16 border-y border-slate-200">
        <div className="container-page">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green">Struktur Program</span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Rincian Kegiatan Utama</h2>
            <p className="mt-2 text-sm text-slate-500">
              Rangkaian aktivitas terpadu yang dirancang untuk mewujudkan dampak yang terukur dan berkesinambungan.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {program.activities.map((act) => (
              <div
                key={act.code}
                className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-slate-50/50 p-6 shadow-xs transition hover:border-brand-green hover:bg-white hover:shadow-sm"
              >
                <div>
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-green text-white font-extrabold text-sm shadow-xs">
                    {act.code}
                  </span>
                  <h3 className="mt-4 text-base font-bold text-slate-900 leading-snug">
                    {act.title}
                  </h3>
                  <p className="mt-3 text-xs leading-6 text-slate-600">
                    {act.desc}
                  </p>
                </div>
                <div className="mt-5 border-t border-slate-200/60 pt-3 text-[11px] font-semibold text-brand-green flex items-center gap-1">
                  <span>✓ Program Aktif</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dokumentasi Aksi & Penyaluran Lapangan */}
      <section id="dokumentasi" className="container-page py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green">Bukti Lapangan</span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Dokumentasi Aksi & Penyaluran</h2>
          </div>
          <p className="max-w-md text-sm text-slate-500">
            Amanah masyarakat yang telah dan terus direalisasikan oleh tim relawan Rumah Manusia Damai di berbagai titik.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {program.documentations.map((doc) => (
            <article
              key={doc.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-xs transition hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-brand-mint px-3 py-1 text-[11px] font-bold text-brand-green uppercase">
                    {doc.tag}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{doc.date}</span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 leading-snug">
                  {doc.title}
                </h3>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <span>📍</span>
                  <span>{doc.location}</span>
                </p>
                <p className="mt-4 text-xs leading-6 text-slate-600">
                  {doc.summary}
                </p>
              </div>
              <div className="mt-6 rounded-2xl bg-slate-50 p-3.5 border border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Capaian:</span>
                <span className="text-xs font-bold text-brand-green">{doc.metric}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Campaign Pilihan Terkait (Database) */}
      {campaigns.length > 0 && (
        <section className="bg-white py-16 border-t border-slate-200">
          <div className="container-page">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green">Aksi Nyata</span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Campaign Terbuka untuk {program.name}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => {
                const collected = campaign.donations.reduce((sum, item) => sum + item.amount, 0n);
                const progress = Math.min(100, Number((collected * 100n) / (campaign.targetAmount || 1n)));
                return (
                  <article key={campaign.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
                    <div className="grid h-36 place-items-center bg-gradient-to-br from-brand-green to-brand-lime text-4xl text-white">
                      {program.icon}
                    </div>
                    <div className="p-6">
                      <h3 className="text-base font-bold text-slate-900">{campaign.title}</h3>
                      <p className="mt-2 line-clamp-2 text-xs text-slate-500">{campaign.shortDescription}</p>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-brand-green" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{rupiah(collected)}</span>
                        <span>{progress}%</span>
                      </div>
                      <Link href={`/campaign/${campaign.slug}`} className="btn-primary mt-4 w-full text-xs">
                        Donasi Campaign Ini
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Kotak Donasi & Partisipasi */}
      <section id="donasi" className="container-page py-16">
        <div className="rounded-3xl bg-gradient-to-br from-brand-green to-[#0a6631] p-8 md:p-12 text-white shadow-xl">
          <div className="max-w-2xl">
            <span className="rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-lime">
              Salurkan Kepedulian
            </span>
            <h2 className="mt-4 text-2xl md:text-4xl font-extrabold leading-tight">
              Mari Bersama Menghadirkan Kebaikan Nyata Melalui {program.name}
            </h2>
            <p className="mt-4 text-sm md:text-base leading-relaxed text-white/85">
              Setiap rupiah donasi Anda menjadi energi kebermanfaatan bagi mereka yang membutuhkan. Mari bersama wujudkan kedamaian dan kesejahteraan masyarakat.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 items-center border-t border-white/15 pt-8">
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm border border-white/20">
              <p className="text-xs font-semibold text-brand-lime uppercase">Rekening Donasi Resmi:</p>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="font-mono text-3xl font-black text-white tracking-wider">7383733288</span>
                <span className="rounded-md bg-white/20 px-2.5 py-0.5 text-xs font-bold text-white">BSI</span>
              </div>
              <p className="mt-2 text-xs text-white/80">a.n. <strong>Yayasan Rumah Manusia Damai</strong></p>
            </div>

            <div className="space-y-3">
              <a
                href={`https://wa.me/62811897319?text=Assalamu%27alaikum,%20saya%20sudah%20transfer%20donasi%20untuk%20program%20${encodeURIComponent(program.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-slate-800 hover:bg-brand-mint transition shadow-sm"
              >
                <span>Konfirmasi Donasi (0811 897 319)</span>
                <span className="text-brand-green font-extrabold text-base">WhatsApp →</span>
              </a>
              <Link href="/transparansi" className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition border border-white/20">
                <span>Lihat Laporan Transparansi</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Navigasi Lintas Pilar Program */}
      <section className="container-page pt-4 pb-12 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Pilar Program Lainnya
          </h3>
          <Link href="/#program" className="text-xs font-bold text-brand-green hover:underline">
            ← Kembali ke Beranda
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {otherPrograms.map((other) => (
            <Link
              key={other.slug}
              href={`/program/${other.slug}`}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-brand-green hover:shadow-sm"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-mint text-2xl">
                {other.icon}
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-green">Pilar #{other.no}</span>
                <h4 className="text-sm font-bold text-slate-900">{other.name}</h4>
                <p className="line-clamp-1 text-xs text-slate-500">{other.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
