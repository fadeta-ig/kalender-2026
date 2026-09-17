"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SupportedYear } from "@/data/holidays";
import ThemeToggle from "./ThemeToggle";

type NavbarProps = {
  selectedYear: SupportedYear;
  onSelectYear: (year: SupportedYear) => void;
  onExportPDF: () => void;
  onOpenSync: () => void;
  onOpenShare?: () => void;
  onStartTour?: () => void;
};

export default function Navbar({
  selectedYear,
  onSelectYear,
  onExportPDF,
  onOpenSync,
  onOpenShare,
  onStartTour,
}: NavbarProps) {
  const pathname = usePathname();
  const isPanduan = pathname === "/panduan";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-2 sm:gap-3">
        {/* Left: Brand Logo Gandiva Labs & Kalender */}
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-2.5 group shrink-0 min-w-0"
          title="Kalender 2027 Indonesia - Gandiva Labs"
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

        {/* Center: Main Navigation Tabs (Kalender vs Panduan) di Layar Tablet & Desktop */}
        <nav className="hidden md:flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-1">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              !isPanduan
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700/80 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <svg className="w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span>Kalender</span>
          </Link>

          <Link
            href="/panduan"
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              isPanduan
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700/80 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <svg className="w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span>Panduan &amp; Artikel</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </Link>
        </nav>

        {/* Right side: Year Switcher, Mobile Panduan Link, Share, Sync, Export PDF & Theme Switcher */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Compact Year Switcher: 2026 / 2027 */}
          <div id="tour-year-selector" className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-0.5 sm:p-1">
            <button
              type="button"
              onClick={() => onSelectYear(2026)}
              className={`px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-md text-[11px] sm:text-xs font-medium transition-colors ${
                selectedYear === 2026
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700/80 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              2026
            </button>
            <button
              type="button"
              onClick={() => onSelectYear(2027)}
              className={`px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-md text-[11px] sm:text-xs font-medium transition-colors flex items-center gap-1 ${
                selectedYear === 2027
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700/80 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <span>2027</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </button>
          </div>

          {/* Akses Panduan Cepat di Mobile (< 768px) */}
          <Link
            href={isPanduan ? "/" : "/panduan"}
            className="md:hidden inline-flex items-center justify-center h-8 w-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title={isPanduan ? "Kembali ke Kalender" : "Buka Panduan & Artikel"}
            aria-label={isPanduan ? "Kembali ke Kalender" : "Buka Panduan & Artikel"}
          >
            {isPanduan ? (
              <svg className="w-4 h-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            ) : (
              <svg className="w-4 h-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            )}
          </Link>

          {/* Tombol Bagikan Rencana Cuti */}
          {onOpenShare && (
            <button
              type="button"
              onClick={onOpenShare}
              className="inline-flex items-center justify-center h-8 sm:h-auto gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-semibold transition-colors"
              title="Bagikan rencana cuti ini ke WhatsApp / teman"
              aria-label="Bagikan rencana cuti"
            >
              <svg className="w-3.5 h-3.5 pointer-events-none text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
              <span className="hidden sm:inline">Bagikan</span>
            </button>
          )}

          {/* Sync to Calendar Button */}
          <button
            id="tour-sync-btn"
            type="button"
            onClick={onOpenSync}
            className="inline-flex items-center justify-center h-8 sm:h-auto gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-xs font-medium transition-colors"
            title="Sinkronisasi ke Apple Calendar, Google Calendar, atau Outlook"
            aria-label="Sinkronkan Kalender"
          >
            <svg className="w-3.5 h-3.5 text-blue-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <span className="hidden lg:inline">Sinkronkan</span>
          </button>

          {/* Export PDF Button */}
          <button
            type="button"
            onClick={onExportPDF}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-xs font-medium transition-colors"
            aria-label="Unduh kalender PDF"
          >
            <svg className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            <span className="hidden lg:inline">Unduh PDF</span>
          </button>

          {/* Tombol Bantuan / Tur Panduan Fitur */}
          {onStartTour && (
            <button
              type="button"
              onClick={onStartTour}
              className="inline-flex items-center justify-center h-8 w-8 sm:h-auto sm:w-auto sm:px-2.5 sm:py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-xs font-medium transition-colors"
              title="Buka panduan fitur kalender interaktif"
              aria-label="Panduan Tur Fitur"
            >
              <svg className="w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 18h.01" />
              </svg>
              <span className="hidden xl:inline ml-1">Tur Fitur</span>
            </button>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
