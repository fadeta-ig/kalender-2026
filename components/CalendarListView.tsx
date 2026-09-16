"use client";

import type { MonthSchedule } from "@/lib/calendar";
import type { HolidayType } from "@/data/holidays";

type CalendarListViewProps = {
  schedules: MonthSchedule[];
};

const TYPE_STYLES: Record<HolidayType, string> = {
  libur: "bg-emerald-500/20 text-emerald-100 ring-1 ring-inset ring-emerald-400/40",
  "cuti-bersama": "bg-sky-500/20 text-sky-100 ring-1 ring-inset ring-sky-400/40",
};

export default function CalendarListView({ schedules }: CalendarListViewProps) {
  if (schedules.length === 0) {
    return (
      <div className="glass-strong rounded-3xl p-8 text-center text-slate-300">
        Tidak ada jadwal libur atau cuti bersama pada tahun ini.
      </div>
    );
  }

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
      {schedules.map((month, index) => (
        <article
          key={month.label}
          className="glass rounded-3xl p-6 hover-lift animate-scale-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-sky-400"></span>
            {month.label}
          </h2>
          <p className="text-xs text-slate-400 mb-4">{month.entries.length} hari libur & cuti</p>

          <ul className="space-y-3">
            {month.entries.map((entry, i) => (
              <li
                key={entry.key}
                className="glass-card rounded-2xl px-4 py-3.5 hover-lift transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.05 + i * 0.02}s` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      {entry.weekday}
                    </p>
                    <p className="text-sm font-semibold text-slate-100 leading-snug">
                      {entry.name}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-3xl font-bold leading-none text-white tabular-nums">
                      {entry.dayNumber}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${TYPE_STYLES[entry.type]}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          entry.type === "libur" ? "bg-emerald-400" : "bg-sky-400"
                        }`}
                      />
                      {entry.type === "libur" ? "Libur" : "Cuti"}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
