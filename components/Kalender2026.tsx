"use client";
import React, { useMemo, useState } from "react";

/* …komentar tetap… */

type Holiday = { date: string; name: string; type: "libur" | "cuti-bersama" };

const HOLIDAYS_2026: Holiday[] = [
  { date: "2026-01-01", name: "Tahun Baru 2026 Masehi", type: "libur" },
  { date: "2026-01-16", name: "Isra Mikraj Nabi Muhammad SAW", type: "libur" },
  { date: "2026-02-17", name: "Tahun Baru Imlek 2577 Kongzili", type: "libur" },
  { date: "2026-03-19", name: "Hari Suci Nyepi (Tahun Baru Saka 1948)", type: "libur" },
  { date: "2026-03-21", name: "Idul Fitri 1447 H (Hari 1)", type: "libur" },
  { date: "2026-03-22", name: "Idul Fitri 1447 H (Hari 2)", type: "libur" },
  { date: "2026-04-03", name: "Wafat Yesus Kristus", type: "libur" },
  { date: "2026-04-05", name: "Kebangkitan Yesus Kristus (Paskah)", type: "libur" },
  { date: "2026-05-01", name: "Hari Buruh Internasional", type: "libur" },
  { date: "2026-05-14", name: "Kenaikan Yesus Kristus", type: "libur" },
  { date: "2026-05-27", name: "Idul Adha 1447 H", type: "libur" },
  { date: "2026-05-31", name: "Hari Raya Waisak 2570 BE", type: "libur" },
  { date: "2026-06-01", name: "Hari Lahir Pancasila", type: "libur" },
  { date: "2026-06-16", name: "1 Muharram 1448 H (Tahun Baru Islam)", type: "libur" },
  { date: "2026-08-17", name: "Proklamasi Kemerdekaan", type: "libur" },
  { date: "2026-08-25", name: "Maulid Nabi Muhammad SAW", type: "libur" },
  { date: "2026-12-25", name: "Kelahiran Yesus Kristus (Natal)", type: "libur" },
];

const JOINT_LEAVE_2026: Holiday[] = [
  { date: "2026-02-16", name: "Cuti Bersama Imlek", type: "cuti-bersama" },
  { date: "2026-03-18", name: "Cuti Bersama Nyepi", type: "cuti-bersama" },
  { date: "2026-03-20", name: "Cuti Bersama Idul Fitri", type: "cuti-bersama" },
  { date: "2026-03-23", name: "Cuti Bersama Idul Fitri", type: "cuti-bersama" },
  { date: "2026-03-24", name: "Cuti Bersama Idul Fitri", type: "cuti-bersama" },
  { date: "2026-05-15", name: "Cuti Bersama Kenaikan Isa Almasih", type: "cuti-bersama" },
  { date: "2026-05-28", name: "Cuti Bersama Idul Adha", type: "cuti-bersama" },
  { date: "2026-12-24", name: "Cuti Bersama Natal", type: "cuti-bersama" },
];

/* helpers fmtDate, parseISO, isWeekend sama seperti sebelumnya */

const holidayEntries: [string, Holiday][] = [
  ...HOLIDAYS_2026.map((h): [string, Holiday] => [h.date, h]),
  ...JOINT_LEAVE_2026.map((h): [string, Holiday] => [h.date, h]),
];

const HOLIDAY_MAP = new Map<string, Holiday>(holidayEntries);

/* lanjutkan kode yang lain tanpa perubahan kecuali referensi tipe:
   - ubah any yang berkaitan dengan libur ke tipe Holiday | null
   - misal: const allDays2026: { key: string; date: Date; isWeekend: boolean; holiday: Holiday | null }[] = […]
   - di MonthCard: const hol = HOLIDAY_MAP.get(key) as Holiday | undefined;
*/
