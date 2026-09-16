"use client";

import { useState } from "react";
import type { Holiday } from "@/data/holidays";
import { generateICSContent, downloadICSFile } from "@/lib/calendarSync";

type CalendarSyncModalProps = {
  isOpen: boolean;
  year: number;
  holidays: Holiday[];
  jointLeave: Holiday[];
  customLeaveDates: { date: string; note: string }[];
  onClose: () => void;
};

export default function CalendarSyncModal({
  isOpen,
  year,
  holidays,
  jointLeave,
  customLeaveDates,
  onClose,
}: CalendarSyncModalProps) {
  const [includeHolidays, setIncludeHolidays] = useState(true);
  const [includeJointLeave, setIncludeJointLeave] = useState(true);
  const [includeCustomLeave, setIncludeCustomLeave] = useState(false);

  if (!isOpen) return null;

  const handleDownloadICS = () => {
    const content = generateICSContent(holidays, jointLeave, year, {
      includeHolidays,
      includeJointLeave,
      customLeaveDates: includeCustomLeave ? customLeaveDates : undefined,
    });
    downloadICSFile(`Kalender-Resmi-Indonesia-${year}.ics`, content);
  };

  const handleGoogleCalendarWeb = () => {
    // Memberikan panduan cepat / unduh ics untuk Google Calendar
    handleDownloadICS();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-5 transition-colors shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Sinkronisasi ke Kalender
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
              Simpan seluruh tanggal merah {year} ke Apple Calendar (iPhone/Mac), Google Calendar, atau Outlook dalam 1 klik.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Tutup dialog"
          >
            <svg className="w-4 h-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Options */}
        <div className="space-y-2.5 p-3.5 rounded-lg border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-800/30 text-xs">
          <span className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">
            Pilih konten yang ingin disertakan:
          </span>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeHolidays}
              onChange={(e) => setIncludeHolidays(e.target.checked)}
              className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-0"
            />
            <span className="text-zinc-700 dark:text-zinc-300 font-normal">
              {holidays.length} Hari Libur Nasional Resmi
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeJointLeave}
              onChange={(e) => setIncludeJointLeave(e.target.checked)}
              className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-0"
            />
            <span className="text-zinc-700 dark:text-zinc-300 font-normal">
              {jointLeave.length} Hari Cuti Bersama Resmi
            </span>
          </label>

          {customLeaveDates.length > 0 && (
            <label className="flex items-center gap-2.5 cursor-pointer pt-1 border-t border-zinc-200/60 dark:border-zinc-700/60">
              <input
                type="checkbox"
                checked={includeCustomLeave}
                onChange={(e) => setIncludeCustomLeave(e.target.checked)}
                className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-0"
              />
              <span className="text-zinc-700 dark:text-zinc-300 font-normal">
                Sertakan {customLeaveDates.length} Rencana Cuti Pribadi Saya
              </span>
            </label>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleDownloadICS}
            className="w-full py-2.5 px-4 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-white transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span>Unduh File Kalender Universal (.ICS)</span>
          </button>

          <p className="text-[11px] text-center text-zinc-400 dark:text-zinc-500 font-normal">
            Di iPhone/iPad/Mac, cukup klik file yang diunduh untuk memasukkan semua acara ke kalender ponsel.
          </p>

          <button
            type="button"
            onClick={handleGoogleCalendarWeb}
            className="w-full py-2 px-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700/60 transition-colors flex items-center justify-center gap-2"
          >
            <span>Petunjuk Impor ke Google Calendar (Android / Gmail)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
