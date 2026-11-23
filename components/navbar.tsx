import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function Navbar() {
  const session = await auth();
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-green">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-green text-white">R</span>
          <span>Rumah Manusia Damai</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/#program">Program</Link>
          <Link href="/#tentang">Tentang Kami</Link>
          <Link href="/#transparansi">Transparansi</Link>
        </nav>
        <div className="flex items-center gap-3 text-sm">
          {session?.user ? (
            <>
              <Link href="/dashboard" className="btn-secondary">Dashboard</Link>
              <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
                <button className="text-slate-600 hover:text-red-600">Keluar</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="font-semibold text-brand-green">Masuk</Link>
              <Link href="/register" className="btn-primary">Daftar</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
