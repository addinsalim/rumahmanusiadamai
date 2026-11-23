# Rumah Manusia Damai — Full-stack starter

Starter aplikasi donasi Yayasan Rumah Manusia Damai menggunakan Next.js, TypeScript, Tailwind CSS, Prisma, MySQL/MariaDB XAMPP, Auth.js, dan struktur integrasi Midtrans.

## Status fitur

Sudah disiapkan:
- Landing page dan pilar program.
- Daftar campaign yang dipublikasikan dan halaman detail campaign.
- Registrasi donatur, login email/password, opsi Google OAuth.
- Dashboard donatur dan riwayat donasi.
- Pembuatan record donasi dengan login wajib dan anonimitas default.
- Kebijakan penggunaan dana per campaign (versi kebijakan di database).
- Pengajuan penyaluran dan persetujuan satu reviewer: Admin Keuangan ATAU Super Admin.
- Self-approval ditolak; keputusan dicatat di audit log.
- Ringkasan transparansi dasar.
- Prisma schema MySQL dan seed role/pilar.

Belum aktif / perlu konfigurasi dan implementasi lanjutan:
- Pembuatan Snap Token dan webhook Midtrans (saat ini endpoint donasi membuat record dan memberi status bahwa payment provider belum dikonfigurasi).
- Upload media ke object storage.
- CRUD admin campaign/kebijakan/artikel.
- Laporan keuangan periodik terperinci, rekonsiliasi settlement, biaya gateway dan refund.
- Pengelolaan akun admin produksi, MFA, rate limiting, email verification, monitoring dan backup.

**Jangan gunakan untuk menerima uang sungguhan sebelum integrasi pembayaran, webhook, rekonsiliasi, pengujian keamanan, dan audit operasional selesai.**

## Kebutuhan

- Node.js 20 LTS atau lebih baru.
- XAMPP dengan MySQL/MariaDB aktif.
- npm.

XAMPP dipakai untuk database lokal saja. Aplikasi backend berjalan di Next.js; tidak menggunakan PHP.

## Instalasi lokal

1. Ekstrak arsip.
2. Jalankan XAMPP dan aktifkan MySQL.
3. Buat database `rumah_manusia_damai` di phpMyAdmin dengan charset `utf8mb4`.
4. Salin `.env.example` menjadi `.env`.
5. Isi `AUTH_SECRET` dengan secret acak kuat.
6. Pastikan `DATABASE_URL` sesuai user/password MySQL lokal.
7. Jalankan:

```bash
npm install
npx prisma validate
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

8. Buka `http://localhost:3000`.

## Membuat Super Admin awal

Tambahkan sementara ke `.env` sebelum menjalankan seed:

```env
BOOTSTRAP_ADMIN_EMAIL="admin@domain-yayasan.id"
BOOTSTRAP_ADMIN_PASSWORD="password-kuat-minimal-12-karakter"
```

Jalankan `npm run db:seed`, lalu hapus dua variabel bootstrap dari `.env`. Jangan commit kredensial tersebut. Ganti password setelah login pertama dan gunakan akun admin terpisah untuk operasional.

## Google OAuth

1. Buat OAuth Client ID pada Google Cloud Console.
2. Authorized redirect URI untuk lokal: `http://localhost:3000/api/auth/callback/google`.
3. Isi `AUTH_GOOGLE_ID` dan `AUTH_GOOGLE_SECRET`.
4. Pastikan `AUTH_URL=http://localhost:3000`.

## Midtrans

Saat ini Midtrans belum diaktifkan. Untuk implementasi produksi:
- Buat Snap Token hanya dari server.
- Gunakan Server Key hanya di server.
- Verifikasi `signature_key` notifikasi berdasarkan `order_id`, `status_code`, `gross_amount`, dan Server Key.
- Ambil status transaksi dari API Midtrans bila perlu rekonsiliasi.
- Simpan webhook secara idempotent dan proses perubahan status dalam transaksi database.
- Jangan pernah menetapkan donasi PAID hanya berdasarkan redirect browser.
- Tangani status settlement/capture sesuai aturan metode pembayaran, pending, expire, deny, cancel, refund, dan pembayaran ganda.

## Mekanisme persetujuan dana

- Approver: `FINANCE_ADMIN` ATAU `SUPER_ADMIN`.
- Satu keputusan sah cukup.
- Pemohon tidak dapat menyetujui atau menolak pengajuannya sendiri.
- Satu allocation hanya memiliki satu event keputusan final.
- Realisasi penyaluran dicatat terpisah di `disbursements`.
- Nilai donasi bruto bukan saldo kas tersedia.

## Catatan keamanan sebelum produksi

- Gunakan database MySQL managed/terkelola untuk produksi, bukan XAMPP di komputer pribadi.
- Pakai HTTPS, secret manager, backup harian, dan uji restore.
- Tambahkan rate limit pada login/register/donasi.
- Aktifkan verifikasi email dan kebijakan password yang memadai.
- Tambahkan MFA untuk admin.
- Terapkan pemeriksaan izin server-side pada setiap endpoint.
- Jangan log password, access token, server key, atau data pembayaran sensitif.
- Uji race condition, webhook duplikat, refund, dan pembayaran ganda.
- Pertimbangkan tinjauan keamanan dan akuntansi sebelum menerima donasi riil.

## Struktur direktori

```text
app/
  api/
    auth/[...nextauth]/
    register/
    campaigns/
    donations/
    admin/allocations/
  campaign/[slug]/
  donasi/[campaignId]/
  dashboard/
  admin/allocations/
  login/
  register/
  transparansi/
components/
lib/
prisma/
  schema.prisma
  seed.ts
auth.ts
.env.example
```
