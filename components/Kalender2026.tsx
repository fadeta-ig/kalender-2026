"use client";

import { useMemo } from "react";

type HolidayType = "libur" | "cuti-bersama";

type Holiday = {
  date: string;
  name: string;
  type: HolidayType;
};

const HOLIDAYS_2026: Holiday[] = [
  { date: "2026-01-01", name: "Tahun Baru 2026 Masehi", type: "libur" },
  { date: "2026-01-16", name: "Isra Mikraj Nabi Muhammad SAW", type: "libur" },
  { date: "2026-02-17", name: "Tahun Baru Imlek 2577 Kongzili", type: "libur" },
  { date: "2026-03-19", name: "Hari Suci Nyepi (Tahun Baru Saka 1948)", type: "libur" },
  { date: "2026-03-21", name: "Idul Fitri 1447 H (Hari 1)", type: "libur" },
  { date: "2026-03-22", name: "Idul Fitri 1447 H (Hari 2)", type: "libur" },
  { date: "2026-04-03", name: "Wafat Yesus Kristus", type: "libur" },
  { date: "2026-04-05", name: "Kebangkitan Yesus Kristus (Paskah)", type: "libur" },
  { date: "2026-05-01", name: "Hari Buruh Internasional", type: "libur" },
  { date: "2026-05-14", name: "Kenaikan Yesus Kristus", type: "libur" },
  { date: "2026-05-27", name: "Idul Adha 1447 H", type: "libur" },
  { date: "2026-05-31", name: "Hari Raya Waisak 2570 BE", type: "libur" },
  { date: "2026-06-01", name: "Hari Lahir Pancasila", type: "libur" },
  { date: "2026-06-16", name: "1 Muharram 1448 H (Tahun Baru Islam)", type: "libur" },
  { date: "2026-08-17", name: "Proklamasi Kemerdekaan", type: "libur" },
  { date: "2026-08-25", name: "Maulid Nabi Muhammad SAW", type: "libur" },
  { date: "2026-12-25", name: "Kelahiran Yesus Kristus (Natal)", type: "libur" },
];

const JOINT_LEAVE_2026: Holiday[] = [
  { date: "2026-02-16", name: "Cuti Bersama Imlek", type: "cuti-bersama" },
  { date: "2026-03-18", name: "Cuti Bersama Nyepi", type: "cuti-bersama" },
  { date: "2026-03-20", name: "Cuti Bersama Idul Fitri", type: "cuti-bersama" },
  { date: "2026-03-23", name: "Cuti Bersama Idul Fitri", type: "cuti-bersama" },
  { date: "2026-03-24", name: "Cuti Bersama Idul Fitri", type: "cuti-bersama" },
  { date: "2026-05-15", name: "Cuti Bersama Kenaikan Isa Almasih", type: "cuti-bersama" },
  { date: "2026-05-28", name: "Cuti Bersama Idul Adha", type: "cuti-bersama" },
  { date: "2026-12-24", name: "Cuti Bersama Natal", type: "cuti-bersama" },
];

type MonthSchedule = {
  label: string;
  entries: {
    key: string;
    name: string;
    type: HolidayType;
    weekday: string;
    dayNumber: string;
  }[];
};

const typeStyles: Record<HolidayType, string> = {
  libur:
    "bg-emerald-500/20 text-emerald-100 ring-1 ring-inset ring-emerald-400/40",
  "cuti-bersama":
    "bg-sky-500/20 text-sky-100 ring-1 ring-inset ring-sky-400/40",
};

const typeLabels: Record<HolidayType, string> = {
  libur: "Libur Nasional",
  "cuti-bersama": "Cuti Bersama",
};

function buildSchedules(): MonthSchedule[] {
  const formatter = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" });
  const weekdayFormatter = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
  });
  const dayFormatter = new Intl.DateTimeFormat("id-ID", { day: "2-digit" });

  const allHolidays = [...HOLIDAYS_2026, ...JOINT_LEAVE_2026];
  const byMonth = new Map<number, MonthSchedule>();

  for (const holiday of allHolidays) {
    const date = new Date(holiday.date);
    const monthIndex = date.getMonth();
    const base = byMonth.get(monthIndex) ?? {
      label: formatter.format(date),
      entries: [],
    };

    base.entries.push({
      key: holiday.date,
      name: holiday.name,
      type: holiday.type,
      weekday: weekdayFormatter.format(date),
      dayNumber: dayFormatter.format(date),
    });

    byMonth.set(monthIndex, base);
  }

  return Array.from(byMonth.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([, schedule]) => ({
      ...schedule,
      entries: schedule.entries.sort((a, b) => a.key.localeCompare(b.key)),
    }));
}

const schedules = buildSchedules();

export default function Kalender2026(): JSX.Element {
  const legend = useMemo(
    () => [
      { type: "libur" as const, label: typeLabels.libur },
      { type: "cuti-bersama" as const, label: typeLabels["cuti-bersama"] },
    ],
    []
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-sky-300">
            Kalender Resmi Pemerintah
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Kalender Libur Nasional &amp; Cuti Bersama 2026
          </h1>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            Daftar libur nasional dan cuti bersama berdasarkan SKB 3 Menteri.
            Gunakan informasi ini untuk merencanakan agenda dan cuti Anda sepanjang tahun 2026.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-slate-200">
            {legend.map((item) => (
              <span
                key={item.type}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${typeStyles[item.type]}`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    item.type === "libur" ? "bg-emerald-400" : "bg-sky-400"
                  }`}
                />
                {item.label}
              </span>
            ))}
          </div>
        </header>

        <section className="grid gap-6 sm:grid-cols-2">
          {schedules.map((month) => (
            <article
              key={month.label}
              className="glass rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glass transition hover:border-white/20 hover:bg-white/10"
            >
              <h2 className="text-lg font-semibold text-white sm:text-xl">
                {month.label}
              </h2>
              <ul className="mt-4 space-y-3">
                {month.entries.map((entry) => (
                  <li
                    key={entry.key}
                    className="rounded-2xl border border-white/5 bg-slate-900/60 px-4 py-3 text-sm shadow-sm backdrop-blur-md sm:text-base"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 sm:text-sm">
                          {entry.weekday}
                        </p>
                        <p className="mt-1 text-base font-semibold text-slate-100 sm:text-lg">
                          {entry.name}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 text-right">
                        <span className="text-3xl font-bold leading-none text-white sm:text-4xl">
                          {entry.dayNumber}
                        </span>
                        <span className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-semibold ${typeStyles[entry.type]}`}>
                          <span
                            className={`h-2 w-2 rounded-full ${
                              entry.type === "libur" ? "bg-emerald-400" : "bg-sky-400"
                            }`}
                          />
                          {typeLabels[entry.type]}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <footer className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-sm text-slate-300 backdrop-blur-lg">
          Data diambil dari Surat Keputusan Bersama (SKB) 3 Menteri tentang Hari Libur Nasional dan Cuti Bersama Tahun 2026.
        </footer>
      </div>
    </main>
  );
}
