"use client";

import type { CalendarMonth } from "@/lib/calendar";

type CalendarGridViewProps = {
  calendarMonths: CalendarMonth[];
};

const DAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"] as const;

export default function CalendarGridView({ calendarMonths }: CalendarGridViewProps) {
  const todayString = new Date().toISOString().split("T")[0];

  return (
    <section className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {calendarMonths.map((monthData) => {
        const holidaysInMonth = monthData.days.filter((d) => d.isHoliday && d.isCurrentMonth).length;
        const cutiInMonth = monthData.days.filter((d) => d.isCutiBersama && d.isCurrentMonth).length;

        return (
          <article
            key={`${monthData.year}-${monthData.month}`}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 transition-colors"
          >
            {/* Month title */}
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-zinc-100 dark:border-zinc-800/80">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {monthData.monthName} {monthData.year}
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                {holidaysInMonth > 0 && (
                  <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {holidaysInMonth}
                  </span>
                )}
                {cutiInMonth > 0 && (
                  <span className="inline-flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    {cutiInMonth}
                  </span>
                )}
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-1 text-center">
              {DAY_LABELS.map((day, i) => (
                <div
                  key={day}
                  className={`text-[11px] font-medium py-1 ${
                    i === 6
                      ? "text-red-500 dark:text-red-400"
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid cells */}
            <div className="grid grid-cols-7 gap-1">
              {monthData.days.map((dayData, dayIndex) => {
                const isToday = dayData.dateString === todayString;

                let cellStyle = "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800";
                if (!dayData.isCurrentMonth) {
                  cellStyle = "text-zinc-300 dark:text-zinc-700 pointer-events-none";
                } else if (dayData.isHoliday) {
                  cellStyle = "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-800/60";
                } else if (dayData.isCutiBersama) {
                  cellStyle = "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium border border-blue-200 dark:border-blue-800/60";
                } else if (dayData.isWeekend) {
                  cellStyle = "text-zinc-500 dark:text-zinc-400 bg-zinc-50/60 dark:bg-zinc-800/30";
                }

                return (
                  <div
                    key={`${dayData.dateString}-${dayIndex}`}
                    className={`
                      relative aspect-square rounded-md text-xs font-normal
                      flex flex-col items-center justify-center transition-colors cursor-pointer group
                      ${cellStyle}
                      ${isToday ? "ring-1.5 ring-zinc-900 dark:ring-zinc-100 font-semibold" : ""}
                    `}
                    title={dayData.holidayName || undefined}
                  >
                    <span>{dayData.day}</span>

                    {/* Indicator dot */}
                    {dayData.isCurrentMonth && (dayData.isHoliday || dayData.isCutiBersama) && (
                      <span
                        className={`block h-1 w-1 rounded-full mt-0.5 ${
                          dayData.isHoliday ? "bg-emerald-500" : "bg-blue-500"
                        }`}
                      />
                    )}

                    {/* Tooltip for holiday name */}
                    {dayData.holidayName && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-30">
                        {dayData.holidayName}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </article>
        );
      })}
    </section>
  );
}
