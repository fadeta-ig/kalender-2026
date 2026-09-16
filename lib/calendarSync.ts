import type { Holiday } from "@/data/holidays";

/**
 * Format tanggal ke format iCalendar YYYYMMDD
 */
function toICSDate(dateStr: string): string {
  return dateStr.replace(/-/g, "");
}

/**
 * Mendapatkan tanggal hari berikutnya dalam format YYYYMMDD untuk DTEND (iCal all-day events are exclusive)
 */
function toICSNextDate(dateStr: string): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

/**
 * Timestamp sekarang untuk DTSTAMP
 */
function getNowStamp(): string {
  return new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export type SyncOptions = {
  includeHolidays: boolean;
  includeJointLeave: boolean;
  customLeaveDates?: { date: string; note: string }[];
};

/**
 * Membuat konten teks berformat RFC 5545 iCalendar (.ics)
 */
export function generateICSContent(
  holidays: Holiday[],
  jointLeave: Holiday[],
  year: number,
  options: SyncOptions = { includeHolidays: true, includeJointLeave: true }
): string {
  const now = getNowStamp();
  const events: string[] = [];

  const itemsToInclude: Holiday[] = [];
  if (options.includeHolidays) {
    itemsToInclude.push(...holidays);
  }
  if (options.includeJointLeave) {
    itemsToInclude.push(...jointLeave);
  }

  for (const item of itemsToInclude) {
    const dtStart = toICSDate(item.date);
    const dtEnd = toICSNextDate(item.date);
    const typeLabel = item.type === "libur" ? "Libur Nasional" : "Cuti Bersama";
    const uid = `${dtStart}-${item.type}@kalender-indonesia.id`;

    events.push(
      [
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${now}`,
        `DTSTART;VALUE=DATE:${dtStart}`,
        `DTEND;VALUE=DATE:${dtEnd}`,
        `SUMMARY:${item.name} (${typeLabel})`,
        `DESCRIPTION:Hari ${typeLabel} resmi sesuai Surat Keputusan Bersama (SKB) 3 Menteri Tahun ${year}.`,
        "STATUS:CONFIRMED",
        "TRANSP:TRANSPARENT",
        "END:VEVENT",
      ].join("\r\n")
    );
  }

  // Tambahkan rencana cuti pribadi jika ada
  if (options.customLeaveDates && options.customLeaveDates.length > 0) {
    for (const custom of options.customLeaveDates) {
      const dtStart = toICSDate(custom.date);
      const dtEnd = toICSNextDate(custom.date);
      const uid = `${dtStart}-personal-leave@kalender-indonesia.id`;

      events.push(
        [
          "BEGIN:VEVENT",
          `UID:${uid}`,
          `DTSTAMP:${now}`,
          `DTSTART;VALUE=DATE:${dtStart}`,
          `DTEND;VALUE=DATE:${dtEnd}`,
          `SUMMARY:Cuti Kerja: ${custom.note}`,
          "DESCRIPTION:Rencana cuti tahunan pribadi untuk memaksimalkan libur panjang.",
          "STATUS:CONFIRMED",
          "TRANSP:OPAQUE",
          "END:VEVENT",
        ].join("\r\n")
      );
    }
  }

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kalender Resmi Indonesia//ID",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:Kalender Resmi Indonesia ${year}`,
    "X-WR-TIMEZONE:Asia/Jakarta",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}

/**
 * Memicu unduhan file .ics secara langsung di browser pengguna
 */
export function downloadICSFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Membuat URL intent web Google Calendar untuk menambahkan satu agenda libur secara instan
 */
export function createGoogleCalendarUrl(
  title: string,
  dateStr: string,
  description: string
): string {
  const start = toICSDate(dateStr);
  const end = toICSNextDate(dateStr);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    details: description,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
