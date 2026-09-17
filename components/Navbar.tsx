"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

type NavbarProps = {
  onStartTour?: () => void;
};

export default function Navbar({ onStartTour }: NavbarProps) {
  const pathname = usePathname();
  const isPanduan = pathname === "/panduan";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-3">
        {/* Left: Brand Logo Gandiva Labs & Kalender */}
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-2.5 group shrink-0 min-w-0"
          title="Kalender Indonesia - Gandiva Labs"
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

        {/* Right side: HANYA ADA Panduan, Tur Panduan, dan Toggle Tema */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* 1. Panduan */}
          <Link
            href={isPanduan ? "/" : "/panduan"}
            className={`inline-flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg border text-xs font-medium transition-colors ${
              isPanduan
                ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold"
                : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
            title={isPanduan ? "Kembali ke Kalender Utama" : "Buka Panduan & Artikel"}
            aria-label={isPanduan ? "Kembali ke Kalender Utama" : "Buka Panduan & Artikel"}
          >
            <svg className="w-3.5 h-3.5 pointer-events-none shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span className="hidden sm:inline">Panduan</span>
          </Link>

          {/* 2. Tur Panduan */}
          {onStartTour && (
            <button
              type="button"
              onClick={onStartTour}
              className="inline-flex items-center gap-1.5 h-8 sm:h-9 px-2 sm:px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-xs font-medium"
              title="Buka panduan fitur kalender"
              aria-label="Tur Panduan Fitur"
            >
              <svg className="w-3.5 h-3.5 pointer-events-none shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 18h.01" />
              </svg>
              <span className="hidden md:inline">Tur Panduan</span>
            </button>
          )}

          {/* 3. Toggle Tema */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
