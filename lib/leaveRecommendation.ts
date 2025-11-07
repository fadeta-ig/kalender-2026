/**
 * AI Engine untuk Rekomendasi Cuti Optimal
 *
 * Algoritma ini menggunakan pendekatan best practice untuk menganalisis:
 * - Pola libur nasional dan cuti bersama
 * - Jarak dengan weekend (Sabtu-Minggu)
 * - Efisiensi cuti (total hari libur / hari cuti yang diambil)
 * - Kontinuitas hari libur untuk long weekend atau extended breaks
 */

export type Holiday = {
  date: string;
  name: string;
  type: "libur" | "cuti-bersama";
};

export type LeaveRecommendation = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  totalDays: number;          // Total hari libur (termasuk weekend)
  leaveDaysNeeded: number;    // Hari cuti yang perlu diambil
  efficiency: number;         // Rasio totalDays / leaveDaysNeeded
  dates: {
    date: string;
    dayName: string;
    type: "weekend" | "holiday" | "joint-leave" | "personal-leave";
    isWorkingDay: boolean;
  }[];
  savings: number;            // Berapa hari cuti yang "dihemat" dengan strategi ini
  score: number;              // Score untuk ranking (higher is better)
};

/**
 * Helper function untuk mengecek apakah tanggal adalah weekend
 */
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}

/**
 * Helper function untuk format tanggal ke YYYY-MM-DD
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Helper function untuk menambah hari ke tanggal
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Helper function untuk mendapatkan nama hari dalam Bahasa Indonesia
 */
function getDayName(date: Date): string {
  const formatter = new Intl.DateTimeFormat("id-ID", { weekday: "long" });
  return formatter.format(date);
}

/**
 * Helper function untuk mendapatkan range tanggal
 */
function getDateRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  let current = new Date(start);

  while (current <= end) {
    dates.push(new Date(current));
    current = addDays(current, 1);
  }

  return dates;
}

/**
 * Helper function untuk mengecek apakah tanggal adalah hari libur
 */
function isHoliday(date: Date, holidays: Holiday[]): Holiday | null {
  const dateStr = formatDate(date);
  return holidays.find(h => h.date === dateStr) || null;
}

/**
 * Fungsi utama untuk menganalisis dan memberikan rekomendasi cuti optimal
 *
 * Strategi:
 * 1. Bridge Strategy - Isi gap antara holiday dan weekend dengan cuti personal
 * 2. Extension Strategy - Extend holiday dengan menambah cuti sebelum/sesudah
 * 3. Cluster Strategy - Gabungkan beberapa holiday yang berdekatan
 */
export function analyzeLeaveOpportunities(
  holidays: Holiday[],
  jointLeave: Holiday[]
): LeaveRecommendation[] {
  const allHolidays = [...holidays, ...jointLeave];
  const recommendations: LeaveRecommendation[] = [];
  const year = 2026;

  // Sort holidays by date
  const sortedHolidays = [...allHolidays].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  // Strategy 1: Analyze individual holidays and nearby opportunities
  sortedHolidays.forEach((holiday, index) => {
    const holidayDate = new Date(holiday.date);

    // Skip if holiday is on weekend (already off)
    if (isWeekend(holidayDate)) return;

    // Look for bridge opportunities (max 3 days gap)
    for (let gapDays = 1; gapDays <= 3; gapDays++) {
      // Check forward bridge
      const nextDate = addDays(holidayDate, gapDays + 1);
      if (nextDate.getFullYear() === year) {
        analyzeBridge(holidayDate, nextDate, allHolidays, recommendations, "forward");
      }

      // Check backward bridge
      const prevDate = addDays(holidayDate, -(gapDays + 1));
      if (prevDate.getFullYear() === year) {
        analyzeBridge(prevDate, holidayDate, allHolidays, recommendations, "backward");
      }
    }
  });

  // Strategy 2: Analyze consecutive holidays (clusters)
  for (let i = 0; i < sortedHolidays.length - 1; i++) {
    const current = new Date(sortedHolidays[i].date);
    const next = new Date(sortedHolidays[i + 1].date);

    const daysBetween = Math.floor((next.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

    // If holidays are within 10 days, analyze as cluster
    if (daysBetween <= 10 && daysBetween > 0) {
      analyzeCluster(current, next, allHolidays, recommendations);
    }
  }

  // Strategy 3: End of year opportunities (Natal - Tahun Baru)
  analyzeYearEndOpportunity(allHolidays, recommendations, year);

  // Remove duplicates and rank by efficiency
  const uniqueRecs = deduplicateRecommendations(recommendations);

  // Calculate scores and sort
  return uniqueRecs
    .map(rec => ({
      ...rec,
      score: calculateScore(rec)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // Return top 10 recommendations
}

/**
 * Analyze bridge opportunities between dates
 */
function analyzeBridge(
  startDate: Date,
  endDate: Date,
  holidays: Holiday[],
  recommendations: LeaveRecommendation[],
  direction: "forward" | "backward"
): void {
  // Extend to include weekends
  let actualStart = new Date(startDate);
  let actualEnd = new Date(endDate);

  // Include weekend before
  while (isWeekend(addDays(actualStart, -1))) {
    actualStart = addDays(actualStart, -1);
  }

  // Include weekend after
  while (isWeekend(addDays(actualEnd, 1))) {
    actualEnd = addDays(actualEnd, 1);
  }

  const dateRange = getDateRange(actualStart, actualEnd);
  const analysis = analyzeDateRange(dateRange, holidays);

  // Only recommend if efficiency is good (at least 2:1 ratio)
  if (analysis.efficiency >= 2 && analysis.leaveDaysNeeded <= 5 && analysis.totalDays >= 5) {
    const holiday = isHoliday(startDate, holidays) || isHoliday(endDate, holidays);
    const title = holiday
      ? `Long Weekend: ${holiday.name}`
      : `Extended Break ${formatDate(actualStart)}`;

    recommendations.push({
      id: `bridge-${formatDate(actualStart)}-${formatDate(actualEnd)}`,
      title,
      description: `Ambil ${analysis.leaveDaysNeeded} hari cuti untuk mendapatkan ${analysis.totalDays} hari libur berturut-turut`,
      startDate: formatDate(actualStart),
      endDate: formatDate(actualEnd),
      totalDays: analysis.totalDays,
      leaveDaysNeeded: analysis.leaveDaysNeeded,
      efficiency: analysis.efficiency,
      dates: analysis.dates,
      savings: analysis.totalDays - analysis.leaveDaysNeeded,
      score: 0 // Will be calculated later
    });
  }
}

/**
 * Analyze cluster opportunities (multiple holidays close together)
 */
function analyzeCluster(
  startDate: Date,
  endDate: Date,
  holidays: Holiday[],
  recommendations: LeaveRecommendation[]
): void {
  // Extend to include weekends
  let actualStart = new Date(startDate);
  let actualEnd = new Date(endDate);

  while (isWeekend(addDays(actualStart, -1))) {
    actualStart = addDays(actualStart, -1);
  }

  while (isWeekend(addDays(actualEnd, 1))) {
    actualEnd = addDays(actualEnd, 1);
  }

  const dateRange = getDateRange(actualStart, actualEnd);
  const analysis = analyzeDateRange(dateRange, holidays);

  // For clusters, we want high total days and good efficiency
  if (analysis.efficiency >= 1.5 && analysis.totalDays >= 7) {
    const startHoliday = isHoliday(startDate, holidays);
    const endHoliday = isHoliday(endDate, holidays);

    const title = startHoliday && endHoliday
      ? `${startHoliday.name} - ${endHoliday.name}`
      : `Extended Holiday Break`;

    recommendations.push({
      id: `cluster-${formatDate(actualStart)}-${formatDate(actualEnd)}`,
      title,
      description: `Manfaatkan ${analysis.totalDays} hari libur dengan hanya ${analysis.leaveDaysNeeded} hari cuti`,
      startDate: formatDate(actualStart),
      endDate: formatDate(actualEnd),
      totalDays: analysis.totalDays,
      leaveDaysNeeded: analysis.leaveDaysNeeded,
      efficiency: analysis.efficiency,
      dates: analysis.dates,
      savings: analysis.totalDays - analysis.leaveDaysNeeded,
      score: 0
    });
  }
}

/**
 * Analyze year-end opportunities (Christmas to New Year)
 */
function analyzeYearEndOpportunity(
  holidays: Holiday[],
  recommendations: LeaveRecommendation[],
  year: number
): void {
  const christmas = holidays.find(h => h.date === `${year}-12-25`);
  if (!christmas) return;

  const christmasDate = new Date(christmas.date);
  const yearEnd = new Date(year, 11, 31); // Dec 31

  let actualStart = new Date(christmasDate);
  while (isWeekend(addDays(actualStart, -1))) {
    actualStart = addDays(actualStart, -1);
  }

  const dateRange = getDateRange(actualStart, yearEnd);
  const analysis = analyzeDateRange(dateRange, holidays);

  if (analysis.leaveDaysNeeded <= 5) {
    recommendations.push({
      id: `year-end-${year}`,
      title: "Libur Akhir Tahun Extended",
      description: `Rayakan akhir tahun dengan ${analysis.totalDays} hari libur menggunakan ${analysis.leaveDaysNeeded} hari cuti`,
      startDate: formatDate(actualStart),
      endDate: formatDate(yearEnd),
      totalDays: analysis.totalDays,
      leaveDaysNeeded: analysis.leaveDaysNeeded,
      efficiency: analysis.efficiency,
      dates: analysis.dates,
      savings: analysis.totalDays - analysis.leaveDaysNeeded,
      score: 0
    });
  }
}

/**
 * Analyze a date range to determine working days, holidays, etc.
 */
function analyzeDateRange(
  dates: Date[],
  holidays: Holiday[]
): {
  totalDays: number;
  leaveDaysNeeded: number;
  efficiency: number;
  dates: LeaveRecommendation["dates"];
} {
  let leaveDaysNeeded = 0;
  const analyzedDates: LeaveRecommendation["dates"] = [];

  dates.forEach(date => {
    const holiday = isHoliday(date, holidays);
    const weekend = isWeekend(date);

    let type: LeaveRecommendation["dates"][0]["type"];
    let isWorkingDay = true;

    if (weekend) {
      type = "weekend";
      isWorkingDay = false;
    } else if (holiday) {
      type = holiday.type === "libur" ? "holiday" : "joint-leave";
      isWorkingDay = false;
    } else {
      type = "personal-leave";
      leaveDaysNeeded++;
      isWorkingDay = true;
    }

    analyzedDates.push({
      date: formatDate(date),
      dayName: getDayName(date),
      type,
      isWorkingDay
    });
  });

  const totalDays = dates.length;
  const efficiency = leaveDaysNeeded > 0 ? totalDays / leaveDaysNeeded : 0;

  return {
    totalDays,
    leaveDaysNeeded,
    efficiency,
    dates: analyzedDates
  };
}

/**
 * Calculate score for ranking recommendations
 * Higher score = better recommendation
 */
function calculateScore(rec: LeaveRecommendation): number {
  let score = 0;

  // Efficiency is the most important factor (weight: 40%)
  score += rec.efficiency * 40;

  // Total days off is valuable (weight: 30%)
  score += (rec.totalDays / 14) * 30; // Normalize to max 14 days

  // Prefer recommendations with fewer leave days needed (weight: 20%)
  score += ((10 - rec.leaveDaysNeeded) / 10) * 20;

  // Savings bonus (weight: 10%)
  score += (rec.savings / 10) * 10;

  return Math.round(score * 100) / 100;
}

/**
 * Remove duplicate recommendations based on date overlap
 */
function deduplicateRecommendations(
  recommendations: LeaveRecommendation[]
): LeaveRecommendation[] {
  const unique: LeaveRecommendation[] = [];
  const seen = new Set<string>();

  recommendations.forEach(rec => {
    const key = `${rec.startDate}-${rec.endDate}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(rec);
    }
  });

  return unique;
}

/**
 * Get quick insights about the best leave opportunities
 */
export function getQuickInsights(recommendations: LeaveRecommendation[]): {
  bestEfficiency: LeaveRecommendation | null;
  longestBreak: LeaveRecommendation | null;
  leastLeaveNeeded: LeaveRecommendation | null;
  totalLeaveDaysOptimal: number;
} {
  if (recommendations.length === 0) {
    return {
      bestEfficiency: null,
      longestBreak: null,
      leastLeaveNeeded: null,
      totalLeaveDaysOptimal: 0
    };
  }

  const bestEfficiency = [...recommendations].sort((a, b) => b.efficiency - a.efficiency)[0];
  const longestBreak = [...recommendations].sort((a, b) => b.totalDays - a.totalDays)[0];
  const leastLeaveNeeded = [...recommendations]
    .filter(r => r.totalDays >= 5)
    .sort((a, b) => a.leaveDaysNeeded - b.leaveDaysNeeded)[0];

  // Calculate optimal total leave days if taking top 3 recommendations
  const top3 = recommendations.slice(0, 3);
  const totalLeaveDaysOptimal = top3.reduce((sum, rec) => sum + rec.leaveDaysNeeded, 0);

  return {
    bestEfficiency,
    longestBreak,
    leastLeaveNeeded: leastLeaveNeeded || recommendations[0],
    totalLeaveDaysOptimal
  };
}
