"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { z } from "zod";

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
  weeks: CalendarDay[][];
};

type RangeKey = "Q1" | "Q2" | "Q3" | "Q4" | "FULL";

type PreferenceOption = "monday" | "friday";

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
  preference: PreferenceOption[];
  unavailable: string[];
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
  libur: "bg-amber-200 text-amber-900 border border-amber-400",
  "cuti-bersama": "bg-sky-200 text-sky-900 border border-sky-400",
};

const TYPE_ICON: Record<HolidayType, string> = {
  libur: "🎉",
  "cuti-bersama": "🧩",
};

const WEEKDAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const QUARTER_RANGE: Record<RangeKey, { startMonth: number; endMonth: number; label: string }> = {
  Q1: { startMonth: 0, endMonth: 2, label: "Januari – Maret" },
  Q2: { startMonth: 3, endMonth: 5, label: "April – Juni" },
  Q3: { startMonth: 6, endMonth: 8, label: "Juli – September" },
  Q4: { startMonth: 9, endMonth: 11, label: "Oktober – Desember" },
  FULL: { startMonth: 0, endMonth: 11, label: "Satu Tahun Penuh" },
};

const recommendationSchema = z.object({
  quota: z.number().int().min(1).max(20),
  range: z.enum(["Q1", "Q2", "Q3", "Q4", "FULL"] as const),
  preference: z
    .array(z.enum(["monday", "friday"] as const))
    .refine((value) => value.every((item, index, arr) => arr.indexOf(item) === index), "Preferensi duplikat"),
  unavailable: z
    .array(z.string().regex(/^2026-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, "Gunakan format YYYY-MM-DD"))
    .optional(),
});

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

const motionConfig = {
  initial: { opacity: 0, translateY: 24 },
  whileInView: { opacity: 1, translateY: 0 },
  transition: { duration: 0.3 },
};

const sectionTitleClass = "text-2xl font-semibold text-slate-900 dark:text-slate-100";
const paragraphClass = "text-base text-slate-600 dark:text-slate-300";
const THEME_STORAGE_KEY = "kalender-2026:theme";

const getStoredTheme = (): "light" | "dark" | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch (error) {
    console.warn("Unable to read stored theme preference", error);
    return null;
  }
};

const persistTheme = (value: "light" | "dark" | null) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (value) {
      window.localStorage.setItem(THEME_STORAGE_KEY, value);
    } else {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    }
  } catch (error) {
    console.warn("Unable to persist theme preference", error);
  }
};

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export default function Kalender2026(): JSX.Element {
  const [theme, setTheme] = useState<"light" | "dark">(() => getStoredTheme() ?? getSystemTheme());
  const [isThemeReady, markThemeReady] = useReducer(() => true, false);
  const [typeFilter, setTypeFilter] = useState<HolidayType | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [quota, setQuota] = useState(12);
  const [range, setRange] = useState<RangeKey>("FULL");
  const [preference, setPreference] = useState<PreferenceOption[]>(["friday"]);
  const [unavailableInput, setUnavailableInput] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateIsDark = (matches: boolean) => setIsDark(matches);

    updateIsDark(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => updateIsDark(event.matches);
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handler);

      return () => mediaQuery.removeEventListener("change", handler);
    }

    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (getStoredTheme()) {
        return;
      }

      setTheme(event.matches ? "dark" : "light");
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) {
        return;
      }

      const storedTheme = getStoredTheme();
      if (storedTheme) {
        setTheme(storedTheme);
        return;
      }

      setTheme(getSystemTheme());
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    window.addEventListener("storage", handleStorage);

    markThemeReady();

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }

      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";

      if (typeof window !== "undefined") {
        const systemTheme = getSystemTheme();
        persistTheme(next === systemTheme ? null : next);
      }

      return next;
    });
  };

  const isDarkMode = isThemeReady ? theme === "dark" : false;

  const unavailableDates = useMemo(() => {
    return unavailableInput
      .split(/[\n,]/)
      .map((value) => value.trim())
      .filter(Boolean);
  }, [unavailableInput]);

  const schemaInput = useMemo(
    () => ({ quota, range, preference, unavailable: unavailableDates }),
    [quota, range, preference, unavailableDates]
  );

  const schemaResult = useMemo(() => recommendationSchema.safeParse(schemaInput), [schemaInput]);
  const schemaErrors = useMemo<Record<string, string[]>>(() => {
    if (schemaResult.success) {
      return {};
    }
    return schemaResult.error.formErrors.fieldErrors;
  }, [schemaResult]);

  const unavailableErrorMessages = useMemo(() => {
    return Object.entries(schemaErrors)
      .filter(([key]) => key.startsWith("unavailable"))
      .flatMap(([, messages]) => messages);
  }, [schemaErrors]);

  const recommendations = useMemo(() => {
    if (!schemaResult.success) {
      return [];
    }

    return computeRecommendations({
      quota: schemaResult.data.quota,
      range: schemaResult.data.range,
      preference: schemaResult.data.preference,
      unavailable: schemaResult.data.unavailable ?? [],
    });
  }, [schemaResult]);

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

  const togglePreference = (option: PreferenceOption) => {
    setPreference((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      }
      return [...prev, option];
    });
  };

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

  const baseSectionProps = reduceMotion ? {} : motionConfig;

  return (
    <div className={isDarkMode ? "dark" : undefined}>
      <motion.main
        className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100"
        initial={reduceMotion ? undefined : { opacity: 0 }}
        animate={reduceMotion ? undefined : { opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
          <motion.header
            {...baseSectionProps}
            className="flex flex-col gap-6 rounded-3xl bg-white/80 p-6 shadow-glass backdrop-blur transition hover:shadow-lg dark:bg-slate-900/70"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-300">
                  Kalender Resmi 2026
                </p>
                <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                  Kalender Libur Nasional &amp; Cuti Bersama 2026
                </h1>
                <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300">
                  Satu halaman ringkas untuk melihat kalender penuh 2026, daftar libur resmi, dan rekomendasi cuti pintar
                  agar Anda bisa merencanakan libur panjang sejak awal tahun.
                </p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:scale-[1.01] hover:border-slate-400 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                aria-pressed={isDarkMode}
                >
                {isDarkMode ? "Mode Terang" : "Mode Gelap"}
              </button>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-700 dark:text-slate-200">
              {(["libur", "cuti-bersama"] as const).map((type) => (
                <span
                  key={type}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${TYPE_BADGE[type]} dark:bg-opacity-30 dark:text-inherit`}
                >
                  <span aria-hidden>{TYPE_ICON[type]}</span>
                  {TYPE_LABELS[type]}
                </span>
              ))}
            </div>
          </motion.header>

          <motion.section
            {...baseSectionProps}
            className="flex flex-col gap-6"
            aria-labelledby="kalender-utama-heading"
          >
            <div className="flex flex-col gap-2">
              <h2 id="kalender-utama-heading" className={sectionTitleClass}>
                Kalender 2026
              </h2>
              <p className={paragraphClass}>
                Dua belas bulan ditampilkan dalam grid responsif. Hari kerja, akhir pekan, dan tanggal libur diberi warna
                berbeda untuk memudahkan pemindaian cepat.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {calendarMonths.map((month) => (
                <article
                  key={month.name}
                  className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
                >
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{month.name}</h3>
                  <div className="mt-4 space-y-2">
                    <div className="grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
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

                            const baseClasses = [
                              "flex min-h-[68px] flex-col rounded-2xl border px-2 py-1 text-xs sm:text-sm transition duration-150",
                              day.isCurrentMonth
                                ? "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100"
                                : "border-slate-100 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600",
                            ];

                            if (day.isWeekend) {
                              baseClasses.push("text-rose-600 dark:text-rose-300 font-semibold");
                            }

                            if (isHoliday) {
                              baseClasses.push("bg-amber-100 text-amber-900 dark:bg-amber-400/20 dark:text-amber-200");
                            }

                            if (isJointLeave) {
                              baseClasses.push("bg-sky-100 text-sky-900 dark:bg-sky-400/20 dark:text-sky-200");
                            }

                            return (
                              <div key={day.iso} className={baseClasses.join(" ")}>
                                <span className="text-sm font-semibold">{day.label}</span>
                                <div className="mt-1 space-y-1">
                                  {day.events.map((event) => (
                                    <span
                                      key={`${day.iso}-${event.type}`}
                                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${TYPE_BADGE[event.type]} dark:bg-opacity-30`}
                                    >
                                      {TYPE_LABELS[event.type]}
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
          </motion.section>

          <motion.section
            {...baseSectionProps}
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
                <label className="flex flex-col text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span className="mb-1">Filter jenis</span>
                  <select
                    value={typeFilter}
                    onChange={(event) => setTypeFilter(event.target.value as HolidayType | "all")}
                    className="h-11 min-w-[160px] rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-700 shadow-sm transition duration-150 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value="all">Semua</option>
                    <option value="libur">Libur Nasional</option>
                    <option value="cuti-bersama">Cuti Bersama</option>
                  </select>
                </label>
                <label className="flex flex-col text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span className="mb-1">Cari nama libur</span>
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Contoh: Idul Fitri"
                    className="h-11 min-w-[220px] rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-700 shadow-sm transition duration-150 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </label>
              </div>
            </div>

            <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 md:block">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-100 text-left text-sm font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <tr>
                    <th scope="col" className="px-6 py-4">Tanggal</th>
                    <th scope="col" className="px-6 py-4">Nama</th>
                    <th scope="col" className="px-6 py-4">Jenis</th>
                    <th scope="col" className="px-6 py-4">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm text-slate-700 dark:divide-slate-800 dark:text-slate-200">
                  {filteredHolidays.map((holiday) => (
                    <tr key={holiday.date} className="transition duration-150 hover:bg-slate-50 dark:hover:bg-slate-800/60">
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{formatDate(holiday.date)}</td>
                      <td className="px-6 py-4">{holiday.name}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${TYPE_BADGE[holiday.type]} dark:bg-opacity-30`}>
                          <span aria-hidden>{TYPE_ICON[holiday.type]}</span>
                          {TYPE_LABELS[holiday.type]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{holiday.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 md:hidden">
              {filteredHolidays.map((holiday) => (
                <article
                  key={`${holiday.date}-${holiday.type}`}
                  className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{holiday.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{formatDate(holiday.date)}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${TYPE_BADGE[holiday.type]} dark:bg-opacity-30`}>
                      <span aria-hidden>{TYPE_ICON[holiday.type]}</span>
                      {TYPE_LABELS[holiday.type]}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{holiday.description}</p>
                </article>
              ))}
            </div>
          </motion.section>

          <motion.section
            {...baseSectionProps}
            className="flex flex-col gap-8"
            aria-labelledby="rekomendasi-heading"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 id="rekomendasi-heading" className={sectionTitleClass}>
                  Rekomendasi Cuti AI
                </h2>
                <p className={paragraphClass}>
                  Atur kuota cuti, rentang analisis, dan preferensi jembatan akhir pekan. Mesin rekomendasi akan mencari
                  kombinasi terbaik yang memaksimalkan libur panjang.
                </p>
              </div>
            </div>

            <form
              className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:grid-cols-2"
              aria-describedby="form-error"
            >
              <div className="flex flex-col gap-3">
                <label className="flex flex-col text-sm font-medium text-slate-700 dark:text-slate-200">
                  Kuota cuti tahunan
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={quota}
                    onChange={(event) => setQuota(Number(event.target.value))}
                    className="mt-1 h-11 rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-700 shadow-sm transition duration-150 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </label>
                {schemaErrors.quota && (
                  <p id="form-error" className="text-sm text-rose-600 dark:text-rose-400">
                    {schemaErrors.quota.join(", ")}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <label className="flex flex-col text-sm font-medium text-slate-700 dark:text-slate-200">
                  Rentang analisis
                  <select
                    value={range}
                    onChange={(event) => setRange(event.target.value as RangeKey)}
                    className="mt-1 h-11 rounded-2xl border border-slate-300 bg-white px-3 text-sm text-slate-700 shadow-sm transition duration-150 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {Object.entries(QUARTER_RANGE).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <fieldset className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <legend className="px-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Preferensi jembatan
                </legend>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Pilih hari kerja yang ingin digunakan sebagai jembatan antara libur dan akhir pekan.
                </p>
                <div className="flex flex-wrap gap-3">
                  {(
                    [
                      { label: "Senin", value: "monday" },
                      { label: "Jumat", value: "friday" },
                    ] as const
                  ).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => togglePreference(option.value)}
                      className={`inline-flex min-h-[44px] min-w-[120px] items-center justify-center rounded-2xl border px-4 text-sm font-semibold transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
                        preference.includes(option.value)
                          ? "border-sky-500 bg-sky-100 text-sky-900 dark:border-sky-400 dark:bg-sky-400/20 dark:text-sky-200"
                          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {schemaErrors.preference && (
                  <p className="text-sm text-rose-600 dark:text-rose-400">
                    {schemaErrors.preference.join(", ")}
                  </p>
                )}
              </fieldset>

              <div className="flex flex-col gap-3">
                <label className="flex flex-col text-sm font-medium text-slate-700 dark:text-slate-200">
                  Tanggal tidak tersedia (pisahkan dengan koma atau baris baru)
                  <textarea
                    value={unavailableInput}
                    onChange={(event) => setUnavailableInput(event.target.value)}
                    placeholder="Contoh: 2026-03-30, 2026-06-12"
                    className="mt-1 min-h-[120px] rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition duration-150 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </label>
                {unavailableErrorMessages.length > 0 && (
                  <p className="text-sm text-rose-600 dark:text-rose-400">
                    {unavailableErrorMessages.join(", ")}
                  </p>
                )}
              </div>
            </form>

            <div className="grid gap-4 md:grid-cols-2">
              {schemaResult.success && recommendations.length === 0 && (
                <p className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-6 text-sm text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
                  Tidak ditemukan kombinasi libur panjang untuk parameter yang dipilih. Coba ubah kuota cuti atau hilangkan
                  beberapa tanggal yang tidak tersedia.
                </p>
              )}

              {recommendations.map((item) => {
                const isFavorite = favorites.includes(item.id);
                return (
                  <article
                    key={item.id}
                    className="flex flex-col gap-4 rounded-3xl border border-emerald-300 bg-emerald-100 p-5 text-emerald-900 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:shadow-lg dark:border-emerald-400/60 dark:bg-emerald-400/15 dark:text-emerald-100"
                  >
                    <div>
                      <h3 className="text-lg font-semibold">{formatRangeLabel(item.range.start, item.range.end)}</h3>
                      <p className="mt-1 text-sm font-medium text-emerald-800 dark:text-emerald-200">{item.summary}</p>
                      <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-200/80">{item.reason}</p>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-200">
                          Ambil cuti pada
                        </p>
                        <ul className="mt-1 space-y-2">
                          {item.leaveDates.map((date) => (
                            <li
                              key={date}
                              className="flex items-center justify-between rounded-2xl border border-emerald-300 bg-white/70 px-3 py-2 text-slate-800 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-900/30 dark:text-emerald-100"
                            >
                              <span>{formatWeekdayDate(date)}</span>
                              <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                                Cuti
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {item.highlights.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-200">
                            Ditopang oleh
                          </p>
                          <ul className="mt-1 space-y-1">
                            {item.highlights.map((highlight) => (
                              <li
                                key={highlight}
                                className="rounded-2xl border border-emerald-300 bg-white/60 px-3 py-2 text-slate-800 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-900/30 dark:text-emerald-100"
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
                        className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${
                          isFavorite
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "bg-white text-emerald-700 hover:bg-emerald-200/60 dark:bg-emerald-900/50 dark:text-emerald-200"
                        }`}
                        aria-pressed={isFavorite}
                      >
                        {isFavorite ? "Favorit" : "Tambah ke Favorit"}
                      </button>
                      <button
                        type="button"
                        onClick={() => copyRecommendation(item)}
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                      >
                        Salin Rekomendasi
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </motion.section>

          <motion.section
            {...baseSectionProps}
            className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            Data libur nasional dan cuti bersama diadaptasi dari Surat Keputusan Bersama Tiga Menteri tentang Hari Libur
            Nasional dan Cuti Bersama Tahun 2026.
          </motion.section>
        </div>
      </motion.main>
    </div>
  );
}
