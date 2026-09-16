"use client";

import type { SKBMemberInfo } from "@/data/holidays";

type CalendarHeaderProps = {
  year: number;
  holidaysCount: number;
  jointLeaveCount: number;
  recommendationsCount: number;
  skbInfo: SKBMemberInfo;
};

export default function CalendarHeader({
  year,
  holidaysCount,
  jointLeaveCount,
  recommendationsCount,
  skbInfo,
}: CalendarHeaderProps) {
  return (
    <div className="space-y-6 text-center">
      {/* Official Badge - Flat hairline border */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
        <svg className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
          {skbInfo.decreeNumber}
        </span>
      </div>

      {/* Main Title - Clean, elegant typography without gradient or overweight text */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Kalender {year} Indonesia
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Daftar resmi hari libur nasional dan cuti bersama pemerintah, dilengkapi panduan cerdas untuk merencanakan cuti tahunan dengan lebih hemat.
        </p>
      </div>

      {/* Stats Summary - Flat cards, no shadows, no gradients */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xl mx-auto pt-2">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 text-center">
          <div className="text-2xl sm:text-3xl font-semibold text-emerald-600 dark:text-emerald-400">
            {holidaysCount}
          </div>
          <div className="text-xs font-normal text-zinc-500 dark:text-zinc-400 mt-0.5">
            Libur Nasional
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 text-center">
          <div className="text-2xl sm:text-3xl font-semibold text-blue-600 dark:text-blue-400">
            {jointLeaveCount}
          </div>
          <div className="text-xs font-normal text-zinc-500 dark:text-zinc-400 mt-0.5">
            Cuti Bersama
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 text-center">
          <div className="text-2xl sm:text-3xl font-semibold text-zinc-800 dark:text-zinc-200">
            {recommendationsCount}
          </div>
          <div className="text-xs font-normal text-zinc-500 dark:text-zinc-400 mt-0.5">
            Ide Libur Panjang
          </div>
        </div>
      </div>

      {/* Legend - Subtle flat indicators */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs pt-1">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
          <span className="text-zinc-600 dark:text-zinc-400 font-normal">Libur Nasional</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" />
          <span className="text-zinc-600 dark:text-zinc-400 font-normal">Cuti Bersama</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm border border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800" />
          <span className="text-zinc-600 dark:text-zinc-400 font-normal">Hari Ini</span>
        </div>
      </div>
    </div>
  );
}
