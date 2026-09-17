"use client";

import type { LeaveStrategy, SimulatedLeavePlan } from "@/lib/leaveOptimizer";

type LeaveBudgetSimulatorProps = {
  quota: number;
  strategy: LeaveStrategy;
  plan: SimulatedLeavePlan;
  isCalendarHighlighted: boolean;
  onUpdateQuota: (quota: number) => void;
  onUpdateStrategy: (strategy: LeaveStrategy) => void;
  onToggleHighlightCalendar: () => void;
  onSharePlan?: () => void;
};

const PRESETS = [3, 5, 8, 12];

export default function LeaveBudgetSimulator({
  quota,
  strategy,
  plan,
  isCalendarHighlighted,
  onUpdateQuota,
  onUpdateStrategy,
  onToggleHighlightCalendar,
  onSharePlan,
}: LeaveBudgetSimulatorProps) {
  const formatDateRange = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const formatter = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
    });

    const yearFormatter = new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
    });

    return `${formatter.format(start)} - ${formatter.format(end)} ${yearFormatter.format(end)}`;
  };

  return (
    <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-6 space-y-5 sm:space-y-6 transition-colors w-full min-w-0 overflow-hidden">
      {/* Header Section */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
          <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.75l-6 6m0 0l-3-3m3 3l-3 3" />
          </svg>
          <span>Kalkulator Rencana Libur</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Simulasi Jatah Cuti Tahunan
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-normal">
          Tentukan sisa jatah cuti yang ingin Anda gunakan, sistem akan otomatis meracik paket liburan terpanjang tanpa membuang kuota.
        </p>
      </div>

      {/* Controls: Quota Stepper & Strategy Selector */}
      <div className="grid gap-4 sm:grid-cols-2 p-3 sm:p-4 rounded-lg border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-800/30">
        {/* Quota Input */}
        <div className="space-y-2 min-w-0">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block">
            Berapa hari sisa cuti kerja Anda?
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateQuota(Math.max(1, quota - 1))}
              disabled={quota <= 1}
              className="w-9 h-9 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center font-medium disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shrink-0"
              aria-label="Kurangi cuti"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
              </svg>
            </button>

            <div className="flex-1 text-center py-1.5 px-2 sm:px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-semibold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 truncate">
              {quota} Hari Cuti
            </div>

            <button
              type="button"
              onClick={() => onUpdateQuota(Math.min(24, quota + 1))}
              disabled={quota >= 24}
              className="w-9 h-9 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center font-medium disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shrink-0"
              aria-label="Tambah cuti"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>

          {/* Presets dengan wrap */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">Pilih Cepat:</span>
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onUpdateQuota(p)}
                className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                  quota === p
                    ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium"
                    : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                {p} Hari
              </button>
            ))}
          </div>
        </div>

        {/* Strategy Selector */}
        <div className="space-y-2 min-w-0">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block">
            Gaya Liburan yang Diinginkan
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onUpdateStrategy("longest")}
              className={`p-2.5 rounded-lg border text-left transition-colors flex flex-col justify-between ${
                strategy === "longest"
                  ? "border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  : "border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-800/40 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <span className="text-xs font-semibold block">Libur Terpanjang</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 block leading-tight">
                Fokus cuti di 1-2 waktu besar
              </span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateStrategy("frequent")}
              className={`p-2.5 rounded-lg border text-left transition-colors flex flex-col justify-between ${
                strategy === "frequent"
                  ? "border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  : "border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-800/40 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              <span className="text-xs font-semibold block">Sering Libur</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 block leading-tight">
                Banyak long weekend 3-4 hari
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Output Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-2.5 sm:p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 text-center">
          <div className="text-xl sm:text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
            {plan.totalDaysOff} Hari
          </div>
          <div className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-normal leading-tight">
            Total Libur Diperoleh
          </div>
        </div>

        <div className="p-2.5 sm:p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 text-center">
          <div className="text-xl sm:text-2xl font-semibold text-blue-600 dark:text-blue-400">
            {plan.leaveDaysUsed} Hari
          </div>
          <div className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-normal leading-tight">
            Cuti yang Digunakan
          </div>
        </div>

        <div className="p-2.5 sm:p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 text-center">
          <div className="text-xl sm:text-2xl font-semibold text-zinc-700 dark:text-zinc-300">
            {plan.remainingQuota} Hari
          </div>
          <div className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-normal leading-tight">
            Sisa Kuota Cuti
          </div>
        </div>

        <div className="p-2.5 sm:p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 text-center">
          <div className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {plan.overallEfficiency}x
          </div>
          <div className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-normal leading-tight">
            Rasio Hemat Cuti
          </div>
        </div>
      </div>

      {/* Action: Highlight on Calendar & Package List */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 w-full min-w-0">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Paket Liburan yang Terpilih ({plan.selectedPackages.length} Periode)
        </h3>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {onSharePlan && (
            <button
              type="button"
              onClick={onSharePlan}
              className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              title="Bagikan rencana libur ini ke WhatsApp atau teman"
            >
              <svg className="w-3.5 h-3.5 pointer-events-none text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
              <span>Bagikan Rencana</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleHighlightCalendar}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center justify-center gap-2 ${
              isCalendarHighlighted
                ? "border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/80"
                : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            }`}
          >
            <svg className="w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              {isCalendarHighlighted
                ? "Hilangkan Tanda"
                : "Tandai di Kalender"}
            </span>
          </button>
        </div>
      </div>

      {/* Packages Detail Listing */}
      {plan.selectedPackages.length === 0 ? (
        <div className="p-4 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Belum ada paket liburan yang cocok dengan kuota {quota} hari. Coba tingkatkan kuota cuti Anda.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {plan.selectedPackages.map((pkg, idx) => (
            <div
              key={pkg.id}
              className="p-3.5 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 space-y-2 min-w-0"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                  Paket #{idx + 1}
                </span>
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {formatDateRange(pkg.startDate, pkg.endDate)}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {pkg.title}
              </h4>

              <div className="flex items-center gap-3 text-xs pt-1">
                <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {pkg.totalDays} Hari Libur
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  {pkg.leaveDaysNeeded} Hari Cuti
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
