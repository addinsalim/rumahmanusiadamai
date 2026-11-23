import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { rupiah } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const campaigns = await prisma.campaign.findMany({
    where: { status: "PUBLISHED" },
    include: { pillar: true, donations: { where: { status: "PAID" }, select: { amount: true } } },
    orderBy: { publishedAt: "desc" },
    take: 6
  });

  const programs = [
    {
      no: "1",
      icon: "📖",
      title: "Wakaf Al-Qur'an",
      desc: "Gerakan kebaikan untuk meningkatkan kecintaan dan pemahaman terhadap Al-Qur'an melalui penyediaan, distribusi, dan wakaf mushaf Al-Qur'an bagi masyarakat yang membutuhkan.",
      activities: [
        "Wakaf Al-Qur'an untuk masjid, musholla, pesantren, dan sekolah",
        "Distribusi Al-Qur'an ke daerah terpencil",
        "Program Al-Qur'an untuk anak yatim dan keluarga prasejahtera",
        "Pembinaan dan kegiatan belajar membaca Al-Qur'an",
        "Digitalisasi gerakan wakaf Al-Qur'an"
      ]
    },
    {
      no: "2",
      icon: "🎓",
      title: "Pendidikan",
      desc: "Membangun generasi yang cerdas, berkarakter, berakhlak mulia, dan memiliki kesempatan yang sama untuk memperoleh pendidikan yang berkualitas.",
      activities: [
        "Beasiswa pendidikan bagi anak yatim dan kurang mampu",
        "Bantuan sarana dan prasarana pendidikan",
        "Pendirian dan pengembangan rumah belajar",
        "Pelatihan keterampilan dan pendidikan vokasi",
        "Pendidikan karakter dan literasi",
        "Program dana abadi pendidikan untuk keberlanjutan beasiswa"
      ]
    },
    {
      no: "3",
      icon: "🩺",
      title: "Kesehatan",
      desc: "Meningkatkan kualitas hidup masyarakat melalui akses pelayanan kesehatan yang terjangkau, merata, dan berorientasi pada pencegahan.",
      activities: [
        "Bantuan biaya pengobatan masyarakat prasejahtera",
        "Pemeriksaan kesehatan gratis",
        "Program kesehatan ibu dan anak",
        "Penyediaan obat dan alat kesehatan",
        "Penyediaan air bersih dan sanitasi",
        "Edukasi pola hidup sehat dan pencegahan penyakit"
      ]
    },
    {
      no: "4",
      icon: "🤝",
      title: "Sosial Kemanusiaan",
      desc: "Membangun solidaritas dan kepedulian sosial untuk membantu sesama manusia tanpa membedakan latar belakang, suku, maupun golongan.",
      activities: [
        "Santunan anak yatim dan dhuafa",
        "Bantuan pangan dan kebutuhan pokok",
        "Bantuan tanggap darurat bencana",
        "Program peduli lansia dan penyandang disabilitas",
        "Bantuan rumah layak huni",
        "Program pemberdayaan ekonomi keluarga",
        "Gerakan perdamaian dan solidaritas kemanusiaan"
      ]
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="overflow-hidden bg-gradient-to-br from-brand-mint via-white to-white border-b border-slate-100">
        <div className="container-page grid min-h-[540px] items-center gap-10 py-16 md:grid-cols-[1.1fr_.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-lime/20 px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand-green">
              <span className="h-2 w-2 rounded-full bg-brand-green"></span>
              Yayasan Rumah Manusia Damai
            </span>
            <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Bersama Menebar Kebaikan, Membangun Kemandirian.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Lembaga sosial dan kemanusiaan yang berikhtiar menghimpun, mengelola, dan menyalurkan potensi ZISWAF dan kepedulian masyarakat melalui program pemberdayaan berkelanjutan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#program" className="btn-primary">Jelajahi Program</a>
              <a href="#tentang" className="btn-secondary">Profil Yayasan</a>
              <a href="#pengurus" className="btn-secondary">Pengurus</a>
            </div>
            <div className="mt-8 flex items-center gap-6 border-t border-slate-200/60 pt-6 text-xs text-slate-500">
              <div>✓ ZISWAF Amanah</div>
              <div>✓ Berkelanjutan</div>
              <div>✓ Terbuka & Akuntabel</div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-[2.5rem] bg-gradient-to-br from-brand-green to-[#0a6631] p-8 md:p-10 text-white shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest text-brand-lime uppercase">Prinsip & Landasan</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">Lembaga Sosial & Kemanusiaan</span>
              </div>
              <h2 className="mt-8 text-2xl md:text-3xl font-bold leading-snug">
                Menjadi jalan hadirnya manfaat nyata yang berkelanjutan bagi masyarakat.
              </h2>
              <p className="mt-5 text-sm md:text-base leading-relaxed text-white/85">
                Bukan hanya berorientasi pada bantuan sesaat, tetapi membangun kemandirian agar manfaatnya dapat terus dirasakan oleh generasi sekarang maupun masa depan.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-extrabold text-brand-lime">4 Pilar</div>
                  <div className="mt-1 text-xs text-white/80">Program utama pemberdayaan</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-extrabold text-white">100%</div>
                  <div className="mt-1 text-xs text-white/80">Komitmen amanah & transparansi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profil dan Latar Belakang */}
      <section id="tentang" className="container-page py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-green">Tentang Kami</p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">Profil dan Latar Belakang</h2>
        </div>
        <div className="mt-8 grid gap-10 md:grid-cols-2 items-start">
          <div className="space-y-5 text-base leading-8 text-slate-600">
            <p>
              <strong className="text-slate-900">Yayasan Rumah Manusia Damai</strong> merupakan Lembaga Sosial dan Kemanusiaan yang didirikan atas dasar kepedulian terhadap nilai-nilai kemanusiaan dan kesejahteraan masyarakat.
            </p>
            <p>
              Yayasan hadir sebagai wadah untuk menghimpun, mengelola, dan menyalurkan potensi kebaikan masyarakat melalui berbagai program pemberdayaan yang berkelanjutan, dengan mengedepankan nilai-nilai keimanan, kepedulian, persaudaraan, gotong royong, dan perdamaian.
            </p>
            <p>
              Kami meyakini bahwa setiap manusia memiliki hak untuk memperoleh kehidupan yang layak, pendidikan yang berkualitas, pelayanan kesehatan, serta kesempatan untuk berkembang dan hidup secara bermartabat.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-7 md:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Komitmen Pengelolaan ZISWAF</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Yayasan Rumah Manusia Damai berkomitmen membangun gerakan kebaikan melalui pengelolaan dana sosial, zakat, infak, sedekah, dan wakaf (ZISWAF), serta berkolaborasi dengan berbagai pihak untuk menghadirkan manfaat yang nyata bagi masyarakat.
            </p>
            <div className="mt-6 rounded-2xl bg-brand-mint p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-green">Nilai-Nilai Utama</div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                <span className="rounded-lg bg-white px-3 py-1.5 shadow-xs">Keimanan</span>
                <span className="rounded-lg bg-white px-3 py-1.5 shadow-xs">Kepedulian</span>
                <span className="rounded-lg bg-white px-3 py-1.5 shadow-xs">Persaudaraan</span>
                <span className="rounded-lg bg-white px-3 py-1.5 shadow-xs">Gotong Royong</span>
                <span className="rounded-lg bg-white px-3 py-1.5 shadow-xs">Perdamaian</span>
              </div>
            </div>
            <p className="mt-5 text-xs text-slate-500 leading-relaxed">
              *Yayasan tidak hanya berorientasi pada pemberian bantuan sesaat, tetapi juga membangun program pemberdayaan dan kemandirian agar manfaatnya berkelanjutan.
            </p>
          </div>
        </div>
      </section>

      {/* Program Utama & Rincian Kegiatan */}
      <section id="program" className="bg-slate-50 py-20 border-y border-slate-200">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-green">Fokus & Aksi Nyata</p>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">4 Pilar Program Kebaikan</h2>
            </div>
            <p className="max-w-md text-sm text-slate-500">
              Ikhtiar terstruktur dan berkesinambungan untuk menjawab kebutuhan mendasar masyarakat.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {programs.map((prog) => (
              <article key={prog.no} className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 md:p-8 shadow-sm transition hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-mint text-2xl">
                      {prog.icon}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      Pilar {prog.no}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-900">{prog.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{prog.desc}</p>

                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-green">Rincian Kegiatan:</h4>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      {prog.activities.map((act, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-lime/30 text-[10px] font-bold text-brand-green">
                            ✓
                          </span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Campaign Pilihan */}
      {campaigns.length > 0 && (
        <section className="bg-white py-20">
          <div className="container-page">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-green">Donasi Sekarang</p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Campaign Pilihan</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => {
                const collected = campaign.donations.reduce((sum, donation) => sum + donation.amount, 0n);
                const progress = Math.min(100, Number((collected * 100n) / (campaign.targetAmount || 1n)));
                return (
                  <article key={campaign.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                    <div className="grid h-40 place-items-center bg-gradient-to-br from-brand-green to-brand-lime text-5xl text-white">
                      ♡
                    </div>
                    <div className="p-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-green">{campaign.pillar.name}</p>
                      <h3 className="mt-2 text-lg font-bold text-slate-900">{campaign.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-500">{campaign.shortDescription}</p>
                      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-brand-green" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{rupiah(collected)}</span>
                        <span>{progress}%</span>
                      </div>
                      <Link href={`/campaign/${campaign.slug}`} className="btn-primary mt-5 w-full">
                        Lihat Campaign
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Susunan Pengurus Yayasan */}
      <section id="pengurus" className="container-page py-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-green">Struktur Organisasi</p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
            Pengurus Yayasan Rumah Manusia Damai
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            Dipimpin dan dibina oleh tokoh profesional dan cendekiawan yang berintegritas dan berdedikasi tinggi bagi umat dan bangsa.
          </p>
        </div>

        <div className="mt-14 space-y-14">
          {/* Dewan Pembina */}
          <div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-brand-green"></span>
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider">Dewan Pembina</h3>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Dr. KH. Rusli Effendi */}
              <div className="group overflow-hidden rounded-3xl border border-brand-green/30 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100">
                    <Image
                      src="/pengurus/rusli-effendi.jpg"
                      alt="Dr. KH. Rusli Effendi, S.Pd.I., S.E., M.Si."
                      fill
                      className="object-cover object-top transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <span className="inline-block rounded-full bg-brand-green px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wide">
                    Ketua Pembina
                  </span>
                  <h4 className="mt-3 font-bold text-slate-900 text-base leading-snug">
                    Dr. KH. Rusli Effendi, S.Pd.I., S.E., M.Si.
                  </h4>
                </div>
                <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  Ketua Dewan Pembina Yayasan
                </p>
              </div>

              {/* Prof. Dr. Ir. Muhammad Nadratuzzaman Hosen */}
              <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100">
                    <Image
                      src="/pengurus/nadratuzzaman-hosen.jpg"
                      alt="Prof. Dr. Ir. Muhammad Nadratuzzaman Hosen, M.S., M.Sc., Ph.D."
                      fill
                      className="object-cover object-top transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 uppercase tracking-wide">
                    Anggota Pembina
                  </span>
                  <h4 className="mt-3 font-bold text-slate-900 text-base leading-snug">
                    Prof. Dr. Ir. Muhammad Nadratuzzaman Hosen, M.S., M.Sc., Ph.D.
                  </h4>
                </div>
                <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  Anggota Dewan Pembina
                </p>
              </div>

              {/* Prof. Dr. H. Waryono Abdul Ghofur */}
              <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100">
                    <Image
                      src="/pengurus/waryono-abdul-ghofur.jpg"
                      alt="Prof. Dr. H. Waryono Abdul Ghofur, M.Ag."
                      fill
                      className="object-cover object-top transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 uppercase tracking-wide">
                    Anggota Pembina
                  </span>
                  <h4 className="mt-3 font-bold text-slate-900 text-base leading-snug">
                    Prof. Dr. H. Waryono Abdul Ghofur, M.Ag.
                  </h4>
                </div>
                <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  Anggota Dewan Pembina
                </p>
              </div>
            </div>
          </div>

          {/* Dewan Pengawas */}
          <div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-brand-green"></span>
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider">Dewan Pengawas</h3>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Irjen Pol (Purn) Dra. Desy Andriani */}
              <div className="group overflow-hidden rounded-3xl border border-brand-green/30 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100">
                    <Image
                      src="/pengurus/desy-andriani.jpg"
                      alt="Irjen Pol (Purn) Dra. Desy Andriani"
                      fill
                      className="object-cover object-top transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <span className="inline-block rounded-full bg-brand-green px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wide">
                    Ketua Pengawas
                  </span>
                  <h4 className="mt-3 font-bold text-slate-900 text-base leading-snug">
                    Irjen Pol (Purn) Dra. Desy Andriani
                  </h4>
                </div>
                <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  Ketua Dewan Pengawas Yayasan
                </p>
              </div>

              {/* Brigjen TNI Heri Abriyadi */}
              <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100">
                    <Image
                      src="/pengurus/heri-abriyadi.jpg"
                      alt="Brigjen TNI Heri Abriyadi, S.E., M.Han."
                      fill
                      className="object-cover object-top transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 uppercase tracking-wide">
                    Anggota Pengawas
                  </span>
                  <h4 className="mt-3 font-bold text-slate-900 text-base leading-snug">
                    Brigjen TNI Heri Abriyadi, S.E., M.Han.
                  </h4>
                </div>
                <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  Anggota Dewan Pengawas
                </p>
              </div>

              {/* Betha A. Djardjis */}
              <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100">
                    <Image
                      src="/pengurus/betha-djardjis.jpg"
                      alt="Betha A. Djardjis"
                      fill
                      className="object-cover object-top transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 uppercase tracking-wide">
                    Anggota Pengawas
                  </span>
                  <h4 className="mt-3 font-bold text-slate-900 text-base leading-snug">
                    Betha A. Djardjis
                  </h4>
                </div>
                <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  Anggota Dewan Pengawas
                </p>
              </div>
            </div>
          </div>

          {/* Pengurus Harian */}
          <div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-brand-green"></span>
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider">Pengurus Harian</h3>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {/* Irsal, S.H. */}
              <div className="group overflow-hidden rounded-3xl border border-brand-green/30 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100">
                    <Image
                      src="/pengurus/irsal.jpg"
                      alt="Irsal, S.H."
                      fill
                      className="object-cover object-top transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <span className="inline-block rounded-full bg-brand-green/10 px-3 py-1 text-[11px] font-bold text-brand-green uppercase tracking-wide">
                    Ketua
                  </span>
                  <h4 className="mt-3 font-bold text-slate-900 text-base leading-snug">
                    Irsal, S.H.
                  </h4>
                </div>
                <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  Ketua Yayasan
                </p>
              </div>

              {/* Poppy Jane Intania */}
              <div className="group overflow-hidden rounded-3xl border border-brand-green/30 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100">
                    <Image
                      src="/pengurus/poppy-jane-intania.jpg"
                      alt="Poppy Jane Intania, M.Kes., M.M."
                      fill
                      className="object-cover object-top transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <span className="inline-block rounded-full bg-brand-green/10 px-3 py-1 text-[11px] font-bold text-brand-green uppercase tracking-wide">
                    Sekretaris
                  </span>
                  <h4 className="mt-3 font-bold text-slate-900 text-base leading-snug">
                    Poppy Jane Intania, M.Kes., M.M.
                  </h4>
                </div>
                <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  Sekretaris Yayasan
                </p>
              </div>

              {/* Dinul Hasan */}
              <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100">
                    <Image
                      src="/pengurus/dinul-hasan.jpg"
                      alt="Dinul Hasan"
                      fill
                      className="object-cover object-top transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <span className="inline-block rounded-full bg-brand-green/10 px-3 py-1 text-[11px] font-bold text-brand-green uppercase tracking-wide">
                    Bendahara
                  </span>
                  <h4 className="mt-3 font-bold text-slate-900 text-base leading-snug">
                    Dinul Hasan
                  </h4>
                </div>
                <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  Bendahara Yayasan
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Informasi Kontak & Rekening Resmi */}
      <section id="kontak" className="bg-slate-50 py-20 border-t border-slate-200">
        <div className="container-page">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-brand-lime/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-green">
              Informasi Resmi & Layanan
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
              Kantor & Rekening Yayasan
            </h2>
            <p className="mt-2 text-sm font-semibold text-brand-green italic">
              &ldquo;Menebar Kebaikan, Membangun Kemanusiaan, Mewujudkan Kedamaian.&rdquo;
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {/* Card Kantor Cabang */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs flex flex-col justify-between">
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-mint text-2xl">
                  📍
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900">Kantor Cabang (Branch Office)</h3>
                <p className="mt-1 text-xs font-bold text-brand-green uppercase">
                  Yayasan Rumah Manusia Damai (RMD)
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Jln. Madrasah 2 No. 28 B, RT 06 RW 10, Duren Sawit, Jakarta Timur 13440.
                </p>
              </div>
              <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-400">
                Pusat operasional dan koordinasi kegiatan kemanusiaan.
              </div>
            </div>

            {/* Card Rekening Bank */}
            <div className="rounded-3xl border-2 border-brand-green bg-brand-mint/50 p-7 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-green text-2xl text-white">
                    🏦
                  </div>
                  <span className="rounded-full bg-brand-green px-3 py-1 text-xs font-bold text-white uppercase">
                    Rekening Resmi
                  </span>
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900">Bank Syariah Indonesia (BSI)</h3>
                <div className="mt-3 rounded-2xl bg-white p-4 border border-brand-green/20">
                  <p className="text-xs text-slate-500">Nomor Rekening Donasi:</p>
                  <p className="mt-1 font-mono text-2xl font-black text-brand-green tracking-wider">
                    7383733288
                  </p>
                  <p className="mt-2 text-xs font-semibold text-slate-700">
                    a.n. Yayasan Rumah Manusia Damai
                  </p>
                </div>
              </div>
              <div className="mt-4 text-xs text-slate-500">
                Menerima dana sosial, zakat, infak, sedekah, dan wakaf (ZISWAF).
              </div>
            </div>

            {/* Card Layanan Telepon */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs flex flex-col justify-between">
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-mint text-2xl">
                  📞
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900">Layanan Informasi & Konfirmasi</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Hubungi kami untuk konfirmasi donasi, kemitraan, atau informasi program:
                </p>
                <div className="mt-4 space-y-2">
                  <a
                    href="https://wa.me/62811897319"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 hover:border-brand-green hover:bg-brand-mint transition"
                  >
                    <span>0811 897 319</span>
                    <span className="text-xs font-bold text-brand-green">WhatsApp →</span>
                  </a>
                  <a
                    href="https://wa.me/628111512174"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 hover:border-brand-green hover:bg-brand-mint transition"
                  >
                    <span>0811 1512 174</span>
                    <span className="text-xs font-bold text-brand-green">WhatsApp →</span>
                  </a>
                  <a
                    href="https://wa.me/6281389832223"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 hover:border-brand-green hover:bg-brand-mint transition"
                  >
                    <span>0813 8983 2223</span>
                    <span className="text-xs font-bold text-brand-green">WhatsApp →</span>
                  </a>
                </div>
              </div>
              <div className="mt-4 text-xs text-slate-400">
                Layanan aktif setiap hari kerja (08.00 - 17.00 WIB).
              </div>
            </div>
          </div>

          {/* Google Maps Lokasi Kantor Cabang */}
          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green/10 px-3 py-1 text-xs font-bold text-brand-green uppercase tracking-wide">
                  <span>📍</span> Lokasi Kantor Cabang
                </span>
                <h3 className="mt-2 text-xl font-bold text-slate-900">
                  Yayasan Rumah Manusia Damai (RMD)
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Jln. Madrasah 2 No. 28 B, RT 06 RW 10, Duren Sawit, Jakarta Timur 13440.
                </p>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Jln.+Madrasah+2+No.+28+B+RT+06+RW+10+Duren+Sawit+Jakarta+Timur+13440"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex shrink-0 items-center gap-2 text-xs font-bold shadow-sm"
              >
                <span>Buka Rute di Google Maps</span>
                <span>↗</span>
              </a>
            </div>

            {/* Embed Map Interaktif */}
            <div className="mt-6 h-[400px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner">
              <iframe
                title="Peta Lokasi Yayasan Rumah Manusia Damai"
                src="https://maps.google.com/maps?q=Jln.+Madrasah+2+No.+28+B+RT+06+RW+10+Duren+Sawit+Jakarta+Timur+13440&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Transparansi Banner */}
      <section id="transparansi" className="bg-brand-mint py-16 border-t border-slate-200">
        <div className="container-page flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Amanah Perlu Dibuktikan dengan Keterbukaan</h2>
            <p className="mt-2 text-slate-600 max-w-xl">
              Laporan penyaluran dana dan rekapitulasi bantuan dipublikasikan secara akuntabel demi menjaga kepercayaan para donatur dan masyarakat.
            </p>
          </div>
          <Link href="/transparansi" className="btn-primary shrink-0">
            Pusat Transparansi
          </Link>
        </div>
      </section>
    </main>
  );
}
