"use client";

import type { CalendarMonth, CalendarDay } from "@/lib/calendar";
import { getCulturalDateInfo } from "@/lib/culturalCalendar";
import DayDetailInspector from "./DayDetailInspector";

type FocusedMonthViewProps = {
  monthData: CalendarMonth;
  showCulturalOverlay?: boolean;
  selectedDate?: string | null;
  highlightedPersonalLeaveDates?: Set<string>;
  onSelectDate?: (dateStr: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onBackToOverview: () => void;
  onTogglePersonalLeave?: (dateStr: string) => void;
};

const DAY_LABELS = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
] as const;

export default function FocusedMonthView({
  monthData,
  showCulturalOverlay = false,
  selectedDate,
  highlightedPersonalLeaveDates,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onBackToOverview,
  onTogglePersonalLeave,
}: FocusedMonthViewProps) {
  const todayString = new Date().toISOString().split("T")[0];

  // Ekstrak semua hari libur dan cuti pada bulan ini
  const holidaysInMonth = monthData.days
    .filter((d) => (d.isHoliday || d.isCutiBersama) && d.isCurrentMonth)
    .sort((a, b) => a.dateString.localeCompare(b.dateString));

  const holidayCount = monthData.days.filter((d) => d.isHoliday && d.isCurrentMonth).length;
  const cutiCount = monthData.days.filter((d) => d.isCutiBersama && d.isCurrentMonth).length;

  // Temukan data hari yang sedang dipilih (jika ada di bulan ini)
  const selectedDayData: CalendarDay | undefined = monthData.days.find(
    (d) => d.dateString === selectedDate && d.isCurrentMonth
  );

  return (
    <section className="space-y-5 animate-fade-in">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToOverview}
            className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>12 Bulan</span>
          </button>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
              <span>{monthData.monthName}</span>
              <span className="text-zinc-400 dark:text-zinc-500 font-normal">{monthData.year}</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              <span>{holidayCount} Libur Nasional</span>
              <span>•</span>
              <span>{cutiCount} Cuti Bersama</span>
            </div>
          </div>
        </div>

        {/* Stepper Bulan Sebelumnya & Berikutnya */}
        <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onPrevMonth}
            className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors flex items-center justify-center gap-1.5"
            aria-label="Bulan sebelumnya"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span>Sebelumnya</span>
          </button>

          <button
            type="button"
            onClick={onNextMonth}
            className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors flex items-center justify-center gap-1.5"
            aria-label="Bulan berikutnya"
          >
            <span>Berikutnya</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Spacious Focused Calendar Grid */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 sm:p-5 transition-colors overflow-hidden">
        {/* Day Name Headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center pb-2 border-b border-zinc-100 dark:border-zinc-800">
          {DAY_LABELS.map((day, i) => (
            <div
              key={day}
              className={`text-[11px] sm:text-xs font-semibold ${
                i === 6
                  ? "text-red-600 dark:text-red-400"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.slice(0, 3)}</span>
            </div>
          ))}
        </div>

        {/* Detailed Grid Cells */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {monthData.days.map((dayData, dayIndex) => {
            const isToday = dayData.dateString === todayString;
            const isSelected = dayData.dateString === selectedDate;
            const isPersonalLeave =
              dayData.isCurrentMonth &&
              highlightedPersonalLeaveDates?.has(dayData.dateString);

            const culturalInfo =
              showCulturalOverlay && dayData.isCurrentMonth
                ? getCulturalDateInfo(dayData.date)
                : null;

            let cellBg = "bg-white dark:bg-zinc-900 border-zinc-200/70 dark:border-zinc-800";
            if (!dayData.isCurrentMonth) {
              cellBg = "bg-zinc-50/40 dark:bg-zinc-950/40 border-transparent text-zinc-300 dark:text-zinc-700 pointer-events-none opacity-40";
            } else if (dayData.isHoliday) {
              cellBg = "bg-red-50/70 dark:bg-red-950/40 border-red-200 dark:border-red-900/60";
            } else if (dayData.isCutiBersama) {
              cellBg = "bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60";
            } else if (isPersonalLeave) {
              cellBg = "bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/80";
            } else if (dayData.isWeekend) {
              cellBg = "bg-zinc-50/60 dark:bg-zinc-800/20 border-zinc-200/60 dark:border-zinc-800/50";
            }

            return (
              <button
                key={`${dayData.dateString}-${dayIndex}`}
                type="button"
                disabled={!dayData.isCurrentMonth}
                onClick={() => onSelectDate?.(dayData.dateString)}
                className={`
                  min-h-[58px] sm:min-h-[85px] lg:min-h-[105px] rounded-lg border p-1 sm:p-2
                  flex flex-col justify-between text-left transition-all relative
                  ${cellBg}
                  ${dayData.isCurrentMonth ? "hover:border-zinc-400 dark:hover:border-zinc-600 active:scale-[0.98]" : ""}
                  ${isToday ? "ring-1 ring-zinc-900 dark:ring-zinc-100" : ""}
                  ${isSelected ? "ring-2 ring-zinc-900 dark:ring-zinc-100 shadow-none z-10" : ""}
                `}
                title={dayData.holidayName || `${dayData.day} ${monthData.monthName}`}
              >
                {/* Top Row: Date Number and Cultural Subtext */}
                <div className="flex items-start justify-between gap-1 w-full">
                  <span
                    className={`text-xs sm:text-sm font-semibold leading-tight ${
                      !dayData.isCurrentMonth
                        ? "text-zinc-300 dark:text-zinc-700"
                        : dayData.isHoliday
                        ? "text-red-700 dark:text-red-400"
                        : dayData.isCutiBersama
                        ? "text-blue-700 dark:text-blue-400"
                        : isPersonalLeave
                        ? "text-amber-800 dark:text-amber-300"
                        : dayData.day === 0 || dayData.date.getDay() === 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-zinc-800 dark:text-zinc-200"
                    }`}
                  >
                    {dayData.day}
                  </span>

                  {culturalInfo && (
                    <span className="text-[9px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 font-normal truncate hidden sm:inline">
                      {culturalInfo.combined}
                    </span>
                  )}
                </div>

                {/* Cultural Subtext di Mobile jika aktif */}
                {culturalInfo && (
                  <div className="sm:hidden text-[8px] text-zinc-500 dark:text-zinc-400 truncate leading-tight">
                    {culturalInfo.pasaran}
                  </div>
                )}

                {/* Bottom Badges: Event Title */}
                <div className="w-full space-y-0.5 mt-auto">
                  {dayData.holidayName && (
                    <div
                      className={`text-[9px] sm:text-[10px] font-medium px-1 py-0.5 rounded leading-tight line-clamp-1 sm:line-clamp-2 ${
                        dayData.isHoliday
                          ? "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200"
                      }`}
                    >
                      <span className="sm:hidden">• </span>
                      {dayData.holidayName}
                    </div>
                  )}

                  {isPersonalLeave && (
                    <div className="text-[9px] sm:text-[10px] font-medium px-1 py-0.5 rounded leading-tight bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 truncate">
                      Cuti
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Day Inspector (Tampil saat tanggal disentuh/dipilih) */}
      {selectedDayData && (
        <DayDetailInspector
          dayData={selectedDayData}
          showCulturalOverlay={showCulturalOverlay}
          isPersonalLeave={highlightedPersonalLeaveDates?.has(selectedDayData.dateString)}
          onClose={() => onSelectDate?.("")}
          onTogglePersonalLeave={onTogglePersonalLeave}
        />
      )}

      {/* Monthly Agenda Detail List */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-5 space-y-3">
        <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <svg className="w-4 h-4 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 17.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <span>Daftar Hari Libur & Cuti di Bulan {monthData.monthName}</span>
        </h3>

        {holidaysInMonth.length === 0 ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 py-2">
            Tidak ada hari libur nasional maupun cuti bersama pada bulan {monthData.monthName}.
          </p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {holidaysInMonth.map((holiday) => {
              const dayDate = holiday.date;
              const dayNameFormatter = new Intl.DateTimeFormat("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
              });

              const isLibur = holiday.isHoliday;

              return (
                <div
                  key={holiday.dateString}
                  onClick={() => onSelectDate?.(holiday.dateString)}
                  className="flex items-center justify-between p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer"
                >
                  <div className="space-y-0.5 pr-2">
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                      {dayNameFormatter.format(dayDate)}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      {holiday.holidayName}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded shrink-0 ${
                      isLibur
                        ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border border-red-200/80 dark:border-red-800/60"
                        : "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60"
                    }`}
                  >
                    {isLibur ? "Libur Nasional" : "Cuti Bersama"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
