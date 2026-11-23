import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white pt-16 pb-12">
      <div className="container-page">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 pb-12 border-b border-slate-100">
          {/* Kolom 1: Profil & Tagline */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Yayasan Rumah Manusia Damai"
                width={200}
                height={50}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-sm font-semibold text-brand-green italic">
              &ldquo;Menebar Kebaikan, Membangun Kemanusiaan, Mewujudkan Kedamaian.&rdquo;
            </p>
            <p className="text-xs leading-6 text-slate-500">
              Lembaga Sosial dan Kemanusiaan yang berikhtiar menghimpun, mengelola, dan menyalurkan dana ZISWAF serta kepedulian masyarakat melalui program pemberdayaan berkelanjutan.
            </p>
          </div>

          {/* Kolom 2: Kantor Cabang */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Kantor Cabang (Branch Office)
            </h3>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs text-slate-600 leading-relaxed space-y-2">
              <p className="font-bold text-slate-900">YAYASAN RUMAH MANUSIA DAMAI (RMD)</p>
              <p>Jln. Madrasah 2 No. 28 B RT 06 RW 10, Duren Sawit, Jakarta Timur 13440.</p>
            </div>
          </div>

          {/* Kolom 3: Rekening Resmi */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Rekening Donasi Resmi
            </h3>
            <div className="rounded-2xl border border-brand-green/30 bg-brand-mint/50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-brand-green uppercase tracking-wide">Bank Syariah Indonesia</span>
                <span className="rounded-md bg-brand-green/10 px-2 py-0.5 text-[10px] font-bold text-brand-green">BSI</span>
              </div>
              <div className="font-mono text-lg font-extrabold text-slate-900 tracking-wider">
                7383733288
              </div>
              <p className="text-[11px] text-slate-500">
                a.n. <strong className="text-slate-700">Yayasan Rumah Manusia Damai</strong>
              </p>
            </div>
          </div>

          {/* Kolom 4: Kontak & Telepon */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Layanan Informasi & Konfirmasi
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <a
                  href="https://wa.me/62811897319"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:border-brand-green hover:text-brand-green transition w-full"
                >
                  <span className="text-brand-green font-bold">📞</span>
                  <span>0811 897 319</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/628111512174"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:border-brand-green hover:text-brand-green transition w-full"
                >
                  <span className="text-brand-green font-bold">📞</span>
                  <span>0811 1512 174</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6281389832223"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:border-brand-green hover:text-brand-green transition w-full"
                >
                  <span className="text-brand-green font-bold">📞</span>
                  <span>0813 8983 2223</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bar Bawah Footer */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Yayasan Rumah Manusia Damai (RMD). All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/#tentang" className="hover:text-brand-green">Tentang Kami</Link>
            <Link href="/#program" className="hover:text-brand-green">Program</Link>
            <Link href="/#pengurus" className="hover:text-brand-green">Pengurus</Link>
            <Link href="/transparansi" className="hover:text-brand-green">Transparansi</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
