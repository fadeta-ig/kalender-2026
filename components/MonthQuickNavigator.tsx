"use client";

import type { CalendarMonth } from "@/lib/calendar";

type MonthQuickNavigatorProps = {
  calendarMonths: CalendarMonth[];
  selectedMonth: number | null; // null = Semua Bulan (0-11 = Bulan spesifik)
  onSelectMonth: (monthIndex: number | null) => void;
};

const SHORT_MONTHS = [
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
}: MonthQuickNavigatorProps) {
  return (
    <div className="w-full overflow-x-auto pb-1 -mb-1 scrollbar-none">
      <div className="inline-flex items-center gap-1.5 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 min-w-full sm:min-w-0">
        {/* Tombol Tampilkan Semua Bulan */}
        <button
          type="button"
          onClick={() => onSelectMonth(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
            selectedMonth === null
              ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
        >
          Semua Bulan
        </button>

        <div className="h-4 w-px bg-zinc-200 dark:border-zinc-800 shrink-0" />

        {/* Tombol Per Bulan (Jan - Des) */}
        {SHORT_MONTHS.map((name, index) => {
          const isSelected = selectedMonth === index;
          const monthData = calendarMonths[index];
          const hasHolidays = monthData
            ? monthData.days.some((d) => (d.isHoliday || d.isCutiBersama) && d.isCurrentMonth)
            : false;

          return (
            <button
              key={name}
              type="button"
              onClick={() => onSelectMonth(index)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <span>{name}</span>
              {hasHolidays && (
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isSelected
                      ? "bg-emerald-400 dark:bg-emerald-600"
                      : "bg-emerald-500"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
