"use client";

import type { CalendarMonth } from "@/lib/calendar";
import { getCulturalDateInfo } from "@/lib/culturalCalendar";

type CalendarGridViewProps = {
  calendarMonths: CalendarMonth[];
  showCulturalOverlay?: boolean;
  selectedDate?: string | null;
  highlightedPersonalLeaveDates?: Set<string>;
  onSelectDate?: (dateStr: string) => void;
  onSelectMonth?: (monthIndex: number) => void;
};

const DAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"] as const;

export default function CalendarGridView({
  calendarMonths,
  showCulturalOverlay = false,
  selectedDate,
  highlightedPersonalLeaveDates,
  onSelectDate,
  onSelectMonth,
}: CalendarGridViewProps) {
  const todayString = new Date().toISOString().split("T")[0];

  return (
    <section className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {calendarMonths.map((monthData) => {
        // Daftar hari libur & cuti bersama pada bulan ini
        const monthHolidays = monthData.days
          .filter((d) => (d.isHoliday || d.isCutiBersama) && d.isCurrentMonth)
          .sort((a, b) => a.dateString.localeCompare(b.dateString));

        const holidaysCount = monthData.days.filter((d) => d.isHoliday && d.isCurrentMonth).length;
        const cutiCount = monthData.days.filter((d) => d.isCutiBersama && d.isCurrentMonth).length;

        return (
          <article
            key={`${monthData.year}-${monthData.month}`}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 transition-colors flex flex-col justify-between"
          >
            <div>
              {/* Header Kartu Bulan */}
              <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => onSelectMonth?.(monthData.month)}
                  className="text-left group flex items-center gap-1.5"
                  title="Buka tampilan fokus untuk bulan ini"
                >
                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">
                    {monthData.monthName} {monthData.year}
                  </h2>
                  <svg className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>

                <div className="flex items-center gap-1.5 text-[11px]">
                  {holidaysCount > 0 && (
                    <span className="inline-flex items-center gap-1 font-medium text-red-600 dark:text-red-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      {holidaysCount}
                    </span>
                  )}
                  {cutiCount > 0 && (
                    <span className="inline-flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      {cutiCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-1.5 text-center">
                {DAY_LABELS.map((day, i) => (
                  <div
                    key={day}
                    className={`text-[11px] font-medium py-0.5 ${
                      i === 6
                        ? "text-red-500 dark:text-red-400"
                        : "text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid Cells */}
              <div className="grid grid-cols-7 gap-1">
                {monthData.days.map((dayData, dayIndex) => {
                  const isToday = dayData.dateString === todayString;
                  const isSelected = dayData.dateString === selectedDate;
                  const isPersonalLeave =
                    dayData.isCurrentMonth &&
                    highlightedPersonalLeaveDates?.has(dayData.dateString);

                  let cellStyle = "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800";
                  if (!dayData.isCurrentMonth) {
                    cellStyle = "text-zinc-300 dark:text-zinc-700 pointer-events-none opacity-40";
                  } else if (dayData.isHoliday) {
                    cellStyle = "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-medium border border-red-200/80 dark:border-red-800/60";
                  } else if (dayData.isCutiBersama) {
                    cellStyle = "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium border border-blue-200/80 dark:border-blue-800/60";
                  } else if (isPersonalLeave) {
                    cellStyle = "bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-medium border border-amber-300 dark:border-amber-700/80";
                  } else if (dayData.isWeekend) {
                    cellStyle = "text-zinc-500 dark:text-zinc-400 bg-zinc-50/60 dark:bg-zinc-800/30";
                  }

                  const culturalInfo =
                    showCulturalOverlay && dayData.isCurrentMonth
                      ? getCulturalDateInfo(dayData.date)
                      : null;

                  const tooltipText = isPersonalLeave
                    ? "Rencana Cuti Kerja Anda"
                    : dayData.holidayName;

                  return (
                    <button
                      key={`${dayData.dateString}-${dayIndex}`}
                      type="button"
                      disabled={!dayData.isCurrentMonth}
                      className={`
                        relative min-h-[44px] sm:min-h-[48px] rounded-md p-0.5
                        flex flex-col items-center justify-between transition-all cursor-pointer group text-left
                        ${cellStyle}
                        ${isToday ? "ring-1 ring-zinc-900 dark:ring-zinc-100 font-semibold" : ""}
                        ${isSelected ? "ring-2 ring-zinc-900 dark:ring-zinc-100 z-10" : ""}
                      `}
                      title={tooltipText || undefined}
                      onClick={() => {
                        if (dayData.isCurrentMonth) {
                          onSelectDate?.(dayData.dateString);
                        }
                      }}
                    >
                      {/* Tanggal Masehi */}
                      <span className={`text-xs font-semibold pt-0.5 ${
                        dayData.date.getDay() === 0 && dayData.isCurrentMonth ? "text-red-600 dark:text-red-400" : ""
                      }`}>
                        {dayData.day}
                      </span>

                      {/* Subteks Penanggalan Budaya */}
                      {culturalInfo && (
                        <span className="text-[8.5px] text-zinc-400 dark:text-zinc-500 tracking-tight leading-none text-center truncate max-w-full px-0.5">
                          {culturalInfo.hijriah.split(" ")[0]} {culturalInfo.pasaran.slice(0, 3)}
                        </span>
                      )}

                      {/* Titik Indikator */}
                      <div className="h-1.5 flex items-center justify-center pb-0.5">
                        {dayData.isCurrentMonth && (dayData.isHoliday || dayData.isCutiBersama || isPersonalLeave) && (
                          <span
                            className={`block h-1 w-1 rounded-full ${
                              isPersonalLeave
                                ? "bg-amber-500"
                                : dayData.isHoliday
                                ? "bg-red-500"
                                : "bg-blue-500"
                            }`}
                          />
                        )}
                      </div>

                      {/* Tooltip Hover di Desktop */}
                      {tooltipText && (
                        <div className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-30">
                          {tooltipText}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mini Agenda Hari Libur di Bawah Grid */}
            <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800">
              {monthHolidays.length === 0 ? (
                <div className="text-[11px] text-zinc-400 dark:text-zinc-500 text-center py-1 font-normal">
                  Tidak ada hari libur resmi
                </div>
              ) : (
                <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                  {monthHolidays.map((holiday) => {
                    const isLibur = holiday.isHoliday;

                    return (
                      <div
                        key={holiday.dateString}
                        onClick={() => onSelectDate?.(holiday.dateString)}
                        className="flex items-start justify-between text-[11px] gap-2 py-0.5 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span
                            className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                              isLibur ? "bg-red-500" : "bg-blue-500"
                            }`}
                          />
                          <span className="truncate text-zinc-700 dark:text-zinc-300 font-normal">
                            {holiday.holidayName}
                          </span>
                        </div>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200 shrink-0">
                          {holiday.day} {monthData.monthName.slice(0, 3)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
}
