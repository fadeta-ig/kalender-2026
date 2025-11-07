"use client";

import { useMemo, useState } from "react";
import LeaveRecommendations from "./LeaveRecommendations";
import { analyzeLeaveOpportunities, getQuickInsights } from "@/lib/leaveRecommendation";

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

export default function Kalender2026() {
  const [activeTab, setActiveTab] = useState<"calendar" | "recommendations">("recommendations");

  const legend = useMemo(
    () => [
      { type: "libur" as const, label: typeLabels.libur },
      { type: "cuti-bersama" as const, label: typeLabels["cuti-bersama"] },
    ],
    []
  );

  // Generate AI recommendations
  const recommendations = useMemo(() => {
    return analyzeLeaveOpportunities(HOLIDAYS_2026, JOINT_LEAVE_2026);
  }, []);

  const insights = useMemo(() => {
    return getQuickInsights(recommendations);
  }, [recommendations]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section - Enhanced with glassmorphism */}
        <header className="text-center space-y-6 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong">
            <svg className="w-4 h-4 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold uppercase tracking-widest text-sky-300">
              Kalender Resmi Pemerintah
            </span>
          </div>

          <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl gradient-text">
            Kalender 2026
          </h1>

          <p className="mt-4 text-base text-slate-300 sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Daftar libur nasional dan cuti bersama berdasarkan SKB 3 Menteri dengan{" "}
            <span className="text-sky-400 font-semibold">AI rekomendasi cuti optimal</span>.
            Rencanakan liburan Anda dengan cerdas dan efisien.
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">{HOLIDAYS_2026.length}</div>
              <div className="text-sm text-slate-400 mt-1">Libur Nasional</div>
            </div>
            <div className="h-12 w-px bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sky-400">{JOINT_LEAVE_2026.length}</div>
              <div className="text-sm text-slate-400 mt-1">Cuti Bersama</div>
            </div>
            <div className="h-12 w-px bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{recommendations.length}</div>
              <div className="text-sm text-slate-400 mt-1">Rekomendasi AI</div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {legend.map((item) => (
              <span
                key={item.type}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${typeStyles[item.type]} hover-lift cursor-default`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    item.type === "libur" ? "bg-emerald-400 animate-pulse-glow" : "bg-sky-400 animate-pulse-glow"
                  }`}
                />
                {item.label}
              </span>
            ))}
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="glass-strong rounded-2xl p-2 inline-flex gap-2">
            <button
              onClick={() => setActiveTab("recommendations")}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === "recommendations"
                  ? "bg-gradient-to-r from-sky-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Rekomendasi AI
              </span>
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === "calendar"
                  ? "bg-gradient-to-r from-sky-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Kalender Lengkap
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "recommendations" ? (
          <LeaveRecommendations recommendations={recommendations} />
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {schedules.map((month, index) => (
              <article
                key={month.label}
                className="glass rounded-3xl p-6 hover-lift animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-sky-400"></span>
                  {month.label}
                </h2>
                <p className="text-xs text-slate-400 mb-4">{month.entries.length} hari libur</p>

                <ul className="space-y-3">
                  {month.entries.map((entry, i) => (
                    <li
                      key={entry.key}
                      className="glass-card rounded-2xl px-4 py-3.5 hover-lift transition-all duration-300 cursor-pointer animate-slide-up"
                      style={{ animationDelay: `${(index * 0.05) + (i * 0.02)}s` }}
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
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${typeStyles[entry.type]}`}>
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
        )}

        {/* Footer */}
        <footer className="glass-strong rounded-2xl p-6 text-center text-sm text-slate-300 animate-slide-up">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg className="w-4 h-4 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold text-white">Sumber Data</span>
          </div>
          <p>
            Data diambil dari Surat Keputusan Bersama (SKB) 3 Menteri tentang Hari Libur Nasional dan Cuti Bersama Tahun 2026.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Rekomendasi cuti dihasilkan oleh algoritma AI untuk memaksimalkan efisiensi pengambilan cuti.
          </p>
        </footer>
      </div>
    </main>
  );
}
