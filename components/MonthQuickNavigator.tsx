"use client";

import type { CalendarMonth } from "@/lib/calendar";
import type { SupportedYear } from "@/data/holidays";

type MonthQuickNavigatorProps = {
  calendarMonths: CalendarMonth[];
  selectedMonth: number | null; // null = Semua Bulan, 0-11 = Bulan spesifik
  onSelectMonth: (monthIndex: number | null) => void;
  onOpenMonthModal: () => void;
  selectedYear: SupportedYear;
  onSelectYear: (year: SupportedYear) => void;
  onExportPDF: () => void;
  onOpenShare: () => void;
  onOpenSync: () => void;
  onOpenExportModal?: () => void;
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
  selectedYear,
  onSelectYear,
  onExportPDF,
  onOpenShare,
  onOpenSync,
  onOpenExportModal,
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
    <div className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 sm:p-3 space-y-2 sm:space-y-2.5 shadow-sm min-w-0">
      {/* ========================================================= */}
      {/* TINGKAT 1: NAVIGASI BULAN (Mobile vs Desktop)            */}
      {/* ========================================================= */}
      <div id="tour-month-nav" className="w-full min-w-0">
        {/* 1A. Tampilan Mobile (< 640px) */}
        <div className="block sm:hidden">
        <div className="flex items-center justify-between gap-1 w-full min-w-0">
          {/* Tombol Panah Mundur */}
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all shrink-0"
            aria-label="Bulan sebelumnya"
          >
            <svg className="w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Trigger Modal Pemilih Bulan (1-Tap Jump) */}
          <button
            type="button"
            onClick={onOpenMonthModal}
            className="flex-1 min-w-0 h-8 px-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between gap-1 active:scale-[0.98] transition-all overflow-hidden"
          >
            <div className="flex items-center gap-1 min-w-0 truncate">
              <svg className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {currentMonthData ? currentMonthData.monthName : "Semua Bulan"}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {currentMonthData && currentMonthHolidays > 0 && (
                <span className="px-1 py-0.2 rounded text-[9px] font-medium bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200/80 dark:border-red-800/60 leading-tight">
                  {currentMonthHolidays}
                </span>
              )}
              <svg className="w-3 h-3 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </button>

          {/* Tombol Panah Maju */}
          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all shrink-0"
            aria-label="Bulan berikutnya"
          >
            <svg className="w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Toggle Cepat Mode 12 Bulan */}
          <button
            type="button"
            onClick={() => onSelectMonth(selectedMonth === null ? 0 : null)}
            className={`h-8 px-2 rounded-lg border text-[10px] sm:text-[11px] font-medium transition-all shrink-0 flex items-center gap-1 ${
              selectedMonth === null
                ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
            }`}
            title="Beralih antara Tinjauan 12 Bulan dan Fokus 1 Bulan"
          >
            <svg className="w-3 h-3 pointer-events-none shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            <span className="hidden min-[360px]:inline">{selectedMonth === null ? "12 Bln" : "1 Bln"}</span>
          </button>
        </div>
      </div>

      {/* 1B. Tampilan Desktop & Tablet (>= 640px) */}
      <div className="hidden sm:flex items-center justify-between gap-2 lg:gap-3 w-full min-w-0 overflow-hidden">
        {/* Sisi Kiri: Tombol Tampilkan Semua Bulan & Dialog Grid */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onSelectMonth(null)}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedMonth === null
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <svg className="w-3.5 h-3.5 pointer-events-none shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            <span className="hidden md:inline">Semua Bulan</span>
            <span className="md:hidden">Semua</span>
          </button>

          <button
            type="button"
            onClick={onOpenMonthModal}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
            title="Buka dialog pemilih bulan lengkap"
            aria-label="Buka dialog pemilih bulan"
          >
            <svg className="w-4 h-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          </button>
        </div>

        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 shrink-0" />

        {/* Sisi Kanan: Kuartal Q1 - Q4 dengan Scroll Halus & No Overflow */}
        <div className="flex items-center gap-1.5 lg:gap-2 overflow-x-auto scrollbar-none py-0.5 min-w-0 flex-1">
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

      {/* ========================================================= */}
      {/* TINGKAT 2: ACTION TOOLBAR (Tahun, Bagikan, PDF, Sinkron)  */}
      {/* ========================================================= */}
      <div className="pt-2 sm:pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 min-w-0">
        {/* Sisi Kiri: Switcher Tahun (2026 / 2027) */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hidden sm:inline">
            Tahun:
          </span>
          <div
            id="tour-year-selector"
            className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 p-0.5"
          >
            <button
              type="button"
              onClick={() => onSelectYear(2026)}
              className={`px-2.5 sm:px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
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
              className={`px-2.5 sm:px-3 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 ${
                selectedYear === 2027
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700/80 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <span>2027</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </button>
          </div>
        </div>

        {/* Sisi Kanan: Tombol Aksi (Bagikan, Unduh PDF, Sinkronkan) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
          {/* Tombol Bagikan Rencana Cuti */}
          <button
            type="button"
            onClick={onOpenShare}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-semibold transition-colors shadow-xs"
            title="Bagikan rencana cuti ini ke WhatsApp / media sosial"
            aria-label="Bagikan rencana cuti"
          >
            <svg className="w-3.5 h-3.5 pointer-events-none text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
            <span>Bagikan</span>
          </button>

          {/* Tombol Unduh PDF Cetak A4 */}
          <button
            type="button"
            onClick={onExportPDF}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 text-xs font-medium transition-colors shadow-xs"
            title="Unduh kalender cetak resolusi tinggi (A4 Landscape PDF)"
            aria-label="Unduh kalender PDF"
          >
            <svg className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 pointer-events-none shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span className="hidden sm:inline">Unduh PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>

          {/* Tombol Ekspor Data Produktivitas (Notion/Sheets/Obsidian) */}
          {onOpenExportModal && (
            <button
              id="tour-export-btn"
              type="button"
              onClick={onOpenExportModal}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 text-xs font-medium transition-colors shadow-xs"
              title="Ekspor data kalender ke format Notion, Google Sheets, atau Obsidian"
              aria-label="Ekspor Data Produktivitas"
            >
              <svg className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 pointer-events-none shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
              </svg>
              <span className="hidden sm:inline">Ekspor Data</span>
              <span className="sm:hidden">Ekspor</span>
            </button>
          )}

          {/* Tombol Sinkronkan ke Google/Apple Calendar */}
          <button
            id="tour-sync-btn"
            type="button"
            onClick={onOpenSync}
            className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 text-xs font-medium transition-colors shadow-xs"
            title="Sinkronisasi ke Google Calendar, Apple iCal, atau Outlook"
            aria-label="Sinkronkan Kalender"
          >
            <svg className="w-3.5 h-3.5 text-blue-500 pointer-events-none shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <span className="hidden md:inline">Sinkronkan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
