import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Rumah Manusia Damai — Bersama Menebar Kebaikan",
  description: "Lembaga Sosial dan Kemanusiaan Yayasan Rumah Manusia Damai (RMD). Menebar Kebaikan, Membangun Kemanusiaan, Mewujudkan Kedamaian."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
