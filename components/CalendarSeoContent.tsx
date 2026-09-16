"use client";

import { useState } from "react";
import { HOLIDAYS_2027 } from "@/data/holidays/holidays2027";

export default function CalendarSeoContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const allHolidays2027 = [
    ...HOLIDAYS_2027.holidays.map((h) => ({ ...h, category: "Libur Nasional" })),
    ...HOLIDAYS_2027.jointLeave.map((j) => ({ ...j, category: "Cuti Bersama" })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const leaveHacks = [
    {
      title: "Libur Awal Tahun Baru 2027",
      dates: "1 - 5 Januari 2027",
      takeLeave: "Senin, 4 Januari 2027 (1 hari)",
      totalDaysOff: "5 Hari Libur Beruntun",
      notes: "Menghubungkan Tahun Baru (Jumat) dan Isra Mikraj (Selasa).",
    },
    {
      title: "Long Weekend Imlek 2578",
      dates: "5 - 7 Februari 2027",
      takeLeave: "Tanpa Cuti Tambahan (0 hari)",
      totalDaysOff: "3 Hari Libur",
      notes: "Didukung Cuti Bersama Imlek pada Jumat, 5 Februari 2027.",
    },
    {
      title: "Mega Long Weekend Nyepi & Idulfitri 1448 H",
      dates: "6 - 15 Maret 2027",
      takeLeave: "Tanpa Cuti Pribadi (0 hari)",
      totalDaysOff: "10 Hari Libur Beruntun",
      notes: "Kombinasi Nyepi (8 Mar), Cuti Bersama (9, 12, 15 Mar), dan Idulfitri (10-11 Mar).",
    },
    {
      title: "Libur Paskah & Wafat Yesus Kristus",
      dates: "25 - 28 Maret 2027",
      takeLeave: "Tanpa Cuti Tambahan (0 hari)",
      totalDaysOff: "4 Hari Libur",
      notes: "Cuti bersama Kamis 25 Maret menyambung libur Jumat 26 Maret & akhir pekan.",
    },
    {
      title: "Long Weekend Kenaikan Yesus Kristus",
      dates: "6 - 9 Mei 2027",
      takeLeave: "Jumat, 7 Mei 2027 (1 hari)",
      totalDaysOff: "4 Hari Libur",
      notes: "Memanfaatkan hari kejepit nasional setelah libur Kamis 6 Mei.",
    },
    {
      title: "Super Vacation Iduladha & Hari Raya Waisak",
      dates: "15 - 23 Mei 2027",
      takeLeave: "Jumat, 21 Mei 2027 (1 hari)",
      totalDaysOff: "9 Hari Libur Maraton",
      notes: "Iduladha (17 Mei), Cuti Bersama (18-19 Mei), dan Waisak (20 Mei).",
    },
    {
      title: "Long Weekend Hari Lahir Pancasila",
      dates: "29 Mei - 1 Juni 2027",
      takeLeave: "Senin, 31 Mei 2027 (1 hari)",
      totalDaysOff: "4 Hari Libur",
      notes: "Menyambung akhir pekan Sabtu-Minggu dengan Hari Lahir Pancasila (Selasa).",
    },
    {
      title: "Long Weekend HUT Kemerdekaan RI Ke-82",
      dates: "14 - 17 Agustus 2027",
      takeLeave: "Senin, 16 Agustus 2027 (1 hari)",
      totalDaysOff: "4 Hari Libur",
      notes: "Cuti hemat sehari sebelum Hari Kemerdekaan pada Selasa, 17 Agustus.",
    },
    {
      title: "Libur Natal & Tahun Baru 2028",
      dates: "24 - 26 Desember 2027",
      takeLeave: "Tanpa Cuti Tambahan (0 hari)",
      totalDaysOff: "3 Hari Libur",
      notes: "Didukung Cuti Bersama Natal Jumat 24 Desember & Natal Sabtu 25 Desember.",
    },
  ];

  const pasaranInfo = [
    { name: "Legi", neptu: 5, arah: "Timur", elemen: "Kayu", filosofi: "Manis, mengayomi, dan ramah" },
    { name: "Pahing", neptu: 9, arah: "Selatan", elemen: "Api", filosofi: "Pemberani, berwibawa, dan energik" },
    { name: "Pon", neptu: 7, arah: "Barat", elemen: "Logam", filosofi: "Teguh, analitis, dan berpendirian kuat" },
    { name: "Wage", neptu: 4, arah: "Utara", elemen: "Air", filosofi: "Tekun, cermat, dan berwawasan luas" },
    { name: "Kliwon", neptu: 8, arah: "Pusat / Tengah", elemen: "Tanah", filosofi: "Bijaksana, spiritual, dan dinamis" },
  ];

  const faqs = [
    {
      q: "Kapan jadwal Hari Raya Idulfitri 2027 dan berapa hari liburnya?",
      a: "Berdasarkan rilis resmi SKB 3 Menteri, Hari Raya Idulfitri 1448 H diperkirakan jatuh pada Rabu dan Kamis, 10–11 Maret 2027. Pemerintah menetapkan Cuti Bersama Idulfitri pada tanggal 9, 12, dan 15 Maret 2027. Karena berdekatan dengan Hari Suci Nyepi (Senin, 8 Maret 2027), masyarakat mendapatkan kesempatan libur panjang beruntun selama 10 hari (6–15 Maret 2027) tanpa perlu memotong jatah cuti tahunan pribadi.",
    },
    {
      q: "Bagaimana rekomendasi cuti 2027 terbaik untuk mendapatkan libur panjang hemat?",
      a: "Rekomendasi cuti 2027 terbaik adalah memanfaatkan momentum 'hari kejepit nasional' (Harpitnas). Contoh paling strategis ada di bulan Mei 2027: cukup mengajukan 1 hari cuti pada Jumat, 21 Mei 2027, Anda akan memperoleh 9 hari libur beruntun berkat kombinasi Iduladha (17 Mei), Cuti Bersama (18-19 Mei), dan Hari Raya Waisak (20 Mei). Trik serupa berlaku pada libur Kenaikan Yesus Kristus (cuti 7 Mei untuk 4 hari libur) dan HUT RI (cuti 16 Agustus untuk 4 hari libur).",
    },
    {
      q: "Bagaimana cara membaca Kalender Jawa (Weton dan Pasaran) di situs ini?",
      a: "Kalender Gandiva Labs menghitung siklus Panca Wara (Legi, Pahing, Pon, Wage, Kliwon) secara presisi dan deterministik. Anda cukup mengaktifkan tombol 'Hijriah & Pasaran' di atas kalender. Pada setiap sel tanggal, akan muncul nama pasaran Jawa beserta tanggal Hijriah (Umm al-Qura). Jika Anda mengklik tanggal tertentu, panel inspektor detail akan menjabarkan kombinasi hari masehi dan pasaran (misalnya: Jumat Pahing) yang menjadi dasar perhitungan weton dan neptu.",
    },
    {
      q: "Berapa total hari libur nasional dan cuti bersama tahun 2027 menurut SKB 3 Menteri?",
      a: "Total terdapat 26 hari libur resmi pada tahun 2027, terdiri dari 18 Hari Libur Nasional dan 8 Hari Cuti Bersama. Ketetapan ini mengacu pada Surat Keputusan Bersama (SKB) Menteri Agama, Menteri Ketenagakerjaan, dan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi (PANRB) No. 1205/2026, No. 3/2026, No. 2/2026.",
    },
    {
      q: "Apakah jadwal Kalender 2027 ini bisa disinkronkan ke Google Calendar dan Apple Calendar?",
      a: "Bisa. Anda cukup mengklik tombol 'Sinkronkan' di navigasi atas untuk mengunduh berkas kalender universal (.ics) atau membuka tautan langganan langsung ke Google Calendar, Apple iCal, dan Microsoft Outlook. Semua tanggal merah dan cuti bersama otomatis tercatat di perangkat Anda.",
    },
  ];

  const formatTanggalIndo = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatHariIndo = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { weekday: "long" });
  };

  return (
    <div className="space-y-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
      {/* 1. Extractable Hero Section: Kalender 2027 Indonesia */}
      <section id="kalender-2027" className="scroll-mt-24 space-y-6">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
            <span>Resmi SKB 3 Menteri No. 1205/2026</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Panduan Lengkap Kalender 2027 Indonesia & Jadwal Libur Resmi
          </h2>

          {/* 40-60 Word Direct Answer Block for AI Overviews & Search Snippets */}
          <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/60 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            <strong>Kalender 2027 Indonesia resmi</strong> memuat total <strong>26 hari libur</strong>, yang terdiri dari <strong>18 hari libur nasional</strong> dan <strong>8 hari cuti bersama</strong> berdasarkan Surat Keputusan Bersama (SKB) 3 Menteri. Tahun 2027 menawarkan berbagai peluang <em>long weekend</em> strategis, termasuk libur maraton Idulfitri 1448 H selama 10 hari pada bulan Maret 2027 serta rangkaian libur Iduladha dan Waisak di bulan Mei 2027.
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Situs ini dipersembahkan oleh <strong>Gandiva Labs</strong> untuk membantu para profesional, HR, pelaku usaha, serta keluarga di Indonesia merencanakan agenda tahunan, efisiensi jatah cuti kerja, dan agenda kultural secara cerdas dengan dukungan penanggalan Jawa (weton & pasaran) serta kalender Hijriah.
          </p>
        </div>

        {/* Tabel Semantik Hari Libur Nasional & Cuti Bersama 2027 */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
          <div className="p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Daftar Tanggal Merah & Cuti Bersama 2027
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Rangkuman kronologis seluruh hari libur resmi pemerintah sepanjang tahun 2027.
              </p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 self-start sm:self-auto">
              26 Hari Resmi
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-950/70 text-zinc-600 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 font-medium">
                <tr>
                  <th scope="col" className="py-3 px-4 sm:px-6">Tanggal</th>
                  <th scope="col" className="py-3 px-3 sm:px-4">Hari</th>
                  <th scope="col" className="py-3 px-4 sm:px-6">Nama Hari Libur / Peringatan</th>
                  <th scope="col" className="py-3 px-3 sm:px-4">Kategori</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/80">
                {allHolidays2027.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 sm:px-6 font-mono text-xs text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                      {formatTanggalIndo(item.date)}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                      {formatHariIndo(item.date)}
                    </td>
                    <td className="py-3 px-4 sm:px-6 font-medium text-zinc-900 dark:text-zinc-100">
                      {item.name}
                    </td>
                    <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                          item.category === "Libur Nasional"
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50"
                            : "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50"
                        }`}
                      >
                        {item.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 2. KPI Section: Rekomendasi Cuti 2027 (Long Weekend Hacks) */}
      <section id="rekomendasi-cuti" className="scroll-mt-24 space-y-6">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
            <span>Strategi Smart Leave Planner 2027</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Rekomendasi Cuti 2027: Trik Libur Panjang Tanpa Boros Jatah Cuti
          </h2>

          {/* 40-60 Word Direct Answer Block for AI Search & Featured Snippet */}
          <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/60 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            <strong>Rekomendasi cuti 2027 terbaik</strong> menitikberatkan pada pemanfaatan tanggal kejepit (harpitnas) di sekitar libur nasional resmi. Hanya dengan menggunakan <strong>1 hingga 2 hari jatah cuti tahunan</strong>, Anda dapat menikmati <strong>4 hingga 10 hari libur berturut-turut</strong> pada momen Imlek, Idulfitri 1448 H (Maret), Kenaikan Yesus & Waisak (Mei), serta Hari Kemerdekaan RI (Agustus).
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Trik #1</span>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-1">Cuti Hari Kejepit (Harpitnas)</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Jika hari libur jatuh di hari Selasa atau Kamis, ajukan cuti pada hari Senin atau Jumat untuk menyambung akhir pekan menjadi 4 hari libur.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Trik #2</span>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-1">Manfaatkan Cuti Bersama</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Cuti bersama pemerintah tidak memotong jatah cuti wajib untuk instansi tertentu atau dapat dimaksimalkan untuk mudik dan liburan luar kota.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
              <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Trik #3</span>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-1">Simulasikan dengan Aplikasi</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Gunakan tab Simulator Cuti di atas untuk menentukan batas kuota cuti tahunan (misal 5 atau 12 hari) dan pilih prioritas libur terpanjang.
              </p>
            </div>
          </div>
        </div>

        {/* Tabel Rekomendasi Cuti 2027 */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
          <div className="p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Tabel Rekomendasi Libur Panjang (Long Weekend Hacks 2027)
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Daftar peluang libur optimal berdasarkan analisis kalender resmi Gandiva Labs.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-950/70 text-zinc-600 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 font-medium">
                <tr>
                  <th scope="col" className="py-3 px-4 sm:px-6">Momentum Libur</th>
                  <th scope="col" className="py-3 px-3 sm:px-4">Periode Tanggal</th>
                  <th scope="col" className="py-3 px-4 sm:px-6">Cuti yang Disarankan</th>
                  <th scope="col" className="py-3 px-3 sm:px-4">Hasil Libur</th>
                  <th scope="col" className="py-3 px-4 sm:px-6 hidden md:table-cell">Keterangan Strategis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/80">
                {leaveHacks.map((hack, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-zinc-900 dark:text-zinc-100">
                      {hack.title}
                    </td>
                    <td className="py-3.5 px-3 sm:px-4 font-mono text-xs text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                      {hack.dates}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-medium text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                      {hack.takeLeave}
                    </td>
                    <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                        {hack.totalDaysOff}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-xs text-zinc-500 dark:text-zinc-400 hidden md:table-cell">
                      {hack.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. KPI Section: Kalender Jawa 2027 & Weton Pasaran */}
      <section id="kalender-jawa" className="scroll-mt-24 space-y-6">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
            <span>Siklus Kultural Panca Wara & Penanggalan Hijriah</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Kalender Jawa 2027: Siklus Pasaran, Weton & Padanan Hijriah
          </h2>

          {/* 40-60 Word Direct Answer Block for AI Overviews */}
          <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/60 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            <strong>Kalender Jawa 2027</strong> menggabungkan penanggalan masehi dengan siklus 5 hari pasaran (<strong>Panca Wara</strong>): <strong>Legi, Pahing, Pon, Wage, dan Kliwon</strong>. Sistem ini dipadukan secara harmonis dengan penanggalan lunar Hijriah (Tahun 1448 H hingga 1449 H), memungkinkan masyarakat mengetahui weton harian, neptu hari, serta hari baik untuk upacara adat dan perhelatan keluarga.
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Pada tahun 2027, tanggal 1 Januari 2027 bertepatan dengan hari <strong>Jumat Pahing</strong>. Algoritma Kalender Gandiva Labs menghitung siklus 5 hari secara deterministik tanpa jeda, memastikan akurasi mutlak untuk setiap tanggal dalam setahun.
          </p>
        </div>

        {/* Tabel Panca Wara & Neptu */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
          <div className="p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Karakter 5 Pasaran Jawa (Panca Wara) & Nilai Neptu
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Nilai neptu pasaran dijumlahkan dengan neptu hari masehi untuk menentukan weton kelahiran dan kecocokan hari.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-950/70 text-zinc-600 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 font-medium">
                <tr>
                  <th scope="col" className="py-3 px-4 sm:px-6">Pasaran</th>
                  <th scope="col" className="py-3 px-3 sm:px-4">Nilai Neptu</th>
                  <th scope="col" className="py-3 px-4 sm:px-6">Arah Mata Angin</th>
                  <th scope="col" className="py-3 px-4 sm:px-6">Elemen Dasar</th>
                  <th scope="col" className="py-3 px-4 sm:px-6">Makna Filosofis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/80">
                {pasaranInfo.map((p, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-zinc-900 dark:text-zinc-100">
                      {p.name}
                    </td>
                    <td className="py-3.5 px-3 sm:px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                      {p.neptu}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-zinc-700 dark:text-zinc-300">
                      {p.arah}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-zinc-700 dark:text-zinc-300">
                      {p.elemen}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-xs text-zinc-500 dark:text-zinc-400">
                      {p.filosofi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Interactive FAQ Section (Schema.org FAQPage Aligned) */}
      <section id="faq" className="scroll-mt-24 space-y-6">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-2 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Pertanyaan yang Sering Diajukan (FAQ) Seputar Kalender 2027
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Jawaban lengkap atas pertanyaan populer seputar hari libur nasional, rekomendasi cuti, dan penanggalan Jawa 2027.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-4 sm:p-5 font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-sm sm:text-base"
                >
                  <span>{faq.q}</span>
                  <svg
                    className={`w-4 h-4 pointer-events-none text-zinc-500 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
