import type { Holiday, HolidayType } from "@/data/holidays";

export type CalendarDay = {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  isCutiBersama: boolean;
  holidayName?: string;
  dateString: string;
};

export type CalendarMonth = {
  month: number;
  year: number;
  monthName: string;
  days: CalendarDay[];
};

export type MonthScheduleEntry = {
  key: string;
  name: string;
  type: HolidayType;
  weekday: string;
  dayNumber: string;
};

export type MonthSchedule = {
  label: string;
  monthIndex: number;
  entries: MonthScheduleEntry[];
};

export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Membangun array 12 bulan kalender lengkap dengan padding hari dan penanda hari libur/cuti
 */
export function generateCalendarMonths(
  year: number,
  holidays: Holiday[],
  jointLeave: Holiday[]
): CalendarMonth[] {
  const months: CalendarMonth[] = [];
  const allHolidays = [...holidays, ...jointLeave];
  const monthFormatter = new Intl.DateTimeFormat("id-ID", { month: "long" });

  for (let month = 0; month < 12; month++) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Hari pertama dalam minggu (0 = Minggu, 1 = Senin, dsb.)
    // Standar Indonesia: Senin = 1 s/d Minggu = 7
    let startDayOfWeek = firstDay.getDay();
    startDayOfWeek = startDayOfWeek === 0 ? 7 : startDayOfWeek;

    const days: CalendarDay[] = [];

    // Hari padding dari bulan sebelumnya
    const prevMonthLastDay = new Date(year, month, 0);
    const prevMonthDays = prevMonthLastDay.getDate();
    for (let i = startDayOfWeek - 2; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(year, month - 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isHoliday: false,
        isCutiBersama: false,
        dateString: formatDateString(date),
      });
    }

    // Hari aktif bulan berjalan
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = formatDateString(date);
      const holiday = allHolidays.find((h) => h.date === dateString);

      days.push({
        date,
        day,
        isCurrentMonth: true,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isHoliday: holiday?.type === "libur" || false,
        isCutiBersama: holiday?.type === "cuti-bersama" || false,
        holidayName: holiday?.name,
        dateString,
      });
    }

    // Hari padding bulan berikutnya
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let day = 1; day <= remainingDays; day++) {
        const date = new Date(year, month + 1, day);
        days.push({
          date,
          day,
          isCurrentMonth: false,
          isWeekend: date.getDay() === 0 || date.getDay() === 6,
          isHoliday: false,
          isCutiBersama: false,
          dateString: formatDateString(date),
        });
      }
    }

    months.push({
      month,
      year,
      monthName: monthFormatter.format(firstDay),
      days,
    });
  }

  return months;
}

/**
 * Mengelompokkan hari libur dan cuti bersama berdasarkan bulan untuk list view
 */
export function buildSchedules(
  year: number,
  holidays: Holiday[],
  jointLeave: Holiday[]
): MonthSchedule[] {
  const formatter = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  });
  const weekdayFormatter = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
  });
  const dayFormatter = new Intl.DateTimeFormat("id-ID", { day: "2-digit" });

  const allHolidays = [...holidays, ...jointLeave];
  const byMonth = new Map<number, MonthSchedule>();

  for (const holiday of allHolidays) {
    const date = new Date(holiday.date);
    if (date.getFullYear() !== year) continue;

    const monthIndex = date.getMonth();
    const base = byMonth.get(monthIndex) ?? {
      label: formatter.format(date),
      monthIndex,
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
