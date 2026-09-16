import type { Metadata } from "next";
import Link from "next/link";
import CalendarSeoContent from "@/components/CalendarSeoContent";

export const metadata: Metadata = {
  title: "Panduan Lengkap Kalender 2027 Indonesia, Jadwal Libur & Rekomendasi Cuti | Gandiva Labs",
  description:
    "Ulasan komprehensif kalender resmi 2027 Indonesia SKB 3 Menteri. Temukan tabel lengkap 26 hari libur nasional dan cuti bersama, 9 strategi libur panjang (long weekend), serta panduan Kalender Jawa (weton & pasaran).",
  keywords: [
    "panduan kalender 2027",
    "jadwal libur 2027",
    "rekomendasi cuti 2027",
    "kalender jawa 2027",
    "hari libur nasional 2027",
    "cuti bersama 2027",
    "skb 3 menteri 2027",
    "long weekend 2027 indonesia",
    "weton pasaran 2027",
  ],
  alternates: {
    canonical: "https://calendar.gandivalabs.my.id/panduan",
  },
  openGraph: {
    title: "Panduan Lengkap Kalender 2027 Indonesia, Jadwal Libur & Rekomendasi Cuti",
    description:
      "Tabel lengkap 18 hari libur nasional, 8 cuti bersama SKB 3 Menteri, 9 formula cuti hemat, dan kalender Jawa weton pasaran.",
    url: "https://calendar.gandivalabs.my.id/panduan",
    siteName: "Kalender Gandiva Labs",
    locale: "id_ID",
    type: "article",
    images: [
      {
        url: "/favicon-512.png",
        width: 512,
        height: 512,
        alt: "Panduan Kalender 2027 Indonesia Gandiva Labs",
      },
    ],
  },
};

export default function PanduanPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors duration-150">
      {/* Header Navigasi Khusus Panduan */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            title="Kembali ke Kalender Utama"
          >
            <div className="flex items-center justify-center h-9 w-9 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1.5 transition-transform group-hover:scale-105">
              <img
                src="/gandiva-mark-dark.webp"
                alt="Gandiva Labs Logo"
                width={28}
                height={28}
                className="w-full h-full object-contain dark:hidden pointer-events-none"
              />
              <img
                src="/gandiva-mark-light.webp"
                alt="Gandiva Labs Logo"
                width={28}
                height={28}
                className="w-full h-full object-contain hidden dark:block pointer-events-none"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                Kalender
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal leading-none">
                powered by Gandiva Labs
              </span>
            </div>
          </Link>

          {/* Navigasi Rute: Kalender vs Panduan */}
          <nav className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-1">
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-md text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Kalender Interaktif
            </Link>
            <span className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700/80 shadow-xs">
              Panduan 2027
            </span>
          </nav>

          {/* Right Action: Tombol Buka Kalender */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <span>Buka Kalender</span>
              <svg className="w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Konten Utama Artikel Panduan */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-zinc-500 dark:text-zinc-400">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                Beranda
              </Link>
            </li>
            <li>/</li>
            <li className="font-semibold text-zinc-800 dark:text-zinc-200">
              Panduan Kalender 2027
            </li>
          </ol>
        </nav>

        {/* Hero Artikel Header */}
        <div className="space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
            <span>Regulasi Resmi SKB 3 Menteri RI</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
            Panduan Lengkap Kalender 2027: Jadwal Libur Resmi, Trik Cuti &amp; Kalender Jawa
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 pt-1">
            <span>Diterbitkan oleh: <strong className="text-zinc-700 dark:text-zinc-300">Gandiva Labs</strong></span>
            <span>•</span>
            <span>Diperbarui: <strong className="text-zinc-700 dark:text-zinc-300">September 2026</strong></span>
            <span>•</span>
            <span>Estimasi baca: <strong className="text-zinc-700 dark:text-zinc-300">4 Menit</strong></span>
          </div>
        </div>

        {/* Banner CTA Kembali ke Kalender Interaktif */}
        <div className="p-4 rounded-xl border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs sm:text-sm text-blue-950 dark:text-blue-200">
            Ingin melihat kalender visual 12 bulan atau mencoba simulator jatah cuti personal?
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold whitespace-nowrap transition-colors"
          >
            <span>Buka Kalender Interaktif</span>
            <svg className="w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Konten Semantik Lengkap (Tabel Libur, Tabel Cuti Hacks, Tabel Jawa Pasaran & FAQ) */}
        <CalendarSeoContent />

        {/* Bottom CTA Box */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 text-center space-y-4 shadow-sm">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Siap Merencanakan Liburan 2027 Anda?
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Manfaatkan fitur <strong>Simulator Jatah Cuti</strong> dan <strong>Sinkronisasi Kalender (.ics)</strong> ke Google Calendar maupun Apple Calendar sekarang juga.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold transition-colors"
            >
              Mulai Eksplorasi Kalender
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Bersih */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-8 px-4 sm:px-6 lg:px-8 mt-16 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/gandiva-mark-dark.webp"
              alt="Gandiva Labs"
              width={20}
              height={20}
              className="dark:hidden pointer-events-none"
            />
            <img
              src="/gandiva-mark-light.webp"
              alt="Gandiva Labs"
              width={20}
              height={20}
              className="hidden dark:block pointer-events-none"
            />
            <span>© {new Date().getFullYear()} Gandiva Labs • Kalender Resmi Indonesia</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/gandivalabs/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-600 transition-colors font-medium"
            >
              Instagram @gandivalabs
            </a>
            <span>•</span>
            <a
              href="https://www.threads.com/@gandivalabs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors font-medium"
            >
              Threads @gandivalabs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
