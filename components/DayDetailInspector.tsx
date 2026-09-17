"use client";

import type { CalendarDay } from "@/lib/calendar";
import { getCulturalDateInfo } from "@/lib/culturalCalendar";

type DayDetailInspectorProps = {
  dayData: CalendarDay;
  showCulturalOverlay?: boolean;
  isPersonalLeave?: boolean;
  onClose?: () => void;
  onTogglePersonalLeave?: (dateStr: string) => void;
};

const INDONESIAN_DAYS = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
] as const;

const INDONESIAN_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

export default function DayDetailInspector({
  dayData,
  showCulturalOverlay = true,
  isPersonalLeave = false,
  onClose,
  onTogglePersonalLeave,
}: DayDetailInspectorProps) {
  const dateObj = dayData.date;
  const dayName = INDONESIAN_DAYS[dateObj.getDay()];
  const dateNumber = dateObj.getDate();
  const monthName = INDONESIAN_MONTHS[dateObj.getMonth()];
  const yearNumber = dateObj.getFullYear();

  const culturalInfo = getCulturalDateInfo(dateObj);

  return (
    <aside
      aria-label="Detail tanggal yang dipilih"
      className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 sm:p-5 transition-all w-full min-w-0 overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Tanggal & Hari Utama */}
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <h3 className="text-sm sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight break-words">
              {dayName}, {dateNumber} {monthName} {yearNumber}
            </h3>

            {/* Badges Status Hari */}
            {dayData.isHoliday && (
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-medium bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200/80 dark:border-red-800/60">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                Libur Nasional
              </span>
            )}

            {dayData.isCutiBersama && (
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Cuti Bersama
              </span>
            )}

            {isPersonalLeave && (
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Rencana Cuti Anda
              </span>
            )}

            {!dayData.isHoliday && !dayData.isCutiBersama && !isPersonalLeave && (
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                {dayData.isWeekend ? "Akhir Pekan" : "Hari Kerja"}
              </span>
            )}
          </div>

          {/* Keterangan Hari Libur jika ada */}
          {dayData.holidayName ? (
            <p className="text-xs sm:text-sm font-medium text-red-600 dark:text-red-400 pt-0.5 break-words">
              {dayData.holidayName}
            </p>
          ) : (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-0.5">
              {dayData.isWeekend ? "Hari istirahat akhir pekan reguler." : "Hari kerja efektif dan operasional kantor."}
            </p>
          )}
        </div>

        {/* Tombol Tutup Panel */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Tutup detail tanggal"
          >
            <svg className="w-4 h-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Detail Budaya & Informasi Tambahan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
        {/* Penanggalan Hijriah */}
        {showCulturalOverlay && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
            <svg className="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
            <div className="truncate">
              <span className="text-zinc-400 dark:text-zinc-500 block text-[10px]">Kalender Hijriah</span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {culturalInfo.hijriah}
              </span>
            </div>
          </div>
        )}

        {/* Pasaran Jawa */}
        {showCulturalOverlay && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
            <svg className="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
            <div className="truncate">
              <span className="text-zinc-400 dark:text-zinc-500 block text-[10px]">Pasaran Jawa</span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {culturalInfo.pasaran} ({dayName} {culturalInfo.pasaran})
              </span>
            </div>
          </div>
        )}

        {/* Aksi Tambahan Cuti */}
        {onTogglePersonalLeave && (
          <div className="flex items-center sm:col-span-2 lg:col-span-1">
            <button
              type="button"
              onClick={() => onTogglePersonalLeave(dayData.dateString)}
              className={`w-full h-full py-2 px-3 rounded-lg border text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                isPersonalLeave
                  ? "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200"
                  : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{isPersonalLeave ? "Hapus dari Cuti Pribadi" : "Tandai Cuti Pribadi"}</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
