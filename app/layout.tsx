import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Rumah Manusia Damai — Bersama Menebar Kebaikan",
  description: "Platform donasi dan transparansi program Yayasan Rumah Manusia Damai."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body><Navbar />{children}<footer className="mt-20 border-t bg-white py-8"><div className="container-page flex flex-col justify-between gap-3 text-sm text-slate-500 md:flex-row"><span>© {new Date().getFullYear()} Yayasan Rumah Manusia Damai</span><span>Syiar kebaikan, amanah, dan transparansi.</span></div></footer></body></html>;
}
