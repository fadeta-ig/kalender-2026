import type { Holiday, SupportedYear } from "@/data/holidays";

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

function escapeCSVField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

function getQuarter(monthZeroIndexed: number): string {
  if (monthZeroIndexed < 3) return "Q1";
  if (monthZeroIndexed < 6) return "Q2";
  if (monthZeroIndexed < 9) return "Q3";
  return "Q4";
}

/**
 * Menghasilkan data CSV terstruktur khusus untuk diimpor ke Notion Database.
 * Kolom disesuaikan dengan tipe properti bawaan Notion (Title, Date, Select, Checkbox).
 */
export function generateNotionCSV(
  year: SupportedYear,
  holidays: Holiday[],
  jointLeave: Holiday[]
): string {
  const headers = [
    "Nama Agenda",
    "Tanggal Mulai",
    "Tanggal Selesai",
    "Kategori",
    "Hari",
    "Kuartal",
    "Tipe Hari",
    "Ketetapan Regulasi",
  ];

  const rows: string[] = [];
  rows.push(headers.map(escapeCSVField).join(","));

  const allItems: (Holiday & { isJoint: boolean })[] = [
    ...holidays.map((h) => ({ ...h, isJoint: false })),
    ...jointLeave.map((j) => ({ ...j, isJoint: true })),
  ];

  // Urutkan berdasarkan tanggal
  allItems.sort((a, b) => a.date.localeCompare(b.date));

  for (const item of allItems) {
    const d = new Date(item.date);
    const dayOfWeek = DAY_NAMES[d.getDay()];
    const quarter = getQuarter(d.getMonth());
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const category = item.isJoint ? "Cuti Bersama" : "Libur Nasional";
    const dayType = isWeekend ? "Akhir Pekan" : "Hari Kerja";
    const regulation = `SKB 3 Menteri Kalender ${year}`;

    const row = [
      item.name,
      item.date,
      item.date,
      category,
      dayOfWeek,
      quarter,
      dayType,
      regulation,
    ];

    rows.push(row.map(escapeCSVField).join(","));
  }

  return rows.join("\r\n");
}

/**
 * Menghasilkan data CSV universal UTF-8 untuk Google Sheets dan Microsoft Excel.
 * Dilengkapi dengan Byte Order Mark (BOM) agar huruf terbuka tanpa cacat encoding.
 */
export function generateGoogleSheetsCSV(
  year: SupportedYear,
  holidays: Holiday[],
  jointLeave: Holiday[]
): string {
  const csvContent = generateNotionCSV(year, holidays, jointLeave);
  // Tambahkan UTF-8 BOM (\uFEFF) untuk kompatibilitas otomatis di Excel & Sheets
  return `\uFEFF${csvContent}`;
}

/**
 * Menghasilkan tabel format Markdown yang siap di-paste langsung ke Obsidian,
 * Logseq, GitHub, atau dokumen catatan pribadi.
 */
export function generateObsidianMarkdown(
  year: SupportedYear,
  holidays: Holiday[],
  jointLeave: Holiday[]
): string {
  const allItems: (Holiday & { isJoint: boolean })[] = [
    ...holidays.map((h) => ({ ...h, isJoint: false })),
    ...jointLeave.map((j) => ({ ...j, isJoint: true })),
  ];

  allItems.sort((a, b) => a.date.localeCompare(b.date));

  const lines: string[] = [
    `# Jadwal Libur Nasional & Cuti Bersama ${year}`,
    `*Sumber: Ketetapan Resmi SKB 3 Menteri Republik Indonesia*`,
    "",
    "| Tanggal | Hari | Agenda Libur | Kategori | Kuartal |",
    "| :--- | :--- | :--- | :--- | :--- |",
  ];

  for (const item of allItems) {
    const d = new Date(item.date);
    const dayOfWeek = DAY_NAMES[d.getDay()];
    const quarter = getQuarter(d.getMonth());
    const category = item.isJoint ? "Cuti Bersama" : "Libur Nasional";

    lines.push(`| ${item.date} | ${dayOfWeek} | ${item.name} | ${category} | ${quarter} |`);
  }

  lines.push("");
  lines.push(`*Total Agenda: ${holidays.length} Hari Libur Nasional & ${jointLeave.length} Cuti Bersama.*`);

  return lines.join("\n");
}

/**
 * Memicu pengunduhan file teks (CSV atau MD) langsung di peramban pengguna.
 */
export function downloadFile(content: string, filename: string, mimeType: string = "text/csv;charset=utf-8;"): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
