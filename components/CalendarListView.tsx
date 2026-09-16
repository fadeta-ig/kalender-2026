"use client";

import type { MonthSchedule } from "@/lib/calendar";

type CalendarListViewProps = {
  schedules: MonthSchedule[];
};

export default function CalendarListView({ schedules }: CalendarListViewProps) {
  if (schedules.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Tidak ada jadwal libur atau cuti bersama pada tahun ini.
      </div>
    );
  }

  return (
    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
      {schedules.map((month) => (
        <article
          key={month.label}
          className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 transition-colors"
        >
          <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {month.label}
            </h2>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
              {month.entries.length} tanggal libur
            </span>
          </div>

          <ul className="space-y-2.5">
            {month.entries.map((entry) => {
              const isHoliday = entry.type === "libur";
              return (
                <li
                  key={entry.key}
                  className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/70 bg-zinc-50/50 dark:bg-zinc-800/30 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-colors"
                >
                  <div className="space-y-0.5 pr-3">
                    <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                      {entry.weekday}
                    </span>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-snug">
                      {entry.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        isHoliday
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                          : "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60"
                      }`}
                    >
                      {isHoliday ? "Libur" : "Cuti"}
                    </span>
                    <span className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums w-8 text-right">
                      {entry.dayNumber}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </article>
      ))}
    </section>
  );
}
