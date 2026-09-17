"use client";

import { useMemo } from "react";
import type { Holiday, SupportedYear } from "@/data/holidays";
import { analyzeBurnoutRadar, type StaminaStatus } from "@/lib/burnoutRadar";

type BurnoutRadarCardProps = {
  year: SupportedYear;
  holidays: Holiday[];
  jointLeave: Holiday[];
  customMarkedDates: Set<string>;
  onApplyRechargeLeave: (dateStr: string) => void;
};

export default function BurnoutRadarCard({
  year,
  holidays,
  jointLeave,
  customMarkedDates,
  onApplyRechargeLeave,
}: BurnoutRadarCardProps) {
  const analysis = useMemo(() => {
    return analyzeBurnoutRadar(year, holidays, jointLeave, customMarkedDates);
  }, [year, holidays, jointLeave, customMarkedDates]);

  const statusBadge = useMemo(() => {
    const config: Record<
      StaminaStatus,
      { label: string; bg: string; text: string; border: string; pulse: string }
    > = {
      optimal: {
        label: "Ritme Kerja Prima",
        bg: "bg-emerald-50 dark:bg-emerald-950/50",
        text: "text-emerald-700 dark:text-emerald-300",
        border: "border-emerald-200 dark:border-emerald-800/60",
        pulse: "bg-emerald-500",
      },
      waspada: {
        label: "Perlu Waspada Lelah",
        bg: "bg-amber-50 dark:bg-amber-950/50",
        text: "text-amber-700 dark:text-amber-300",
        border: "border-amber-200 dark:border-amber-800/60",
        pulse: "bg-amber-500",
      },
      rawan: {
        label: "Zona Rentan Keletihan",
        bg: "bg-rose-50 dark:bg-rose-950/50",
        text: "text-rose-700 dark:text-rose-300",
        border: "border-rose-200 dark:border-rose-800/60",
        pulse: "bg-rose-500",
      },
    };
    return config[analysis.staminaStatus];
  }, [analysis.staminaStatus]);

  const topRecharge = analysis.rechargeSuggestions[0];
  const isTopRechargeApplied = topRecharge ? customMarkedDates.has(topRecharge.date) : false;

  return (
    <div
      id="tour-burnout-radar"
      className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-6 shadow-sm space-y-5"
    >
      {/* Header: Judul, Subjudul, dan Badge Status Stamina */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Radar Anti-Keletihan &amp; Keseimbangan Kerja
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold">
              Tahun {year}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Analisis rentang kerja terpanjang tanpa libur resmi untuk mencegah kejenuhan kronis dan merawat energi prima.
          </p>
        </div>

        {/* Lencana Indikator Stamina */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${statusBadge.border} ${statusBadge.bg} ${statusBadge.text} text-xs font-semibold shrink-0 shadow-2xs`}
        >
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusBadge.pulse} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${statusBadge.pulse}`} />
          </span>
          <span>{statusBadge.label}</span>
        </div>
      </div>

      {/* Grid 3 Kartu Metrik Kunci */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Metrik 1: Rentang Kerja Terpanjang */}
        <div className="p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/50 space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
            Rentang Kerja Terpanjang
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              {analysis.longestStreak.workDaysCount}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Hari Kerja</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
            Periode: {analysis.longestStreak.startMonth} &ndash; {analysis.longestStreak.endMonth}
          </p>
        </div>

        {/* Metrik 2: Rasio Kerja vs Istirahat */}
        <div className="p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/50 space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
            Rasio Kerja vs Istirahat
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              {analysis.workPercentage}% : {analysis.restPercentage}%
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
            {analysis.totalWorkDays} hari kerja / {analysis.totalRestDays} hari libur
          </p>
        </div>

        {/* Metrik 3: Skor Stamina Kerja */}
        <div className="p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/50 space-y-1">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
            Indeks Stamina Tahunan
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              {analysis.staminaScore}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">/ 100</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {analysis.staminaScore >= 80 ? "Peluang burnout rendah" : "Perlu rehat strategis"}
          </p>
        </div>
      </div>

      {/* Kotak Rekomendasi Hari Pemulihan (Strategic Recharge Day) */}
      {topRecharge && (
        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60">
                Saran Cuti Pemulihan
              </span>
              <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-100">
                {topRecharge.formattedDate}
              </span>
            </div>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {topRecharge.description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onApplyRechargeLeave(topRecharge.date)}
            className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 shadow-xs ${
              isTopRechargeApplied
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
          >
            {isTopRechargeApplied ? (
              <>
                <svg className="w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span>Sudah Ditandai di Kalender</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Terapkan 1 Hari Cuti</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
