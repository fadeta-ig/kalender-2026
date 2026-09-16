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
    <header className="text-center space-y-6 animate-slide-up">
      {/* SKB Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong border border-sky-400/30">
        <svg className="w-4 h-4 text-sky-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-sky-300">
          {skbInfo.decreeNumber}
        </span>
      </div>

      <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl gradient-text tracking-tight">
        Kalender {year}
      </h1>

      <p className="mt-4 text-base text-slate-300 sm:text-lg max-w-3xl mx-auto leading-relaxed">
        Daftar lengkap hari libur nasional dan cuti bersama berdasarkan{" "}
        <span className="text-white font-medium">SKB 3 Menteri</span> dilengkapi dengan{" "}
        <span className="text-sky-400 font-semibold">AI rekomendasi cuti optimal</span>.
      </p>

      {/* Stats Bar */}
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mt-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-400">{holidaysCount}</div>
          <div className="text-xs sm:text-sm text-slate-400 mt-1">Libur Nasional</div>
        </div>
        <div className="h-10 w-px bg-white/15"></div>
        <div className="text-center">
          <div className="text-3xl font-bold text-sky-400">{jointLeaveCount}</div>
          <div className="text-xs sm:text-sm text-slate-400 mt-1">Cuti Bersama</div>
        </div>
        <div className="h-10 w-px bg-white/15"></div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-400">{recommendationsCount}</div>
          <div className="text-xs sm:text-sm text-slate-400 mt-1">Rekomendasi AI</div>
        </div>
      </div>

      {/* Legend Indicators */}
      <div className="flex flex-wrap justify-center gap-3 text-xs sm:text-sm pt-2">
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-emerald-500/20 text-emerald-100 ring-1 ring-inset ring-emerald-400/40">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse-glow" />
          Libur Nasional
        </span>
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-sky-500/20 text-sky-100 ring-1 ring-inset ring-sky-400/40">
          <span className="h-2.5 w-2.5 rounded-full bg-sky-400 animate-pulse-glow" />
          Cuti Bersama
        </span>
      </div>
    </header>
  );
}
