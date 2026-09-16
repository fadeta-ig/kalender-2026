import type { LeaveRecommendation } from "./leaveRecommendation";

export type LeaveStrategy = "longest" | "frequent";

export type SimulatedLeavePlan = {
  quota: number;
  strategy: LeaveStrategy;
  selectedPackages: LeaveRecommendation[];
  totalDaysOff: number;
  leaveDaysUsed: number;
  remainingQuota: number;
  overallEfficiency: number;
  personalLeaveDates: { date: string; note: string }[];
  highlightDateSet: Set<string>; // Tanggal cuti pribadi dalam format YYYY-MM-DD
};

/**
 * Mengecek apakah dua rentang tanggal rekomendasi saling bertabrakan/beririsan
 */
function areRangesOverlapping(recA: LeaveRecommendation, recB: LeaveRecommendation): boolean {
  const startA = new Date(recA.startDate).getTime();
  const endA = new Date(recA.endDate).getTime();
  const startB = new Date(recB.startDate).getTime();
  const endB = new Date(recB.endDate).getTime();

  return startA <= endB && startB <= endA;
}

/**
 * Mengoptimalkan alokasi jatah cuti menggunakan pendekatan dynamic greedy knapsack
 */
export function optimizeLeaveBudget(
  allRecommendations: LeaveRecommendation[],
  quota: number,
  strategy: LeaveStrategy = "longest"
): SimulatedLeavePlan {
  // Salin dan filter rekomendasi yang membutuhkan cuti <= kuota
  const candidates = allRecommendations
    .filter((r) => r.leaveDaysNeeded > 0 && r.leaveDaysNeeded <= quota)
    .sort((a, b) => {
      if (strategy === "longest") {
        // Prioritaskan total hari libur terpanjang, lalu efisiensi
        if (b.totalDays !== a.totalDays) {
          return b.totalDays - a.totalDays;
        }
        return b.efficiency - a.efficiency;
      }
      // "frequent": Prioritaskan efisiensi tertinggi dengan cuti minimal
      if (b.efficiency !== a.efficiency) {
        return b.efficiency - a.efficiency;
      }
      return a.leaveDaysNeeded - b.leaveDaysNeeded;
    });

  const selectedPackages: LeaveRecommendation[] = [];
  let currentUsedQuota = 0;

  for (const candidate of candidates) {
    // Cek apakah sisa kuota mencukupi
    if (currentUsedQuota + candidate.leaveDaysNeeded > quota) {
      continue;
    }

    // Cek apakah bertabrakan dengan paket yang sudah dipilih sebelumnya
    const isOverlapping = selectedPackages.some((selected) =>
      areRangesOverlapping(selected, candidate)
    );

    if (!isOverlapping) {
      selectedPackages.push(candidate);
      currentUsedQuota += candidate.leaveDaysNeeded;
    }
  }

  // Urutkan paket yang terpilih secara kronologis tanggal mulai
  selectedPackages.sort((a, b) => a.startDate.localeCompare(b.startDate));

  const totalDaysOff = selectedPackages.reduce((sum, p) => sum + p.totalDays, 0);
  const remainingQuota = quota - currentUsedQuota;
  const overallEfficiency =
    currentUsedQuota > 0 ? Number((totalDaysOff / currentUsedQuota).toFixed(1)) : 0;

  // Ekstrak semua tanggal yang merupakan "personal-leave"
  const personalLeaveDates: { date: string; note: string }[] = [];
  const highlightDateSet = new Set<string>();

  for (const pkg of selectedPackages) {
    for (const d of pkg.dates) {
      if (d.type === "personal-leave") {
        personalLeaveDates.push({
          date: d.date,
          note: pkg.title,
        });
        highlightDateSet.add(d.date);
      }
    }
  }

  return {
    quota,
    strategy,
    selectedPackages,
    totalDaysOff,
    leaveDaysUsed: currentUsedQuota,
    remainingQuota,
    overallEfficiency,
    personalLeaveDates,
    highlightDateSet,
  };
}
