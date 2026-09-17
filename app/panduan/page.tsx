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
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-2">
          {/* Logo & Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 group shrink-0 min-w-0"
            title="Kembali ke Kalender Utama"
          >
            <div className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1 sm:p-1.5 transition-transform group-hover:scale-105 shrink-0">
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
            <div className="flex flex-col min-w-0">
              <span className="text-sm sm:text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight truncate">
                Kalender
              </span>
              <span className="text-[9px] sm:text-[10px] text-zinc-400 dark:text-zinc-500 font-normal leading-none truncate hidden min-[360px]:block">
                Gandiva Labs
              </span>
            </div>
          </Link>

          {/* Navigasi Rute: Kalender vs Panduan di Tablet & Desktop */}
          <nav className="hidden md:flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-1">
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

          {/* Right Action: Tombol Kembali ke Kalender */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <svg className="w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span>Kalender Utama</span>
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
              aria-label="Instagram @gandivalabs"
              className="inline-flex items-center gap-1.5 hover:text-pink-600 transition-colors font-medium text-xs"
            >
              <svg className="w-3.5 h-3.5 pointer-events-none shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/>
              </svg>
              <span>@gandivalabs</span>
            </a>
            <span>•</span>
            <a
              href="https://www.threads.com/@gandivalabs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Threads @gandivalabs"
              className="inline-flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium text-xs"
            >
              <svg className="w-3.5 h-3.5 pointer-events-none shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z"/>
              </svg>
              <span>@gandivalabs</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
