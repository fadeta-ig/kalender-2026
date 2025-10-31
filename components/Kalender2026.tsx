"use client";

import { JSX, useMemo } from "react";

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

type CalendarDay = {
  iso: string;
  label: string;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  events: Holiday[];
};

type CalendarMonth = {
  name: string;
  weeks: CalendarDay[][];
};

type Recommendation = {
  id: string;
  range: { start: string; end: string };
  totalDays: number;
  leaveDates: string[];
  highlights: string[];
};

const YEAR = 2026;

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

const EVENTS_2026: Holiday[] = [...HOLIDAYS_2026, ...JOINT_LEAVE_2026];

const eventsByDate = EVENTS_2026.reduce<Record<string, Holiday[]>>((acc, event) => {
  acc[event.date] = acc[event.date] ? [...acc[event.date], event] : [event];
  return acc;
}, {});

function formatISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildSchedules(): MonthSchedule[] {
  const formatter = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" });
  const weekdayFormatter = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
  });
  const dayFormatter = new Intl.DateTimeFormat("id-ID", { day: "2-digit" });

  const byMonth = new Map<number, MonthSchedule>();

  for (const holiday of EVENTS_2026) {
    const date = new Date(holiday.date);
    const monthIndex = date.getMonth();
    const base = byMonth.get(monthIndex) ?? {
      label: formatter.format(date),
      entries: [],
    };

    base.entries.push({
      key: `${holiday.date}-${holiday.type}`,
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

function buildCalendar(): CalendarMonth[] {
  const monthFormatter = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  });

  const months: CalendarMonth[] = [];

  for (let month = 0; month < 12; month += 1) {
    const firstOfMonth = new Date(YEAR, month, 1);
    const monthName = monthFormatter.format(firstOfMonth);
    const weeks: CalendarDay[][] = [];

    const start = new Date(firstOfMonth);
    const offset = (start.getDay() + 6) % 7; // Monday as start of week
    start.setDate(start.getDate() - offset);

    const days: CalendarDay[] = [];

    while (days.length < 42) {
      const current = new Date(start);
      current.setDate(start.getDate() + days.length);
      const iso = formatISO(current);
      const weekday = (current.getDay() + 6) % 7;

      days.push({
        iso,
        label: String(current.getDate()),
        isCurrentMonth: current.getMonth() === month,
        isWeekend: weekday >= 5,
        events: eventsByDate[iso] ?? [],
      });
    }

    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    months.push({ name: monthName, weeks });
  }

  return months;
}

function buildRecommendations(): Recommendation[] {
  const start = new Date(YEAR, 0, 1);
  const end = new Date(YEAR, 11, 31);
  const bestByStart = new Map<string, Recommendation>();

  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    const startDate = new Date(cursor);
    const startIso = formatISO(startDate);

    for (let length = 4; length <= 8; length += 1) {
      const windowEnd = new Date(startDate);
      windowEnd.setDate(startDate.getDate() + length - 1);

      if (windowEnd.getFullYear() !== YEAR && !(windowEnd.getFullYear() === YEAR + 1 && windowEnd.getMonth() === 0)) {
        break;
      }

      if (windowEnd > end) {
        break;
      }

      const leaveDates: string[] = [];
      const highlights = new Set<string>();
      let hasHoliday = false;

      for (let day = new Date(startDate); day <= windowEnd; day.setDate(day.getDate() + 1)) {
        const iso = formatISO(day);
        const events = eventsByDate[iso] ?? [];

        if (events.length > 0) {
          hasHoliday = true;
          events.forEach((event) => highlights.add(event.name));
        }

        if (!isWeekend(day) && events.length === 0) {
          leaveDates.push(iso);
        }
      }

      if (!hasHoliday || leaveDates.length === 0 || leaveDates.length > 2) {
        continue;
      }

      const recommendation: Recommendation = {
        id: `${startIso}_${formatISO(windowEnd)}`,
        range: { start: startIso, end: formatISO(windowEnd) },
        totalDays: length,
        leaveDates,
        highlights: Array.from(highlights),
      };

      const existing = bestByStart.get(startIso);

      if (
        !existing ||
        leaveDates.length < existing.leaveDates.length ||
        (leaveDates.length === existing.leaveDates.length && length > existing.totalDays)
      ) {
        bestByStart.set(startIso, recommendation);
      }
    }
  }

  return Array.from(bestByStart.values()).sort((a, b) => a.range.start.localeCompare(b.range.start));
}

const schedules = buildSchedules();
const calendarMonths = buildCalendar();
const recommendations = buildRecommendations();

export default function Kalender2026(): JSX.Element {
  const legend = useMemo(
    () => [
      { type: "libur" as const, label: typeLabels.libur },
      { type: "cuti-bersama" as const, label: typeLabels["cuti-bersama"] },
    ],
    []
  );

  const weekdayLabels = useMemo(
    () => ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    []
  );

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
      }),
    []
  );

  const weekdayFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    []
  );

  const formatRange = (startIso: string, endIso: string): string => {
    const startDate = new Date(startIso);
    const endDate = new Date(endIso);
    const startLabel = dateFormatter.format(startDate);
    const endLabel = dateFormatter.format(endDate);

    if (startIso === endIso) {
      return startLabel;
    }

    if (startDate.getMonth() === endDate.getMonth()) {
      return `${startDate.getDate()}–${endLabel}`;
    }

    return `${startLabel} – ${endLabel}`;
  };

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

        <section className="glass rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glass">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                Kalender Lengkap 2026
              </h2>
              <p className="text-sm text-slate-300 sm:text-base">
                Lihat gambaran penuh setiap bulan untuk memetakan jadwal Anda dengan mudah. Hari libur dan cuti bersama akan otomatis disorot.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {calendarMonths.map((month) => (
              <article
                key={month.name}
                className="rounded-3xl border border-white/5 bg-slate-900/50 p-4 shadow-inner backdrop-blur"
              >
                <h3 className="text-lg font-semibold text-white">{month.name}</h3>
                <div className="mt-4 space-y-2">
                  <div className="grid grid-cols-7 text-center text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">
                    {weekdayLabels.map((weekday) => (
                      <span key={weekday}>{weekday}</span>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {month.weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="grid grid-cols-7 gap-1">
                        {week.map((day) => {
                          const hasEvents = day.events.length > 0;
                          const dayStyles = [
                            "flex min-h-[64px] flex-col rounded-2xl border px-2 py-1 text-xs sm:text-sm",
                            day.isCurrentMonth
                              ? "border-white/5 bg-slate-900/70 text-slate-100"
                              : "border-white/5 bg-slate-900/20 text-slate-500",
                            day.isWeekend ? "border-sky-400/30" : "",
                            hasEvents ? "ring-1 ring-offset-1 ring-offset-slate-950" : "",
                          ]
                            .filter(Boolean)
                            .join(" ");

                          return (
                            <div key={day.iso} className={dayStyles}>
                              <span className="text-xs font-semibold sm:text-sm">{day.label}</span>
                              <div className="mt-1 space-y-1">
                                {day.events.map((event) => (
                                  <span
                                    key={`${day.iso}-${event.type}`}
                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${typeStyles[event.type]}`}
                                  >
                                    {typeLabels[event.type]}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="glass rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-glass">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                Rekomendasi Cuti Pintar
              </h2>
              <p className="text-sm text-slate-300 sm:text-base">
                Sistem cerdas menganalisis akhir pekan dan hari libur untuk memberi saran cuti yang menghasilkan libur panjang.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {recommendations.length === 0 ? (
              <p className="rounded-3xl border border-white/5 bg-slate-900/70 p-6 text-sm text-slate-200">
                Belum ada rekomendasi cuti yang memenuhi kriteria libur panjang. Coba cek kembali saat kalender diperbarui.
              </p>
            ) : (
              recommendations.map((item) => (
                <article
                  key={item.id}
                  className="rounded-3xl border border-white/5 bg-slate-900/70 p-5 shadow-inner"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {formatRange(item.range.start, item.range.end)}
                  </h3>
                  <p className="mt-1 text-sm text-slate-300">
                    Ambil <strong className="font-semibold text-sky-300">{item.leaveDates.length}</strong> hari cuti untuk menikmati <strong className="font-semibold text-emerald-300">{item.totalDays}</strong> hari libur berturut-turut.
                  </p>

                  <div className="mt-4 space-y-3 text-sm text-slate-200">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Ambil cuti pada
                      </p>
                      <ul className="mt-1 space-y-1">
                        {item.leaveDates.map((leaveDate) => (
                          <li
                            key={leaveDate}
                            className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-900/70 px-3 py-2"
                          >
                            <span>{weekdayFormatter.format(new Date(leaveDate))}</span>
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Cuti</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Libur pendukung
                      </p>
                      <ul className="mt-1 space-y-1">
                        {item.highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className="flex items-center rounded-2xl border border-white/5 bg-emerald-500/10 px-3 py-2 text-emerald-100"
                          >
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <footer className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-sm text-slate-300 backdrop-blur-lg">
          Data diambil dari Surat Keputusan Bersama (SKB) 3 Menteri tentang Hari Libur Nasional dan Cuti Bersama Tahun 2026.
        </footer>
      </div>
    </main>
  );
}
