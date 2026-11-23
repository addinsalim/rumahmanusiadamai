# Project Baseline — Rumah Manusia Damai

## Keputusan bisnis
1. Donasi umum mengikuti kebijakan penggunaan dana masing-masing campaign.
2. Setiap campaign wajib memiliki kebijakan penggunaan dana yang aktif sebelum dipublikasikan.
3. Donasi menyimpan referensi versi kebijakan yang berlaku saat transaksi dibuat.
4. Donatur anonim secara default dan boleh memilih nama tampilan.
5. Donasi wajib login; guest checkout tidak tersedia.
6. Persetujuan penyaluran: Admin Keuangan ATAU Super Admin; satu persetujuan sah cukup.
7. Pemohon tidak boleh menyetujui pengajuan sendiri.
8. Transparansi tersedia per campaign dan per periode bulanan/tahunan.
9. Donasi, payment attempt, webhook, refund, allocation, dan disbursement adalah catatan terpisah.
10. Data keuangan tidak dihapus permanen; koreksi harus dapat diaudit.

## Arsitektur
- Next.js App Router + TypeScript + Tailwind.
- Next.js Route Handlers.
- Prisma ORM.
- MySQL/MariaDB.
- Auth.js Credentials + Google.
- Midtrans Snap, sandbox lebih dahulu.

## Prinsip keuangan
- Pemasukan publik berasal dari donasi berstatus PAID yang telah diverifikasi.
- Gross donations bukan saldo kas.
- Perhitungan dana tersedia mempertimbangkan settlement, fee, refund, pembatasan dana, dan penyaluran.
- Satu allocation memiliki satu keputusan final.
- Persetujuan bukan bukti bahwa dana sudah ditransfer.
