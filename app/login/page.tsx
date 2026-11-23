import { signIn } from "@/auth";

export default function LoginPage() {
  return <main className="container-page grid min-h-[70vh] place-items-center py-12"><div className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-sm">
    <p className="text-sm font-bold uppercase tracking-widest text-brand-green">Selamat Datang</p><h1 className="mt-2 text-3xl font-extrabold">Masuk akun</h1><p className="mt-2 text-sm text-slate-500">Masuk untuk berdonasi dan memantau riwayat kebaikan Anda.</p>
    <form action={async (formData) => { "use server"; await signIn("credentials", { email: formData.get("email"), password: formData.get("password"), redirectTo: "/dashboard" }); }} className="mt-7 space-y-4">
      <label className="block text-sm font-semibold">Email<input className="input mt-2" name="email" type="email" required /></label>
      <label className="block text-sm font-semibold">Password<input className="input mt-2" name="password" type="password" minLength={8} required /></label>
      <button className="btn-primary w-full">Masuk</button>
    </form>
    <div className="my-5 text-center text-xs text-slate-400">atau</div>
    <form action={async () => { "use server"; await signIn("google", { redirectTo: "/dashboard" }); }}><button className="btn-secondary w-full">Lanjutkan dengan Google</button></form>
    <p className="mt-6 text-center text-xs text-slate-500">Belum memiliki akun? <a href="/register" className="font-bold text-brand-green">Daftar</a></p>
  </div></main>;
}
