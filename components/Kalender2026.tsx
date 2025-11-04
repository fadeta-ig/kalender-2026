"use client";

import { JSX, useCallback, useMemo, useState } from "react";

type HolidayType = "libur" | "cuti-bersama";

type Holiday = {
  date: string;
  name: string;
  type: HolidayType;
  description: string;
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
  monthIndex: number;
  weeks: CalendarDay[][];
};

type RangeKey = "Q1" | "Q2" | "Q3" | "Q4" | "FULL";

type Recommendation = {
  id: string;
  range: { start: string; end: string };
  totalDays: number;
  leaveDates: string[];
  highlights: string[];
  summary: string;
  reason: string;
};

type RecommendationOptions = {
  quota: number;
  range: RangeKey;
  preference: ("monday" | "friday")[];
  unavailable: string[];
};

type RecommendationPreset = {
  id: string;
  label: string;
  description: string;
  options: RecommendationOptions;
};

const YEAR = 2026;

const HOLIDAYS_2026: Holiday[] = [
  {
    date: "2026-01-01",
    name: "Tahun Baru 2026 Masehi",
    type: "libur",
    description: "Awal tahun masehi dengan waktu istirahat nasional.",
  },
  {
    date: "2026-01-16",
    name: "Isra Mikraj Nabi Muhammad SAW",
    type: "libur",
    description: "Memperingati perjalanan spiritual Nabi Muhammad SAW.",
  },
  {
    date: "2026-02-17",
    name: "Tahun Baru Imlek 2577 Kongzili",
    type: "libur",
    description: "Perayaan komunitas Tionghoa menyambut tahun baru Imlek.",
  },
  {
    date: "2026-03-19",
    name: "Hari Suci Nyepi (Tahun Baru Saka 1948)",
    type: "libur",
    description: "Rangkaian Nyepi yang diisi dengan tapa brata penyepian.",
  },
  {
    date: "2026-03-21",
    name: "Idul Fitri 1447 H (Hari 1)",
    type: "libur",
    description: "Hari pertama Idul Fitri setelah bulan Ramadhan.",
  },
  {
    date: "2026-03-22",
    name: "Idul Fitri 1447 H (Hari 2)",
    type: "libur",
    description: "Hari kedua Idul Fitri untuk silaturahmi keluarga.",
  },
  {
    date: "2026-04-03",
    name: "Wafat Yesus Kristus",
    type: "libur",
    description: "Peringatan wafat Yesus Kristus bagi umat Kristiani.",
  },
  {
    date: "2026-04-05",
    name: "Kebangkitan Yesus Kristus (Paskah)",
    type: "libur",
    description: "Perayaan kebangkitan Yesus Kristus di hari Paskah.",
  },
  {
    date: "2026-05-01",
    name: "Hari Buruh Internasional",
    type: "libur",
    description: "Perayaan pekerja dan buruh di seluruh dunia.",
  },
  {
    date: "2026-05-14",
    name: "Kenaikan Yesus Kristus",
    type: "libur",
    description: "Memperingati kenaikan Yesus Kristus ke surga.",
  },
  {
    date: "2026-05-27",
    name: "Idul Adha 1447 H",
    type: "libur",
    description: "Hari raya kurban bagi umat Muslim.",
  },
  {
    date: "2026-05-31",
    name: "Hari Raya Waisak 2570 BE",
    type: "libur",
    description: "Memperingati kelahiran, pencerahan, dan wafat Sang Buddha.",
  },
  {
    date: "2026-06-01",
    name: "Hari Lahir Pancasila",
    type: "libur",
    description: "Memperingati lahirnya dasar negara Indonesia.",
  },
  {
    date: "2026-06-16",
    name: "1 Muharram 1448 H (Tahun Baru Islam)",
    type: "libur",
    description: "Awal tahun baru dalam kalender Hijriah.",
  },
  {
    date: "2026-08-17",
    name: "Proklamasi Kemerdekaan",
    type: "libur",
    description: "Memperingati kemerdekaan Republik Indonesia.",
  },
  {
    date: "2026-08-25",
    name: "Maulid Nabi Muhammad SAW",
    type: "libur",
    description: "Memperingati kelahiran Nabi Muhammad SAW.",
  },
  {
    date: "2026-12-25",
    name: "Kelahiran Yesus Kristus (Natal)",
    type: "libur",
    description: "Perayaan Natal bagi umat Kristiani.",
  },
];

const JOINT_LEAVE_2026: Holiday[] = [
  {
    date: "2026-02-16",
    name: "Cuti Bersama Imlek",
    type: "cuti-bersama",
    description: "Mengoptimalkan libur Imlek dengan cuti bersama nasional.",
  },
  {
    date: "2026-03-18",
    name: "Cuti Bersama Nyepi",
    type: "cuti-bersama",
    description: "Cuti bersama menjelang Hari Suci Nyepi.",
  },
  {
    date: "2026-03-20",
    name: "Cuti Bersama Idul Fitri",
    type: "cuti-bersama",
    description: "Mengawali rangkaian libur Idul Fitri.",
  },
  {
    date: "2026-03-23",
    name: "Cuti Bersama Idul Fitri",
    type: "cuti-bersama",
    description: "Cuti bersama pasca Hari Raya Idul Fitri.",
  },
  {
    date: "2026-03-24",
    name: "Cuti Bersama Idul Fitri",
    type: "cuti-bersama",
    description: "Perpanjangan waktu silaturahmi Idul Fitri.",
  },
  {
    date: "2026-05-15",
    name: "Cuti Bersama Kenaikan Yesus Kristus",
    type: "cuti-bersama",
    description: "Optimalisasi libur Kenaikan Yesus Kristus.",
  },
  {
    date: "2026-05-28",
    name: "Cuti Bersama Idul Adha",
    type: "cuti-bersama",
    description: "Mempermudah mudik dan persiapan kurban.",
  },
  {
    date: "2026-12-24",
    name: "Cuti Bersama Natal",
    type: "cuti-bersama",
    description: "Mengawali perayaan Natal dan tahun baru.",
  },
];

const EVENTS_2026: Holiday[] = [...HOLIDAYS_2026, ...JOINT_LEAVE_2026].sort((a, b) =>
  a.date.localeCompare(b.date)
);

const EVENT_MAP = EVENTS_2026.reduce<Record<string, Holiday[]>>((acc, holiday) => {
  acc[holiday.date] = acc[holiday.date] ? [...acc[holiday.date], holiday] : [holiday];
  return acc;
}, {});

const TYPE_LABELS: Record<HolidayType, string> = {
  libur: "Libur Nasional",
  "cuti-bersama": "Cuti Bersama",
};

const TYPE_BADGE: Record<HolidayType, string> = {
  libur: "border border-sky-200/70 bg-sky-100/70 text-sky-700 shadow-sm shadow-sky-200/60",
  "cuti-bersama": "border border-indigo-200/70 bg-indigo-100/70 text-indigo-700 shadow-sm shadow-indigo-200/60",
};

const TYPE_DOT: Record<HolidayType, string> = {
  libur: "bg-sky-500",
  "cuti-bersama": "bg-indigo-500",
};

const TYPE_ICON: Record<HolidayType, string> = {
  libur: "🎉",
  "cuti-bersama": "🧩",
};

const PREFERENCE_LABELS: Record<"monday" | "friday", string> = {
  monday: "Senin",
  friday: "Jumat",
};

const WEEKDAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const QUARTER_RANGE: Record<RangeKey, { startMonth: number; endMonth: number; label: string }> = {
  Q1: { startMonth: 0, endMonth: 2, label: "Januari – Maret" },
  Q2: { startMonth: 3, endMonth: 5, label: "April – Juni" },
  Q3: { startMonth: 6, endMonth: 8, label: "Juli – September" },
  Q4: { startMonth: 9, endMonth: 11, label: "Oktober – Desember" },
  FULL: { startMonth: 0, endMonth: 11, label: "Satu Tahun Penuh" },
};

const RECOMMENDATION_PRESETS: RecommendationPreset[] = [
  {
    id: "full-friday",
    label: "Satu Tahun • Prioritas Jumat",
    description: "Memaksimalkan libur sepanjang tahun dengan fokus pada jembatan akhir pekan Jumat.",
    options: { quota: 12, range: "FULL", preference: ["friday"], unavailable: [] },
  },
  {
    id: "full-hybrid",
    label: "Satu Tahun • Senin & Jumat",
    description: "Rekomendasi paling fleksibel untuk memanfaatkan hari kejepit Senin dan Jumat.",
    options: { quota: 14, range: "FULL", preference: ["monday", "friday"], unavailable: [] },
  },
  {
    id: "q1-refresh",
    label: "Q1 • Awal Tahun",
    description: "Sorotan libur panjang kuartal awal agar tahun dimulai dengan energi baru.",
    options: { quota: 6, range: "Q1", preference: ["friday"], unavailable: [] },
  },
  {
    id: "q2-midyear",
    label: "Q2 • Tengah Tahun",
    description: "Optimasi libur Idul Adha, Waisak, dan cuti bersama pertengahan tahun.",
    options: { quota: 6, range: "Q2", preference: ["friday"], unavailable: [] },
  },
  {
    id: "q3-energy",
    label: "Q3 • Energi Kemerdekaan",
    description: "Rangkaian libur sekitar Agustus untuk menutup musim panas dengan istimewa.",
    options: { quota: 5, range: "Q3", preference: ["friday"], unavailable: [] },
  },
  {
    id: "q4-holidays",
    label: "Q4 • Akhir Tahun",
    description: "Rencana cuti akhir tahun menjelang Natal dan pergantian tahun.",
    options: { quota: 6, range: "Q4", preference: ["friday"], unavailable: [] },
  },
];

const formatDate = (iso: string, options: Intl.DateTimeFormatOptions = {}): string => {
  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    ...options,
  });

  return formatter.format(new Date(iso));
};

const formatWeekdayDate = (iso: string): string => {
  const formatter = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return formatter.format(new Date(iso));
};

const chunk = <T,>(input: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let index = 0; index < input.length; index += size) {
    result.push(input.slice(index, index + size));
  }
  return result;
};

const buildCalendar = (): CalendarMonth[] => {
  const months: CalendarMonth[] = [];
  const monthFormatter = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  });

  for (let month = 0; month < 12; month += 1) {
    const first = new Date(YEAR, month, 1);
    const start = new Date(first);
    const offset = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - offset);

    const days: CalendarDay[] = [];
    for (let index = 0; index < 42; index += 1) {
      const current = new Date(start);
      current.setDate(start.getDate() + index);
      const iso = current.toISOString().slice(0, 10);
      const weekday = current.getDay();
      days.push({
        iso,
        label: String(current.getDate()),
        isCurrentMonth: current.getMonth() === month,
        isWeekend: weekday === 0 || weekday === 6,
        events: EVENT_MAP[iso] ?? [],
      });
    }

    months.push({
      name: monthFormatter.format(first),
      monthIndex: month,
      weeks: chunk(days, 7),
    });
  }

  return months;
};

const formatRangeLabel = (startIso: string, endIso: string): string => {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const sameMonth = start.getMonth() === end.getMonth();

  if (startIso === endIso) {
    return formatDate(startIso);
  }

  if (sameMonth) {
    return `${start.getDate()}–${formatDate(endIso, { month: "long" })}`;
  }

  return `${formatDate(startIso)} – ${formatDate(endIso)}`;
};

const computeRecommendations = ({
  quota,
  range,
  preference,
  unavailable,
}: RecommendationOptions): Recommendation[] => {
  const { startMonth, endMonth } = QUARTER_RANGE[range];
  const startDate = new Date(YEAR, startMonth, 1);
  const endDate = new Date(YEAR, endMonth + 1, 0);
  const unavailableSet = new Set(unavailable.map((item) => item.trim()).filter(Boolean));

  const results: Recommendation[] = [];
  const seen = new Set<string>();

  for (
    const cursor = new Date(startDate.getTime());
    cursor <= endDate;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    const windowStart = new Date(cursor.getTime());
    const startIso = windowStart.toISOString().slice(0, 10);

    for (let length = 4; length <= 9; length += 1) {
      const windowEnd = new Date(windowStart.getTime());
      windowEnd.setDate(windowStart.getDate() + length - 1);
      const endIso = windowEnd.toISOString().slice(0, 10);

      if (windowEnd > endDate) {
        break;
      }

      let leaveNeeded = 0;
      const leaveDates: string[] = [];
      const highlightNames = new Set<string>();
      let containsOfficialHoliday = false;
      let isValid = true;

      for (
        const day = new Date(windowStart.getTime());
        day <= windowEnd;
        day.setDate(day.getDate() + 1)
      ) {
        const iso = day.toISOString().slice(0, 10);

        if (unavailableSet.has(iso)) {
          isValid = false;
          break;
        }

        const weekday = day.getDay();
        const events = EVENT_MAP[iso] ?? [];

        if (events.length > 0) {
          containsOfficialHoliday = true;
          events.forEach((event) => highlightNames.add(`${event.name} (${TYPE_LABELS[event.type]})`));
          continue;
        }

        if (weekday === 0 || weekday === 6) {
          continue;
        }

        leaveNeeded += 1;
        leaveDates.push(iso);

        if (leaveNeeded > quota) {
          isValid = false;
          break;
        }
      }

      if (!isValid || !containsOfficialHoliday || leaveNeeded === 0) {
        continue;
      }

      const mondayNeeded = preference.includes("monday");
      const fridayNeeded = preference.includes("friday");

      if (
        (mondayNeeded && !leaveDates.some((date) => new Date(date).getDay() === 1)) ||
        (fridayNeeded && !leaveDates.some((date) => new Date(date).getDay() === 5))
      ) {
        continue;
      }

      const id = `${startIso}_${endIso}`;
      if (seen.has(id)) {
        continue;
      }
      seen.add(id);

      const summary = `Ambil ${leaveNeeded} hari cuti untuk mendapatkan ${length} hari libur beruntun.`;
      const reason = highlightNames.size
        ? `Didukung oleh ${Array.from(highlightNames).join(", ")}.`
        : "Memanfaatkan akhir pekan panjang.";

      results.push({
        id,
        range: { start: startIso, end: endIso },
        totalDays: length,
        leaveDates,
        highlights: Array.from(highlightNames),
        summary,
        reason,
      });
    }
  }

  return results
    .sort((a, b) => {
      if (a.leaveDates.length !== b.leaveDates.length) {
        return a.leaveDates.length - b.leaveDates.length;
      }

      if (a.totalDays !== b.totalDays) {
        return b.totalDays - a.totalDays;
      }

      return a.range.start.localeCompare(b.range.start);
    })
    .slice(0, 6);
};

const sectionTitleClass = "text-2xl font-semibold text-slate-800";
const paragraphClass = "text-base text-slate-600";

export default function Kalender2026(): JSX.Element {
  const [typeFilter, setTypeFilter] = useState<HolidayType | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string>(RECOMMENDATION_PRESETS[0].id);
  const [favorites, setFavorites] = useState<string[]>([]);

  const activePreset = useMemo(() => {
    return RECOMMENDATION_PRESETS.find((preset) => preset.id === selectedPreset) ?? RECOMMENDATION_PRESETS[0];
  }, [selectedPreset]);

  const recommendations = useMemo(() => {
    return computeRecommendations(activePreset.options);
  }, [activePreset]);

  const rangeLabel = useMemo(() => {
    return QUARTER_RANGE[activePreset.options.range].label;
  }, [activePreset]);

  const preferenceSummary = useMemo(() => {
    if (activePreset.options.preference.length === 0) {
      return "Tanpa preferensi khusus";
    }

    return activePreset.options.preference.map((item) => PREFERENCE_LABELS[item]).join(" & ");
  }, [activePreset]);

  const calendarMonths = useMemo(() => buildCalendar(), []);
  const filteredHolidays = useMemo(() => {
    return EVENTS_2026.filter((event) => {
      if (typeFilter !== "all" && event.type !== typeFilter) {
        return false;
      }

      if (!searchTerm) {
        return true;
      }

      return event.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [typeFilter, searchTerm]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const copyRecommendation = async (item: Recommendation) => {
    try {
      await navigator.clipboard.writeText(
        `${formatRangeLabel(item.range.start, item.range.end)}\n${item.summary}\n${item.reason}`
      );
      alert("Rekomendasi disalin ke clipboard.");
    } catch (error) {
      console.error(error);
      alert("Gagal menyalin rekomendasi. Salin secara manual.");
    }
  };

  const handleExport = useCallback((target: "calendar" | "recommendations") => {
    if (typeof window === "undefined") {
      return;
    }

    const { body } = document;
    const previousTarget = body.dataset.printTarget ?? "";
    body.dataset.printTarget = target;

    window.requestAnimationFrame(() => {
      window.print();
      window.requestAnimationFrame(() => {
        if (previousTarget) {
          body.dataset.printTarget = previousTarget;
        } else {
          delete body.dataset.printTarget;
        }
      });
    });
  }, []);

  return (
    <main
      className="min-h-screen bg-linear-to-br from-white via-sky-50/80 to-sky-200/70 text-slate-800"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
        <header
          className="flex flex-col gap-6 rounded-4xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-sky-200/50 backdrop-blur-2xl transition hover:-translate-y-1 hover:shadow-2xl"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-600">
                Kalender Resmi 2026
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                Kalender Libur Nasional &amp; Cuti Bersama 2026
              </h1>
              <p className="mt-3 max-w-2xl text-base text-slate-600">
                Satu halaman ringkas untuk melihat kalender penuh 2026, daftar libur resmi, dan rekomendasi cuti pintar agar
                Anda bisa merencanakan libur panjang sejak awal tahun.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-700">
            {(["libur", "cuti-bersama"] as const).map((type) => (
              <span
                key={type}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium backdrop-blur ${TYPE_BADGE[type]}`}
              >
                <span aria-hidden>{TYPE_ICON[type]}</span>
                {TYPE_LABELS[type]}
              </span>
            ))}
          </div>
        </header>

        <section
          id="print-calendar"
          className="flex flex-col gap-6"
          aria-labelledby="kalender-utama-heading"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 id="kalender-utama-heading" className={sectionTitleClass}>
              Kalender 2026
            </h2>
            <button
              type="button"
              onClick={() => handleExport("calendar")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-400/70 bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky-200/60 transition duration-150 hover:bg-sky-600 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-sky-400"
            >
              Ekspor Kalender (PDF)
            </button>
          </div>
          <p className={paragraphClass}>
            Dua belas bulan ditampilkan dalam grid responsif. Hari kerja, akhir pekan, dan tanggal libur diberi aksen warna
            lembut untuk memudahkan pemindaian cepat tanpa menumpuk teks di setiap tanggal.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {calendarMonths.map((month) => (
              <article
                key={month.name}
                className="flex flex-col rounded-[28px] border border-white/60 bg-white/65 p-5 shadow-lg shadow-sky-100/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <h3 className="text-xl font-semibold text-slate-800">{month.name}</h3>
                <div className="mt-4 space-y-2">
                  <div className="grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {WEEKDAYS.map((weekday) => (
                      <span key={weekday}>{weekday}</span>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {month.weeks.map((week, index) => (
                      <div key={`${month.name}-week-${index}`} className="grid grid-cols-7 gap-1">
                        {week.map((day) => {
                          const isHoliday = day.events.some((event) => event.type === "libur");
                          const isJointLeave = day.events.some((event) => event.type === "cuti-bersama");
                          const eventTitle = day.events
                            .map((event) => `${TYPE_LABELS[event.type]} • ${event.name}`)
                            .join("\n");

                          const baseClasses = [
                            "flex min-h-[72px] flex-col rounded-2xl border border-white/60 bg-white/60 px-2 py-1 text-xs shadow-sm shadow-sky-100/40 backdrop-blur transition-colors",
                            day.isCurrentMonth ? "opacity-100" : "opacity-70",
                          ];

                          if (!day.isCurrentMonth) {
                            baseClasses.push("bg-white/40");
                          }

                          if (isHoliday) {
                            baseClasses.push("border-rose-200/80 bg-rose-50/80 shadow-rose-200/70");
                          } else if (isJointLeave) {
                            baseClasses.push("border-indigo-200/80 bg-indigo-50/80 shadow-indigo-200/70");
                          } else if (day.isWeekend) {
                            baseClasses.push("border-rose-100/60 bg-rose-50/50");
                          }

                          const labelClasses = ["text-sm font-semibold"];
                          if (!day.isCurrentMonth) {
                            labelClasses.push("text-slate-400");
                          } else if (isHoliday) {
                            labelClasses.push("text-rose-600");
                          } else if (isJointLeave) {
                            labelClasses.push("text-indigo-600");
                          } else if (day.isWeekend) {
                            labelClasses.push("text-rose-500");
                          } else {
                            labelClasses.push("text-slate-700");
                          }

                          return (
                            <div key={day.iso} className={baseClasses.join(" ")} title={eventTitle || undefined}>
                              <span className={labelClasses.join(" ")}>
                                {day.label}
                              </span>
                              <div className="mt-auto flex flex-wrap items-center gap-1 pt-2">
                                {day.events.map((event) => (
                                  <span
                                    key={`${day.iso}-${event.type}-${event.name}`}
                                    className={`inline-flex h-2.5 w-2.5 items-center justify-center rounded-full shadow-sm shadow-slate-400/30 ${TYPE_DOT[event.type]}`}
                                  >
                                    <span className="sr-only">
                                      {`${TYPE_LABELS[event.type]}: ${event.name}`}
                                    </span>
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
                {(() => {
                  const monthEvents = EVENTS_2026.filter(
                    (event) => new Date(event.date).getMonth() === month.monthIndex
                  );

                  if (monthEvents.length === 0) {
                    return null;
                  }

                  return (
                    <div className="mt-4 rounded-2xl border border-white/60 bg-white/70 p-3 shadow-inner shadow-sky-100/60">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Sorotan Libur Bulan Ini
                      </p>
                      <ul className="mt-2 space-y-2 text-xs">
                        {monthEvents.map((event) => (
                          <li
                            key={`${event.date}-${event.name}`}
                            className="rounded-2xl border border-white/60 bg-white/80 px-3 py-2 text-slate-600 shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-slate-700">
                                  {formatDate(event.date)} · {event.name}
                                </p>
                                <p className="text-[11px] leading-snug text-slate-500">{event.description}</p>
                              </div>
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur ${TYPE_BADGE[event.type]}`}
                              >
                                {TYPE_LABELS[event.type]}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })()}
              </article>
            ))}
          </div>
        </section>

        <section
          className="flex flex-col gap-6"
          aria-labelledby="jadwal-libur-heading"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 id="jadwal-libur-heading" className={sectionTitleClass}>
                Daftar Libur Nasional &amp; Cuti Bersama
              </h2>
              <p className={paragraphClass}>
                Gunakan pencarian dan filter jenis untuk menemukan tanggal libur penting secara cepat. Pada layar kecil,
                tabel otomatis berubah menjadi kartu.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="flex flex-col text-sm font-medium text-slate-700">
                <span className="mb-1">Filter jenis</span>
                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value as HolidayType | "all")}
                  className="h-11 min-w-40 rounded-2xl border border-white/60 bg-white/80 px-3 text-sm text-slate-700 shadow-sm shadow-sky-100/60 backdrop-blur transition duration-150 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                >
                  <option value="all">Semua</option>
                  <option value="libur">Libur Nasional</option>
                  <option value="cuti-bersama">Cuti Bersama</option>
                </select>
              </label>
              <label className="flex flex-col text-sm font-medium text-slate-700">
                <span className="mb-1">Cari nama libur</span>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Contoh: Idul Fitri"
                  className="h-11 min-w-[220px] rounded-2xl border border-white/60 bg-white/80 px-3 text-sm text-slate-700 shadow-sm shadow-sky-100/60 backdrop-blur transition duration-150 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              </label>
            </div>
          </div>

          <div className="hidden overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-lg shadow-sky-100/70 backdrop-blur-xl md:block">
            <table className="min-w-full divide-y divide-sky-100/80">
              <thead className="bg-sky-50/80 text-left text-sm font-semibold uppercase tracking-wide text-slate-600">
                <tr>
                  <th scope="col" className="px-6 py-4">Tanggal</th>
                  <th scope="col" className="px-6 py-4">Nama</th>
                  <th scope="col" className="px-6 py-4">Jenis</th>
                  <th scope="col" className="px-6 py-4">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100/70 text-sm text-slate-700">
                {filteredHolidays.map((holiday) => (
                  <tr key={holiday.date} className="transition duration-150 hover:bg-sky-50/70">
                    <td className="px-6 py-4 font-semibold text-slate-900">{formatDate(holiday.date)}</td>
                    <td className="px-6 py-4">{holiday.name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${TYPE_BADGE[holiday.type]}`}>
                        <span aria-hidden>{TYPE_ICON[holiday.type]}</span>
                        {TYPE_LABELS[holiday.type]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{holiday.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 md:hidden">
            {filteredHolidays.map((holiday) => (
              <article
                key={`${holiday.date}-${holiday.type}`}
                className="rounded-3xl border border-white/60 bg-white/70 p-4 shadow-lg shadow-sky-100/70 backdrop-blur transition duration-150 hover:-translate-y-0.5 hover:shadow-2xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-800">{holiday.name}</h3>
                    <p className="text-sm text-slate-600">{formatDate(holiday.date)}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur ${TYPE_BADGE[holiday.type]}`}>
                    <span aria-hidden>{TYPE_ICON[holiday.type]}</span>
                    {TYPE_LABELS[holiday.type]}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{holiday.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
            id="print-recommendations"
            className="flex flex-col gap-8"
            aria-labelledby="rekomendasi-heading"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 id="rekomendasi-heading" className={sectionTitleClass}>
                  Rekomendasi Cuti AI
                </h2>
                <p className={paragraphClass}>
                  Pilih skenario terbaik melalui dropdown untuk langsung mendapatkan susunan cuti berantai dengan sentuhan
                  kecerdasan buatan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleExport("recommendations")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-indigo-400/70 bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200/60 transition duration-150 hover:bg-indigo-600 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              >
                Ekspor Rekomendasi (PDF)
              </button>
            </div>

            <div className="flex flex-col gap-4 rounded-3xl border border-white/60 bg-white/75 p-6 shadow-lg shadow-sky-100/70 backdrop-blur-xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <label className="flex flex-col text-sm font-medium text-slate-700">
                  <span className="mb-2 text-sm font-semibold text-slate-700">Pilih skenario rekomendasi</span>
                  <select
                    value={selectedPreset}
                    onChange={(event) => setSelectedPreset(event.target.value)}
                    className="h-12 min-w-60 rounded-2xl border border-white/60 bg-white/80 px-3 text-sm text-slate-700 shadow-sm shadow-sky-100/60 transition duration-150 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    {RECOMMENDATION_PRESETS.map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid gap-2 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-inner shadow-sky-100/60">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Kuota Cuti</span>
                    <span className="text-sm font-semibold text-slate-800">{activePreset.options.quota} hari</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Rentang Analisis</span>
                    <span className="text-sm font-semibold text-slate-800">{rangeLabel}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Preferensi</span>
                    <span className="text-sm font-semibold text-slate-800">{preferenceSummary}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600">{activePreset.description}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {recommendations.length === 0 ? (
                <p className="rounded-3xl border border-sky-200/70 bg-sky-50/80 px-4 py-6 text-sm text-sky-800">
                  Belum ditemukan kombinasi libur panjang untuk skenario <strong>{activePreset.label}</strong>. Coba pilih
                  skenario lain untuk melihat alternatif rekomendasi.
                </p>
              ) : (
                recommendations.map((item) => {
                  const isFavorite = favorites.includes(item.id);
                  return (
                    <article
                      key={item.id}
                      className="flex flex-col gap-4 rounded-3xl border border-cyan-200/80 bg-linear-to-br from-white/85 via-sky-50/80 to-cyan-100/80 p-5 text-slate-800 shadow-lg shadow-sky-100/70 transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl backdrop-blur-xl"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">{formatRangeLabel(item.range.start, item.range.end)}</h3>
                        <p className="mt-1 text-sm font-medium text-sky-800">{item.summary}</p>
                        <p className="mt-1 text-sm text-sky-700/90">{item.reason}</p>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">Ambil cuti pada</p>
                          <ul className="mt-1 space-y-2">
                            {item.leaveDates.map((date) => (
                              <li
                                key={date}
                                className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 px-3 py-2 text-slate-700 shadow-sm shadow-sky-100/60"
                              >
                                <span>{formatWeekdayDate(date)}</span>
                                <span className="text-xs font-semibold uppercase tracking-wide text-sky-700">Cuti</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {item.highlights.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">Ditopang oleh</p>
                            <ul className="mt-1 space-y-1">
                              {item.highlights.map((highlight) => (
                                <li
                                  key={highlight}
                                  className="rounded-2xl border border-white/70 bg-white/75 px-3 py-2 text-slate-700 shadow-sm shadow-sky-100/60"
                                >
                                  {highlight}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="mt-auto flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => toggleFavorite(item.id)}
                          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                            isFavorite
                              ? "bg-sky-600 text-white hover:bg-sky-700"
                              : "bg-white/80 text-sky-700 shadow-sm hover:bg-sky-100"
                          }`}
                          aria-pressed={isFavorite}
                        >
                          {isFavorite ? "Favorit" : "Tambah ke Favorit"}
                        </button>
                        <button
                          type="button"
                          onClick={() => copyRecommendation(item)}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-sky-500 px-4 text-sm font-semibold text-white shadow-md shadow-sky-200/60 transition duration-150 hover:bg-sky-600 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                        >
                          Salin Rekomendasi
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
        </section>

        <section
          className="rounded-3xl border border-white/60 bg-white/75 p-6 text-sm text-slate-600 shadow-lg shadow-sky-100/60 backdrop-blur-xl"
        >
          Data libur nasional dan cuti bersama diadaptasi dari Surat Keputusan Bersama Tiga Menteri tentang Hari Libur
          Nasional dan Cuti Bersama Tahun 2026.
        </section>
      </div>
    </main>
  );
}
