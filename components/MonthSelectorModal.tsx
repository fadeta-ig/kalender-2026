"use client";

import { useEffect } from "react";
import type { CalendarMonth } from "@/lib/calendar";

type MonthSelectorModalProps = {
  isOpen: boolean;
  year: number;
  calendarMonths: CalendarMonth[];
  selectedMonth: number | null; // null = Semua Bulan, 0-11 = Bulan tertentu
  onSelectMonth: (monthIndex: number | null) => void;
  onClose: () => void;
};

const QUARTER_NAMES = [
  "Kuartal I",
  "Kuartal I",
  "Kuartal I",
  "Kuartal II",
  "Kuartal II",
  "Kuartal II",
  "Kuartal III",
  "Kuartal III",
  "Kuartal III",
  "Kuartal IV",
  "Kuartal IV",
  "Kuartal IV",
] as const;

export default function MonthSelectorModal({
  isOpen,
  year,
  calendarMonths,
  selectedMonth,
  onSelectMonth,
  onClose,
}: MonthSelectorModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="month-selector-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-t-2xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <div>
              <h2 id="month-selector-title" className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Pilih Bulan ({year})
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Lompat langsung ke bulan yang ingin Anda lihat
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Tutup"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Tombol Tampilkan Semua Bulan */}
          <button
            type="button"
            onClick={() => {
              onSelectMonth(null);
              onClose();
            }}
            className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
              selectedMonth === null
                ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
              <span>Tampilkan Semua 12 Bulan (Tinjauan Tahunan)</span>
            </div>
            {selectedMonth === null && (
              <span className="text-[11px] font-semibold uppercase tracking-wider">Aktif</span>
            )}
          </button>

          {/* Grid 12 Bulan (3 kolom di HP, 4 kolom di layar lebih besar) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {calendarMonths.map((m, idx) => {
              const isSelected = selectedMonth === idx;
              const holidayCount = m.days.filter((d) => d.isHoliday && d.isCurrentMonth).length;
              const cutiCount = m.days.filter((d) => d.isCutiBersama && d.isCurrentMonth).length;
              const totalDaysOff = holidayCount + cutiCount;

              return (
                <button
                  key={m.monthName}
                  type="button"
                  onClick={() => {
                    onSelectMonth(idx);
                    onClose();
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2.5 active:scale-[0.98] ${
                    isSelected
                      ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-medium uppercase tracking-wider ${
                      isSelected ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-400 dark:text-zinc-500"
                    }`}>
                      {QUARTER_NAMES[idx]}
                    </span>
                    <span className={`text-[11px] font-mono font-medium ${
                      isSelected ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-400 dark:text-zinc-500"
                    }`}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-sm font-semibold tracking-tight ${
                      isSelected ? "text-white dark:text-zinc-900" : "text-zinc-900 dark:text-zinc-100"
                    }`}>
                      {m.monthName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px]">
                    {totalDaysOff > 0 ? (
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        isSelected
                          ? "bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900"
                          : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200/60 dark:border-red-800/40"
                      }`}>
                        {totalDaysOff} Hari Libur
                      </span>
                    ) : (
                      <span className={`text-[10px] ${
                        isSelected ? "text-zinc-400 dark:text-zinc-600" : "text-zinc-400 dark:text-zinc-500"
                      }`}>
                        Hari kerja normal
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end shrink-0 bg-zinc-50 dark:bg-zinc-950">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
