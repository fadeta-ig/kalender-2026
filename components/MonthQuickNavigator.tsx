"use client";

import type { CalendarMonth } from "@/lib/calendar";

type MonthQuickNavigatorProps = {
  calendarMonths: CalendarMonth[];
  selectedMonth: number | null; // null = Semua Bulan, 0-11 = Bulan spesifik
  onSelectMonth: (monthIndex: number | null) => void;
  onOpenMonthModal: () => void;
};

const QUARTERS = [
  { name: "Q1", label: "Kuartal I", months: [0, 1, 2] },
  { name: "Q2", label: "Kuartal II", months: [3, 4, 5] },
  { name: "Q3", label: "Kuartal III", months: [6, 7, 8] },
  { name: "Q4", label: "Kuartal IV", months: [9, 10, 11] },
] as const;

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
] as const;

export default function MonthQuickNavigator({
  calendarMonths,
  selectedMonth,
  onSelectMonth,
  onOpenMonthModal,
}: MonthQuickNavigatorProps) {
  // Hitung jumlah hari libur per bulan untuk badge informatif
  const holidayCounts = calendarMonths.map((m) => {
    return m.days.filter((d) => (d.isHoliday || d.isCutiBersama) && d.isCurrentMonth).length;
  });

  const currentMonthData = selectedMonth !== null ? calendarMonths[selectedMonth] : null;
  const currentMonthHolidays = selectedMonth !== null ? holidayCounts[selectedMonth] : 0;

  const handlePrev = () => {
    if (selectedMonth === null) {
      onSelectMonth(11);
    } else {
      onSelectMonth((selectedMonth + 11) % 12);
    }
  };

  const handleNext = () => {
    if (selectedMonth === null) {
      onSelectMonth(0);
    } else {
      onSelectMonth((selectedMonth + 1) % 12);
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* ========================================================= */}
      {/* 1. TAMPILAN MOBILE (< 640px) - Ergonomis & Touch-First    */}
      {/* ========================================================= */}
      <div className="block sm:hidden">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 flex items-center justify-between gap-1.5">
          {/* Tombol Panah Mundur */}
          <button
            type="button"
            onClick={handlePrev}
            className="w-9 h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all shrink-0"
            aria-label="Bulan sebelumnya"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Trigger Modal Pemilih Bulan (1-Tap Jump) */}
          <button
            type="button"
            onClick={onOpenMonthModal}
            className="flex-1 h-9 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between gap-1.5 active:scale-[0.98] transition-all overflow-hidden"
          >
            <div className="flex items-center gap-1.5 truncate">
              <svg className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {currentMonthData ? currentMonthData.monthName : "Semua Bulan"}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {currentMonthData && currentMonthHolidays > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200/80 dark:border-red-800/60">
                  {currentMonthHolidays} Libur
                </span>
              )}
              <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </button>

          {/* Tombol Panah Maju */}
          <button
            type="button"
            onClick={handleNext}
            className="w-9 h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all shrink-0"
            aria-label="Bulan berikutnya"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Toggle Cepat Mode 12 Bulan */}
          <button
            type="button"
            onClick={() => onSelectMonth(selectedMonth === null ? 0 : null)}
            className={`h-9 px-2 rounded-lg border text-[11px] font-medium transition-all shrink-0 flex items-center gap-1 ${
              selectedMonth === null
                ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
            }`}
            title="Beralih antara Tinjauan 12 Bulan dan Fokus 1 Bulan"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            <span>{selectedMonth === null ? "12 Bulan" : "1 Bln"}</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. TAMPILAN DESKTOP (>= 640px) - Enterprise Quarter Strip */}
      {/* ========================================================= */}
      <div className="hidden sm:flex items-center justify-between gap-3 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        {/* Sisi Kiri: Tombol Tampilkan Semua Bulan */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onSelectMonth(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedMonth === null
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            <span>Semua Bulan</span>
          </button>

          <button
            type="button"
            onClick={onOpenMonthModal}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Buka dialog pemilih bulan lengkap"
            aria-label="Buka dialog pemilih bulan"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          </button>
        </div>

        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 shrink-0" />

        {/* Sisi Kanan: Kuartal Q1 - Q4 dengan Badge Counter Rapi */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
          {QUARTERS.map((quarter, qIdx) => (
            <div key={quarter.name} className="flex items-center gap-1 shrink-0">
              {qIdx > 0 && (
                <div className="h-3 w-px bg-zinc-200 dark:bg-zinc-800 mx-0.5" />
              )}
              <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-1">
                {quarter.name}
              </span>

              <div className="flex items-center gap-0.5">
                {quarter.months.map((mIdx) => {
                  const isSelected = selectedMonth === mIdx;
                  const monthOff = holidayCounts[mIdx];
                  const mName = MONTH_NAMES[mIdx];

                  return (
                    <button
                      key={mName}
                      type="button"
                      onClick={() => onSelectMonth(mIdx)}
                      className={`px-2 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
                        isSelected
                          ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <span>{mName}</span>
                      {monthOff > 0 && (
                        <span
                          className={`text-[9px] font-mono px-1 py-0.2 rounded-full leading-tight ${
                            isSelected
                              ? "bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 font-medium"
                              : "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-800/40"
                          }`}
                        >
                          {monthOff}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
