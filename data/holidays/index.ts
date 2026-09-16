import { HOLIDAYS_2026 } from "./holidays2026";
import { HOLIDAYS_2027 } from "./holidays2027";
import type { YearHolidayData } from "./types";

export * from "./types";
export { HOLIDAYS_2026 } from "./holidays2026";
export { HOLIDAYS_2027 } from "./holidays2027";

export const SUPPORTED_YEARS = [2026, 2027] as const;
export type SupportedYear = (typeof SUPPORTED_YEARS)[number];

export const CALENDAR_DATA_MAP: Record<SupportedYear, YearHolidayData> = {
  2026: HOLIDAYS_2026,
  2027: HOLIDAYS_2027,
};

export function getCalendarData(year: number): YearHolidayData {
  if (year in CALENDAR_DATA_MAP) {
    return CALENDAR_DATA_MAP[year as SupportedYear];
  }
  // Default to 2027 if out of range, or nearest supported year
  return year >= 2027 ? HOLIDAYS_2027 : HOLIDAYS_2026;
}
