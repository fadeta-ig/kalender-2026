import type { Holiday, SupportedYear } from "@/data/holidays";

export type StaminaStatus = "optimal" | "waspada" | "rawan";

export type WorkStreak = {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  workDaysCount: number;
  calendarDaysCount: number;
  startMonth: string;
  endMonth: string;
};

export type RechargeSuggestion = {
  date: string;          // YYYY-MM-DD
  dayName: string;       // e.g. "Jumat" or "Senin"
  formattedDate: string; // e.g. "24 Juli 2026"
  targetStreakOriginalDays: number;
  newStreakAfterSplit: number;
  description: string;
};

export type BurnoutAnalysisResult = {
  year: SupportedYear;
  staminaStatus: StaminaStatus;
  staminaScore: number; // 0 - 100
  longestStreak: WorkStreak;
  totalWorkDays: number;
  totalRestDays: number;
  workPercentage: number;
  restPercentage: number;
  rechargeSuggestions: RechargeSuggestion[];
};

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

/**
 * Menganalisis garis waktu kalender setahun penuh untuk mendeteksi rentang kerja
 * terpanjang tanpa libur panjang, tingkat keletihan, dan saran hari pemulihan (Recharge Day).
 */
export function analyzeBurnoutRadar(
  year: SupportedYear,
  holidays: Holiday[],
  jointLeave: Holiday[],
  customLeaves: Set<string> = new Set()
): BurnoutAnalysisResult {
  const holidaySet = new Set<string>();
  for (const h of holidays) {
    holidaySet.add(h.date);
  }
  for (const j of jointLeave) {
    holidaySet.add(j.date);
  }

  // Buat array tanggal harian untuk 1 tahun penuh (1 Jan s.d. 31 Des)
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const totalDaysInYear = isLeap ? 366 : 365;

  type DayInfo = {
    date: Date;
    dateStr: string;
    isWeekend: boolean;
    isHolidayOrLeave: boolean;
    isRestDay: boolean; // weekend, holiday, joint leave, or custom leave
  };

  const dayTimeline: DayInfo[] = [];
  const curr = new Date(year, 0, 1);

  for (let i = 0; i < totalDaysInYear; i++) {
    const dateStr = formatDate(curr);
    const dayOfWeek = curr.getDay(); // 0 = Minggu, 6 = Sabtu
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHolidayOrLeave = holidaySet.has(dateStr);
    const isCustomLeave = customLeaves.has(dateStr);
    const isRestDay = isWeekend || isHolidayOrLeave || isCustomLeave;

    dayTimeline.push({
      date: new Date(curr),
      dateStr,
      isWeekend,
      isHolidayOrLeave,
      isRestDay,
    });

    curr.setDate(curr.getDate() + 1);
  }

  let totalWorkDays = 0;
  let totalRestDays = 0;

  for (const d of dayTimeline) {
    if (d.isRestDay) {
      totalRestDays++;
    } else {
      totalWorkDays++;
    }
  }

  // Identifikasi rentang jeda istirahat panjang (periode libur berturut-turut >= 3 hari)
  // Jeda libur panjang inilah yang menyegarkan pikiran (long weekend / libur hari raya)
  const isPartOfLongBreak = new Array(dayTimeline.length).fill(false);
  let restStreakStart = -1;

  for (let i = 0; i <= dayTimeline.length; i++) {
    if (i < dayTimeline.length && dayTimeline[i].isRestDay) {
      if (restStreakStart === -1) {
        restStreakStart = i;
      }
    } else {
      if (restStreakStart !== -1) {
        const streakLen = i - restStreakStart;
        if (streakLen >= 3) {
          for (let k = restStreakStart; k < i; k++) {
            isPartOfLongBreak[k] = true;
          }
        }
        restStreakStart = -1;
      }
    }
  }

  // Temukan rentang kerja terpanjang di antara dua libur panjang
  const streaks: WorkStreak[] = [];
  let currentStreakStart = -1;
  let currentWorkDays = 0;

  for (let i = 0; i <= dayTimeline.length; i++) {
    if (i < dayTimeline.length && !isPartOfLongBreak[i]) {
      if (currentStreakStart === -1) {
        currentStreakStart = i;
        currentWorkDays = 0;
      }
      if (!dayTimeline[i].isRestDay) {
        currentWorkDays++;
      }
    } else {
      if (currentStreakStart !== -1) {
        const endIndex = i - 1;
        const startDate = dayTimeline[currentStreakStart].dateStr;
        const endDate = dayTimeline[endIndex].dateStr;
        const calendarDaysCount = endIndex - currentStreakStart + 1;

        streaks.push({
          startDate,
          endDate,
          workDaysCount: currentWorkDays,
          calendarDaysCount,
          startMonth: MONTH_NAMES[dayTimeline[currentStreakStart].date.getMonth()],
          endMonth: MONTH_NAMES[dayTimeline[endIndex].date.getMonth()],
        });

        currentStreakStart = -1;
        currentWorkDays = 0;
      }
    }
  }

  // Urutkan untuk menemukan rentang kerja terpanjang
  streaks.sort((a, b) => b.workDaysCount - a.workDaysCount);
  const longestStreak: WorkStreak = streaks[0] || {
    startDate: `${year}-01-01`,
    endDate: `${year}-12-31`,
    workDaysCount: totalWorkDays,
    calendarDaysCount: totalDaysInYear,
    startMonth: "Januari",
    endMonth: "Desember",
  };

  // Hitung Skor Stamina Kerja (0 - 100)
  // Benchmark sehat: rentang kerja di antara long weekend tidak melebihi 25 hari kerja
  let staminaScore = 100;
  if (longestStreak.workDaysCount > 45) {
    staminaScore = Math.max(45, Math.round(100 - (longestStreak.workDaysCount - 45) * 1.5 - 20));
  } else if (longestStreak.workDaysCount > 30) {
    staminaScore = Math.max(65, Math.round(100 - (longestStreak.workDaysCount - 30) * 1.2));
  } else {
    staminaScore = Math.min(96, Math.max(80, 100 - longestStreak.workDaysCount / 2));
  }

  let staminaStatus: StaminaStatus = "optimal";
  if (staminaScore < 65 || longestStreak.workDaysCount >= 42) {
    staminaStatus = "rawan";
  } else if (staminaScore < 80 || longestStreak.workDaysCount >= 28) {
    staminaStatus = "waspada";
  }

  // Rancang Rekomendasi Hari Pemulihan (Strategic Recharge Suggestions)
  // Carilah tanggal Jumat atau Senin di sekitar 45% - 55% perjalanan rentang kerja terpanjang
  const rechargeSuggestions: RechargeSuggestion[] = [];
  const streakStartIdx = dayTimeline.findIndex((d) => d.dateStr === longestStreak.startDate);
  const streakEndIdx = dayTimeline.findIndex((d) => d.dateStr === longestStreak.endDate);

  if (streakStartIdx !== -1 && streakEndIdx !== -1 && longestStreak.workDaysCount >= 18) {
    // Cari hari Jumat atau Senin yang bukan libur
    const midIdx = Math.floor((streakStartIdx + streakEndIdx) / 2);
    let chosenIdx = -1;

    // Cari dalam radius 14 hari di sekitar titik tengah
    for (let offset = 0; offset <= 14; offset++) {
      const candidates = [midIdx - offset, midIdx + offset];
      for (const idx of candidates) {
        if (idx >= streakStartIdx && idx <= streakEndIdx) {
          const d = dayTimeline[idx];
          const dow = d.date.getDay();
          // Prioritaskan Jumat (5) atau Senin (1) yang bukan hari libur
          if ((dow === 5 || dow === 1) && !d.isRestDay && !customLeaves.has(d.dateStr)) {
            chosenIdx = idx;
            break;
          }
        }
      }
      if (chosenIdx !== -1) break;
    }

    if (chosenIdx !== -1) {
      const targetDay = dayTimeline[chosenIdx];
      const dowName = DAY_NAMES[targetDay.date.getDay()];
      const dayNum = targetDay.date.getDate();
      const monthName = MONTH_NAMES[targetDay.date.getMonth()];
      const formattedDate = `${dowName}, ${dayNum} ${monthName} ${year}`;
      const splitWorkDays = Math.round(longestStreak.workDaysCount / 2);

      rechargeSuggestions.push({
        date: targetDay.dateStr,
        dayName: dowName,
        formattedDate,
        targetStreakOriginalDays: longestStreak.workDaysCount,
        newStreakAfterSplit: splitWorkDays,
        description: `Mengambil 1 hari cuti di hari ${dowName} ini akan menciptakan libur panjang 3 hari dan memotong rentang kerja panjang ${longestStreak.workDaysCount} hari menjadi dua fase lebih ringan (~${splitWorkDays} hari kerja per fase).`,
      });
    }
  }

  const workPercentage = Math.round((totalWorkDays / totalDaysInYear) * 100);
  const restPercentage = 100 - workPercentage;

  return {
    year,
    staminaStatus,
    staminaScore,
    longestStreak,
    totalWorkDays,
    totalRestDays,
    workPercentage,
    restPercentage,
    rechargeSuggestions,
  };
}
