"use client";

import type { CalendarMonth } from "@/lib/calendar";

type CalendarGridViewProps = {
  calendarMonths: CalendarMonth[];
};

const DAY_NAMES = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"] as const;

export default function CalendarGridView({ calendarMonths }: CalendarGridViewProps) {
  const todayString = new Date().toISOString().split("T")[0];

  return (
    <section className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {calendarMonths.map((monthData, index) => {
        const holidaysInMonth = monthData.days.filter((d) => d.isHoliday && d.isCurrentMonth).length;
        const cutiInMonth = monthData.days.filter((d) => d.isCutiBersama && d.isCurrentMonth).length;

        return (
          <article
            key={`${monthData.year}-${monthData.month}`}
            className="glass rounded-3xl p-5 hover-lift animate-scale-in"
            style={{ animationDelay: `${index * 0.03}s` }}
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center justify-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-sky-400 to-purple-500"></span>
              {monthData.monthName} {monthData.year}
            </h2>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAY_NAMES.map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-slate-400 py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid cells */}
            <div className="grid grid-cols-7 gap-1">
              {monthData.days.map((dayData, dayIndex) => {
                const isToday = dayData.dateString === todayString;

                return (
                  <div
                    key={`${dayData.dateString}-${dayIndex}`}
                    className={`
                      relative aspect-square rounded-lg p-1 text-center text-xs font-medium
                      transition-all duration-300 cursor-pointer group flex items-center justify-center
                      ${!dayData.isCurrentMonth ? "text-slate-600 opacity-40" : "text-slate-200"}
                      ${dayData.isWeekend && dayData.isCurrentMonth ? "bg-white/5" : ""}
                      ${dayData.isHoliday ? "bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 ring-1 ring-emerald-400/40 text-emerald-100 font-semibold" : ""}
                      ${dayData.isCutiBersama ? "bg-gradient-to-br from-sky-500/30 to-sky-600/20 ring-1 ring-sky-400/40 text-sky-100 font-semibold" : ""}
                      ${isToday ? "ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/20 font-bold" : ""}
                      ${dayData.isCurrentMonth && !dayData.isHoliday && !dayData.isCutiBersama ? "hover:bg-white/10 hover:scale-110" : ""}
                    `}
                    title={dayData.holidayName || undefined}
                  >
                    <span className={isToday ? "text-yellow-400 font-bold" : ""}>
                      {dayData.day}
                    </span>

                    {/* Tooltip for holiday name */}
                    {dayData.holidayName && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-950/95 border border-slate-700 text-white text-[11px] rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-30 shadow-2xl backdrop-blur-md">
                        {dayData.holidayName}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950"></div>
                      </div>
                    )}

                    {/* Indicator dots for holidays */}
                    {(dayData.isHoliday || dayData.isCutiBersama) && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                        <span
                          className={`block w-1.5 h-1.5 rounded-full ${
                            dayData.isHoliday ? "bg-emerald-400" : "bg-sky-400"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Month stats footer */}
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-slate-400">{holidaysInMonth} Libur</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                <span className="text-slate-400">{cutiInMonth} Cuti</span>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
