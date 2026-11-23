export interface ProgramDocumentation {
  id: string;
  title: string;
  date: string;
  location: string;
  summary: string;
  metric: string;
  tag: string;
}

export interface ProgramDetail {
  slug: string;
  no: string;
  name: string;
  icon: string;
  tagline: string;
  summary: string;
  background: string;
  targetBeneficiaries: string[];
  activities: {
    code: string;
    title: string;
    desc: string;
  }[];
  documentations: ProgramDocumentation[];
}

export const PROGRAM_DETAILS: Record<string, ProgramDetail> = {
  "wakaf-al-quran": {
    slug: "wakaf-al-quran",
    no: "1",
    name: "Wakaf Al-Qur'an",
    icon: "📖",
    tagline: "Menyalakan Cahaya Al-Qur'an Hingga Pelosok Negeri",
    summary:
      "Gerakan kebaikan untuk meningkatkan kecintaan dan pemahaman terhadap Al-Qur'an melalui penyediaan, distribusi, dan wakaf mushaf Al-Qur'an bagi masyarakat yang membutuhkan.",
    background:
      "Masih banyak masjid, musholla, pesantren pelosok, majelis taklim, serta santri prasejahtera yang kekurangan mushaf Al-Qur'an layak baca. Melalui pilar ini, Yayasan Rumah Manusia Damai menjembatani para pewakaf dengan para penerima manfaat demi lahirnya generasi qur'ani yang melek literasi Al-Qur'an dan mengamalkan nilai-nilainya dalam kehidupan berbangsa.",
    targetBeneficiaries: [
      "Masjid, Musholla, dan Majelis Taklim pelosok",
      "Pondok Pesantren dan Rumah Tahfidz",
      "Santri, Anak Yatim, dan Keluarga Prasejahtera",
      "Komunitas mualaf di daerah terpencil dan perbatasan"
    ],
    activities: [
      {
        code: "A",
        title: "Wakaf Al-Qur'an untuk Masjid, Musholla, Pesantren dan Sekolah",
        desc: "Penyaluran mushaf Al-Qur'an standar Kementerian Agama ke tempat ibadah dan sarana pendidikan yang memerlukan mushaf baru dan layak."
      },
      {
        code: "B",
        title: "Distribusi Al-Qur'an ke Daerah Terpencil",
        desc: "Ekspedisi pengiriman mushaf ke pelosok desa, daerah kepulauan, dan kawasan rawan keterbatasan akses mushaf di berbagai penjuru Nusantara."
      },
      {
        code: "C",
        title: "Program Al-Qur'an untuk Anak Yatim dan Keluarga Prasejahtera",
        desc: "Pemberian paket mushaf pribadi, buku bimbingan iqra', dan perlengkapan mengaji bagi anak yatim dan keluarga kurang mampu."
      },
      {
        code: "D",
        title: "Pembinaan dan Kegiatan Belajar Membaca Al-Qur'an",
        desc: "Pemberdayaan guru ngaji, pembinaan tahsin, dan kelas bimbingan baca Al-Qur'an gratis secara berkala bagi masyarakat sekitar."
      },
      {
        code: "E",
        title: "Digitalisasi Gerakan Wakaf Al-Qur'an",
        desc: "Pengembangan sistem transparansi penerimaan dan penyaluran wakaf mushaf secara digital, agar pewakaf dapat memantau titik lokasi penyaluran mushaf."
      }
    ],
    documentations: [
      {
        id: "doc-wq-1",
        title: "Ekspedisi Penyaluran Mushaf Pelosok Jawa Barat & Banten",
        date: "Oktober 2026",
        location: "Lebak & Pandeglang, Banten",
        summary: "Penyaluran 1.500 mushaf Al-Qur'an baru dan buku Iqro untuk 24 musholla dan pondok pesantren salafiyah.",
        metric: "1.500 Mushaf Tersalurkan",
        tag: "Distribusi Pelosok"
      },
      {
        id: "doc-wq-2",
        title: "Paket Mushaf Santri Yatim & Rumah Tahfidz Duren Sawit",
        date: "November 2026",
        location: "Jakarta Timur",
        summary: "Pembagian mushaf hafalan berstandar tajwid warna kepada santri tahfidz yatim dan dhuafa.",
        metric: "250 Santri Penerima",
        tag: "Tahfidz Mandiri"
      },
      {
        id: "doc-wq-3",
        title: "Pelatihan Tahsin & Pembinaan Guru Ngaji Kampung",
        date: "September 2026",
        location: "Kabupaten Bogor",
        summary: "Program pembinaan intensif metode tartil dan penyerahan sarana belajar Al-Qur'an bagi 35 guru ngaji tradisional.",
        metric: "35 Guru Ngaji Dibina",
        tag: "Edukasi & Pembinaan"
      }
    ]
  },

  pendidikan: {
    slug: "pendidikan",
    no: "2",
    name: "Pendidikan",
    icon: "🎓",
    tagline: "Membuka Gerbang Masa Depan Generasi Bangsa",
    summary:
      "Membangun generasi yang cerdas, berkarakter, berakhlak mulia, dan memiliki kesempatan yang sama untuk memperoleh pendidikan.",
    background:
      "Pendidikan adalah modal utama pemutus mata rantai kemiskinan dan pendorong kemajuan peradaban. Yayasan Rumah Manusia Damai percaya bahwa tidak boleh ada anak yang putus sekolah hanya karena keterbatasan ekonomi. Program ini berfokus pada pendampingan beasiswa berkelanjutan, pemenuhan sarana belajar, serta pembentukan karakter akhlakul karimah.",
    targetBeneficiaries: [
      "Anak yatim, piatu, dan anak dari keluarga berpenghasilan rendah (dhuafa)",
      "Sekolah, madrasah, dan rumah belajar di kantong-kantong pemukiman padat",
      "Generasi muda putus sekolah yang membutuhkan pelatihan kecakapan hidup",
      "Pendidik dan guru honorer prasejahtera"
    ],
    activities: [
      {
        code: "A",
        title: "Beasiswa Pendidikan bagi Anak Yatim dan Kurang Mampu",
        desc: "Dukungan biaya SPP, seragam, sepatu, tas, dan kebutuhan penunjang belajar sekolah dasar hingga menengah atas."
      },
      {
        code: "B",
        title: "Bantuan Sarana dan Prasarana Pendidikan",
        desc: "Renovasi ruang kelas sederhana, perbaikan toilet sekolah, serta pengadaan meja, kursi, dan papan tulis."
      },
      {
        code: "C",
        title: "Pendirian dan Pengembangan Rumah Belajar",
        desc: "Pusat belajar masyarakat gratis yang menyediakan bimbingan belajar mata pelajaran, komputer dasar, dan pojok baca."
      },
      {
        code: "D",
        title: "Pelatihan Keterampilan dan Pendidikan Vokasi",
        desc: "Program vokasional seperti desain grafis, perbengkelan, tata boga, dan kewirausahaan bagi remaja mandiri."
      },
      {
        code: "E",
        title: "Pendidikan Karakter dan Literasi",
        desc: "Penguatan budi pekerti, kepemimpinan pemuda, gemar membaca, serta pembinaan akhlak mulia sejak dini."
      },
      {
        code: "F",
        title: "Program Dana Abadi Pendidikan untuk Keberlanjutan Beasiswa",
        desc: "Pengelolaan dana wakaf dan infak produktif untuk menjamin keberlanjutan beasiswa anak binaan hingga tuntas pendidikannya."
      }
    ],
    documentations: [
      {
        id: "doc-edu-1",
        title: "Penyaluran Beasiswa Asa Cemerlang Semester Gasal",
        date: "November 2026",
        location: "DKI Jakarta & Bekasi",
        summary: "Bantuan pendidikan langsung bagi 120 siswa yatim dan dhuafa jenjang SD hingga SMA/SMK sederajat.",
        metric: "120 Anak Penerima Beasiswa",
        tag: "Beasiswa Anak Asuh"
      },
      {
        id: "doc-edu-2",
        title: "Peresmian Pojok Literasi & Rumah Belajar Damai",
        date: "Oktober 2026",
        location: "Duren Sawit, Jakarta Timur",
        summary: "Penyediaan 800 judul buku bacaan edukatif, perlengkapan belajar, dan bimbingan belajar gratis 3 kali sepekan.",
        metric: "65 Anak Aktif Belajar",
        tag: "Rumah Belajar"
      },
      {
        id: "doc-edu-3",
        title: "Bantuan Perlengkapan Sekolah Siswa Korban Banjir",
        date: "Agustus 2026",
        location: "Karawang, Jawa Barat",
        summary: "Distribusi seragam, buku tulis, dan tas sekolah bagi anak-anak yang sarana belajarnya terdampak musibah.",
        metric: "200 Paket Belajar Lengkap",
        tag: "Sarana Sekolah"
      }
    ]
  },

  kesehatan: {
    slug: "kesehatan",
    no: "3",
    name: "Kesehatan",
    icon: "🩺",
    tagline: "Kesehatan Terjangkau, Masyarakat Kuat dan Sejahtera",
    summary:
      "Meningkatkan kualitas hidup masyarakat melalui akses pelayanan kesehatan yang terjangkau, merata, dan berorientasi pada pencegahan.",
    background:
      "Kesehatan adalah nikmat mendasar yang menentukan produktivitas setiap insan. Banyak keluarga rentan yang ragu berobat atau mengabaikan pencegahan penyakit karena kendala biaya maupun jarak fasilitas medis. Pilar Kesehatan hadir melalui aksi preventif, bantuan darurat pengobatan, pemeriksaan berkala, serta perbaikan fasilitas air bersih dan sanitasi higienis.",
    targetBeneficiaries: [
      "Masyarakat lansia dan pasien kronis prasejahtera",
      "Ibu hamil, ibu menyusui, dan balita berisiko stunting",
      "Warga lingkungan padat kumuh dan daerah krisis air bersih",
      "Masyarakat umum yang membutuhkan edukasi pola hidup bersih dan sehat (PHBS)"
    ],
    activities: [
      {
        code: "A",
        title: "Bantuan Biaya Pengobatan Masyarakat Prasejahtera",
        desc: "Bantuan pembiayaan obat, akomodasi rujukan rumah sakit, dan kebutuhan medis darurat yang tidak tercover jaminan kesehatan."
      },
      {
        code: "B",
        title: "Pemeriksaan Kesehatan Gratis",
        desc: "Layanan cek tensi darah, gula darah, asam urat, kolesterol, serta konsultasi dokter umum secara cuma-cuma ke perkampungan."
      },
      {
        code: "C",
        title: "Program Kesehatan Ibu dan Anak",
        desc: "Pendampingan gizi seimbang, pemberian makanan tambahan (PMT) balita, dan pencegahan stunting pada keluarga rentan."
      },
      {
        code: "D",
        title: "Penyediaan Obat dan Alat Kesehatan",
        desc: "Penyediaan suplai obat-obatan umum, kursi roda, tongkat ketiak, dan alat bantu medis bagi pasien difabel atau lansia."
      },
      {
        code: "E",
        title: "Penyediaan Air Bersih dan Sanitasi",
        desc: "Pembuatan sumur bor, instalasi filtrasi air bersih, serta pembangunan MCK layak di wilayah kekeringan dan minim sanitasi."
      },
      {
        code: "F",
        title: "Edukasi Pola Hidup Sehat dan Pencegahan Penyakit",
        desc: "Sosialisasi pola hidup bersih sehat (PHBS), pencegahan penyakit menular, dan sanitasi lingkungan pemukiman."
      }
    ],
    documentations: [
      {
        id: "doc-kes-1",
        title: "Aksi Layanan Medis & Cek Kesehatan Gratis Lansia",
        date: "November 2026",
        location: "Duren Sawit, Jakarta Timur",
        summary: "Pemeriksaan gula darah, asam urat, kolesterol, dan pembagian paket vitamin serta suplemen bagi 180 warga lansia.",
        metric: "180 Lansia Terlayani",
        tag: "Layanan Medis Keliling"
      },
      {
        id: "doc-kes-2",
        title: "Pembangunan Sumur Bor Air Bersih Sumber Kehidupan",
        date: "September 2026",
        location: "Gunungkidul, D.I. Yogyakarta",
        summary: "Pengeboran sumur sedalam 60 meter beserta tandon air 5.000 liter untuk memenuhi kebutuhan 85 kepala keluarga saat kemarau.",
        metric: "85 KK Terbebas Krisis Air",
        tag: "Air Bersih & Sanitasi"
      },
      {
        id: "doc-kes-3",
        title: "Program Nutrisi Cegah Stunting Ibu & Balita",
        date: "Juli 2026",
        location: "Cilincing, Jakarta Utara",
        summary: "Pendistribusian paket susu ibu hamil, biskuit gizi, dan telur bagi 90 balita dari keluarga prasejahtera.",
        metric: "90 Balita Diberikan PMT",
        tag: "Ibu & Anak"
      }
    ]
  },

  "sosial-kemanusiaan": {
    slug: "sosial-kemanusiaan",
    no: "4",
    name: "Sosial Kemanusiaan",
    icon: "🤝",
    tagline: "Solidaritas Tanpa Batas, Menghadirkan Senyum dan Perdamaian",
    summary:
      "Membangun solidaritas dan kepedulian sosial untuk membantu sesama manusia tanpa membedakan latar belakang, suku, maupun golongan.",
    background:
      "Kemanusiaan melampaui sekat-sekat perbedaan. Ketika bencana melanda, krisis pangan terjadi, atau masyarakat lanjut usia hidup sebatang kara, kepedulian bersama adalah jawaban terbaik. Yayasan Rumah Manusia Damai bergerak sigap menyalurkan santunan, bantuan pangan pokok, pemugaran rumah tinggal yang aman, serta pemberdayaan ekonomi agar keluarga tangguh dan mandiri.",
    targetBeneficiaries: [
      "Anak-anak yatim, piatu, dan dhuafa",
      "Lansia sebatang kara dan penyandang disabilitas",
      "Korban bencana alam (banjir, gempa, kebakaran, tanah longsor)",
      "Keluarga prasejahtera yang membutuhkan modal usaha mandiri"
    ],
    activities: [
      {
        code: "A",
        title: "Santunan Anak Yatim dan Dhuafa",
        desc: "Pemberian santunan tunai, bingkisan perlengkapan harian, dan kegembiraan bagi anak-anak yatim binaan secara rutin."
      },
      {
        code: "B",
        title: "Bantuan Pangan dan Kebutuhan Pokok",
        desc: "Pembagian beras, minyak, telur, dan sembako berkualitas untuk keluarga prasejahtera yang berjuang mencukupi makan sehari-hari."
      },
      {
        code: "C",
        title: "Bantuan Tanggap Darurat Bencana",
        desc: "Aksi tanggap cepat dapur umum, evakuasi, penyaluran pakaian bersih, hygiene kit, dan terpal darurat bagi korban bencana."
      },
      {
        code: "D",
        title: "Program Peduli Lansia dan Penyandang Disabilitas",
        desc: "Kunjungan kasih (*home care*), santunan biaya hidup berkala, dan penyediaan alat penunjang mobilitas fisik."
      },
      {
        code: "E",
        title: "Bantuan Rumah Layak Huni",
        desc: "Bedah rumah dan perbaikan atap bocor, dinding rapuh, serta lantai tanah menjadi hunian yang aman, sehat, dan bermartabat."
      },
      {
        code: "F",
        title: "Program Pemberdayaan Ekonomi Keluarga",
        desc: "Pendampingan usaha mikro, bantuan gerobak dagang, modal bibit pertanian/peternakan, dan pelatihan pembukuan sederhana."
      },
      {
        code: "G",
        title: "Gerakan Perdamaian dan Solidaritas Kemanusiaan",
        desc: "Menggalang kebersamaan antar-elemen bangsa melalui dialog kemanusiaan, gotong royong, dan syiar kedamaian sosial."
      }
    ],
    documentations: [
      {
        id: "doc-sos-1",
        title: "Penyaluran Paket Sembako Berkah Dhuafa & Lansia",
        date: "November 2026",
        location: "Jakarta Timur & Bekasi",
        summary: "Pembagian 350 paket beras premium, minyak goreng, dan sarden bagi lansia dan janda prasejahtera.",
        metric: "350 Paket Sembako Disalurkan",
        tag: "Ketahanan Pangan"
      },
      {
        id: "doc-sos-2",
        title: "Aksi Tanggap Darurat Bantuan Korban Banjir Bandang",
        date: "September 2026",
        location: "Sukabumi, Jawa Barat",
        summary: "Pendirian dapur umum darurat, pembagian 1.200 porsi makanan siap saji, dan penyaluran selimut serta obat luka.",
        metric: "1.200 Porsi Makanan Siap Saji",
        tag: "Tanggap Bencana"
      },
      {
        id: "doc-sos-3",
        title: "Bedah Rumah Layak Huni Nenek Rohayah",
        date: "Agustus 2026",
        location: "Kabupaten Cianjur",
        summary: "Renovasi total rumah panggung yang nyaris roboh menjadi rumah bata permanen yang kokoh, beratap genteng, dan berlantai semen bersih.",
        metric: "1 Rumah Rampung Dibedah",
        tag: "Rumah Layak Huni"
      }
    ]
  }
};
