"use client";

import type { SupportedYear } from "@/data/holidays";
import ThemeToggle from "./ThemeToggle";

type NavbarProps = {
  selectedYear: SupportedYear;
  onSelectYear: (year: SupportedYear) => void;
  onExportPDF: () => void;
};

export default function Navbar({
  selectedYear,
  onSelectYear,
  onExportPDF,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">
            {/* Clean Calendar SVG Icon */}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 block">
              Kalender Resmi
            </span>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block -mt-0.5">
              Republik Indonesia
            </span>
          </div>
        </div>

        {/* Center: Year Switcher Segmented Control */}
        <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-1">
          <button
            type="button"
            onClick={() => onSelectYear(2026)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              selectedYear === 2026
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700/80"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            2026
          </button>
          <button
            type="button"
            onClick={() => onSelectYear(2027)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              selectedYear === 2027
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700/80"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <span>2027</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </button>
        </div>

        {/* Right actions: Export PDF & Theme Switcher */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onExportPDF}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-xs font-medium transition-colors"
          >
            <svg className="w-4 h-4 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            <span>Unduh PDF</span>
          </button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
