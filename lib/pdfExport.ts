import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GANDIVA_LOGO_BASE64 } from './gandivaLogo';

export type HolidayType = "libur" | "cuti-bersama";

export type Holiday = {
  date: string;
  name: string;
  type: HolidayType;
};

type CalendarDay = {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  isCutiBersama: boolean;
  holidayName?: string;
  dateString: string;
};

type CalendarMonth = {
  month: number;
  year: number;
  monthName: string;
  days: CalendarDay[];
};

// Standard A4 Landscape in mm
const PAGE_WIDTH = 297;
const PAGE_HEIGHT = 210;
const MARGIN_X = 14;
const MARGIN_Y = 12;

// Curated Executive Color Palette (Tailored Slate, Emerald & Sky)
const PDF_COLORS = {
  bgPage: [255, 255, 255] as [number, number, number],
  bgCard: [255, 255, 255] as [number, number, number],
  bgCardHeader: [248, 250, 252] as [number, number, number], // slate-50
  
  borderSubtle: [226, 232, 240] as [number, number, number], // slate-200
  borderMedium: [203, 213, 225] as [number, number, number], // slate-300
  
  textPrimary: [15, 23, 42] as [number, number, number],     // slate-900
  textSecondary: [71, 85, 105] as [number, number, number],  // slate-600
  textMuted: [148, 163, 184] as [number, number, number],     // slate-400
  
  // Holiday accents
  holidayBg: [236, 253, 245] as [number, number, number],    // emerald-50
  holidayBorder: [167, 243, 208] as [number, number, number],// emerald-200
  holidayText: [4, 120, 87] as [number, number, number],     // emerald-700
  holidaySolid: [16, 185, 129] as [number, number, number],  // emerald-500
  
  // Joint leave accents
  cutiBg: [240, 249, 255] as [number, number, number],       // sky-50
  cutiBorder: [186, 230, 253] as [number, number, number],   // sky-200
  cutiText: [3, 105, 161] as [number, number, number],       // sky-700
  cutiSolid: [14, 165, 233] as [number, number, number],     // sky-500
  
  // Weekend / Sunday
  sundayText: [220, 38, 38] as [number, number, number],     // red-600
  weekendBg: [250, 250, 250] as [number, number, number],    // zinc-50
};

function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function generateCalendarMonths(holidays: Holiday[], jointLeave: Holiday[], year: number): CalendarMonth[] {
  const months: CalendarMonth[] = [];
  const allHolidays = [...holidays, ...jointLeave];
  const monthFormatter = new Intl.DateTimeFormat("id-ID", { month: "long" });

  for (let month = 0; month < 12; month++) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    let startDayOfWeek = firstDay.getDay();
    startDayOfWeek = startDayOfWeek === 0 ? 7 : startDayOfWeek;

    const days: CalendarDay[] = [];

    // Add padding days from previous month
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

    // Add current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = formatDateString(date);
      const holiday = allHolidays.find(h => h.date === dateString);

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

    // Add padding days from next month
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

export function exportCalendarToPDF(holidays: Holiday[], jointLeave: Holiday[], year: number = 2026) {
  // Create PDF with standard A4 landscape orientation
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const calendarMonths = generateCalendarMonths(holidays, jointLeave, year);
  const allHolidays = [...holidays, ...jointLeave];

  calendarMonths.forEach((monthData, pageIndex) => {
    if (pageIndex > 0) {
      doc.addPage('a4', 'landscape');
    }

    // 1. Page Background (Clean Pure White)
    doc.setFillColor(...PDF_COLORS.bgPage);
    doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F');

    // 2. Top Header Section (Executive Brand Header Card)
    const headerY = MARGIN_Y;
    const headerHeight = 22;
    const headerWidth = PAGE_WIDTH - MARGIN_X * 2;

    // Outer Header Box with subtle border
    doc.setFillColor(...PDF_COLORS.bgCard);
    doc.setDrawColor(...PDF_COLORS.borderSubtle);
    doc.setLineWidth(0.35);
    doc.roundedRect(MARGIN_X, headerY, headerWidth, headerHeight, 3, 3, 'FD');

    // Official Gandiva Labs Logo (Vector PNG embedded)
    try {
      doc.addImage(GANDIVA_LOGO_BASE64, 'PNG', MARGIN_X + 4, headerY + 3.5, 15, 15);
    } catch {
      // Fallback mark jika logo gagal dimuat
      doc.setFillColor(...PDF_COLORS.textPrimary);
      doc.roundedRect(MARGIN_X + 4, headerY + 3.5, 15, 15, 2, 2, 'F');
    }

    // Brand Name & Description
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...PDF_COLORS.textPrimary);
    doc.text('GANDIVA LABS', MARGIN_X + 22, headerY + 8.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...PDF_COLORS.textSecondary);
    doc.text('KALENDER RESMI REPUBLIK INDONESIA', MARGIN_X + 22, headerY + 13);
    doc.text(`SKB 3 Menteri No. 1205/2026 • No. 3/2026 • No. 2/2026`, MARGIN_X + 22, headerY + 17);

    // Center Title: Month & Year
    const centerTitleX = PAGE_WIDTH / 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(...PDF_COLORS.textPrimary);
    doc.text(`${monthData.monthName.toUpperCase()} ${monthData.year}`, centerTitleX, headerY + 11, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...PDF_COLORS.textSecondary);
    doc.text(`Tahun ${monthData.year} Masehi`, centerTitleX, headerY + 16.5, { align: 'center' });

    // Header Right Stats Summary Badges
    const holidayCount = monthData.days.filter(d => d.isHoliday && d.isCurrentMonth).length;
    const cutiCount = monthData.days.filter(d => d.isCutiBersama && d.isCurrentMonth).length;

    const badgeRightX = MARGIN_X + headerWidth - 4;
    
    // Libur Nasional Badge
    doc.setFillColor(...PDF_COLORS.holidayBg);
    doc.setDrawColor(...PDF_COLORS.holidayBorder);
    doc.setLineWidth(0.25);
    doc.roundedRect(badgeRightX - 68, headerY + 4, 32, 6.5, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...PDF_COLORS.holidayText);
    doc.text(`${holidayCount} Libur Nasional`, badgeRightX - 52, headerY + 8.3, { align: 'center' });

    // Cuti Bersama Badge
    doc.setFillColor(...PDF_COLORS.cutiBg);
    doc.setDrawColor(...PDF_COLORS.cutiBorder);
    doc.roundedRect(badgeRightX - 32, headerY + 4, 32, 6.5, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PDF_COLORS.cutiText);
    doc.text(`${cutiCount} Cuti Bersama`, badgeRightX - 16, headerY + 8.3, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...PDF_COLORS.textMuted);
    doc.text(`Total: ${holidayCount + cutiCount} Tanggal Bebas Kerja`, badgeRightX, headerY + 16.5, { align: 'right' });

    // 3. Layout Grid & Agenda Dimensions
    const contentStartY = headerY + headerHeight + 5;
    const contentHeight = 152;
    const gridWidth = 158;
    const gap = 7;
    const agendaStartX = MARGIN_X + gridWidth + gap;
    const agendaWidth = PAGE_WIDTH - agendaStartX - MARGIN_X;

    // --- LEFT PANEL: CALENDAR GRID ---
    // Outer Card for Grid
    doc.setFillColor(...PDF_COLORS.bgCard);
    doc.setDrawColor(...PDF_COLORS.borderSubtle);
    doc.setLineWidth(0.35);
    doc.roundedRect(MARGIN_X, contentStartY, gridWidth, contentHeight, 3, 3, 'FD');

    // Day Headers (Sen, Sel, Rab, Kam, Jum, Sab, Min)
    const dayHeaders = [
      { name: "SENIN", isSun: false },
      { name: "SELASA", isSun: false },
      { name: "RABU", isSun: false },
      { name: "KAMIS", isSun: false },
      { name: "JUMAT", isSun: false },
      { name: "SABTU", isSun: false },
      { name: "MINGGU", isSun: true },
    ];

    const cellWidth = gridWidth / 7;
    const headerRowHeight = 9;

    // Header Background Bar
    doc.setFillColor(...PDF_COLORS.bgCardHeader);
    doc.roundedRect(MARGIN_X + 0.3, contentStartY + 0.3, gridWidth - 0.6, headerRowHeight, 2.7, 2.7, 'F');
    doc.setDrawColor(...PDF_COLORS.borderSubtle);
    doc.line(MARGIN_X, contentStartY + headerRowHeight, MARGIN_X + gridWidth, contentStartY + headerRowHeight);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    dayHeaders.forEach((day, colIdx) => {
      const x = MARGIN_X + colIdx * cellWidth;
      if (day.isSun) {
        doc.setTextColor(...PDF_COLORS.sundayText);
      } else {
        doc.setTextColor(...PDF_COLORS.textSecondary);
      }
      doc.text(day.name, x + cellWidth / 2, contentStartY + 6, { align: 'center' });
    });

    // Calculate Week Rows
    const weekCount = Math.ceil(monthData.days.length / 7);
    const gridDaysStartY = contentStartY + headerRowHeight;
    const cellHeight = (contentHeight - headerRowHeight) / weekCount;

    let currentRow = 0;
    let currentCol = 0;

    monthData.days.forEach((dayData) => {
      const cellX = MARGIN_X + currentCol * cellWidth;
      const cellY = gridDaysStartY + currentRow * cellHeight;

      // Cell Background
      if (!dayData.isCurrentMonth) {
        doc.setFillColor(252, 252, 253);
        doc.rect(cellX, cellY, cellWidth, cellHeight, 'F');
      } else if (dayData.isHoliday) {
        doc.setFillColor(...PDF_COLORS.holidayBg);
        doc.rect(cellX, cellY, cellWidth, cellHeight, 'F');
      } else if (dayData.isCutiBersama) {
        doc.setFillColor(...PDF_COLORS.cutiBg);
        doc.rect(cellX, cellY, cellWidth, cellHeight, 'F');
      } else if (dayData.isWeekend) {
        doc.setFillColor(...PDF_COLORS.weekendBg);
        doc.rect(cellX, cellY, cellWidth, cellHeight, 'F');
      } else {
        doc.setFillColor(...PDF_COLORS.bgCard);
        doc.rect(cellX, cellY, cellWidth, cellHeight, 'F');
      }

      // Cell Grid Border (Thin Clean Slate)
      doc.setDrawColor(...PDF_COLORS.borderSubtle);
      doc.setLineWidth(0.18);
      doc.rect(cellX, cellY, cellWidth, cellHeight, 'S');

      // Date Number
      doc.setFont('helvetica', dayData.isHoliday || dayData.isCutiBersama || dayData.isWeekend ? 'bold' : 'normal');
      doc.setFontSize(10.5);

      if (!dayData.isCurrentMonth) {
        doc.setTextColor(...PDF_COLORS.textMuted);
      } else if (dayData.isHoliday) {
        doc.setTextColor(...PDF_COLORS.holidayText);
      } else if (dayData.isCutiBersama) {
        doc.setTextColor(...PDF_COLORS.cutiText);
      } else if (dayData.date.getDay() === 0) {
        doc.setTextColor(...PDF_COLORS.sundayText);
      } else {
        doc.setTextColor(...PDF_COLORS.textPrimary);
      }

      doc.text(String(dayData.day), cellX + 3.5, cellY + 6.5);

      // Holiday / Cuti Pill Tag inside cell (Anti-Bocor: Truncated safely)
      if (dayData.isCurrentMonth && (dayData.isHoliday || dayData.isCutiBersama)) {
        const isHoli = dayData.isHoliday;
        const tagY = cellY + cellHeight - 6.5;
        const tagWidth = cellWidth - 4;
        const tagHeight = 4.8;

        doc.setFillColor(isHoli ? PDF_COLORS.holidaySolid[0] : PDF_COLORS.cutiSolid[0],
                          isHoli ? PDF_COLORS.holidaySolid[1] : PDF_COLORS.cutiSolid[1],
                          isHoli ? PDF_COLORS.holidaySolid[2] : PDF_COLORS.cutiSolid[2]);
        doc.roundedRect(cellX + 2, tagY, tagWidth, tagHeight, 1.2, 1.2, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.5);
        doc.setTextColor(255, 255, 255);
        
        // Truncate name to fit tag width
        const rawName = dayData.holidayName || (isHoli ? 'Libur Nasional' : 'Cuti Bersama');
        const shortName = rawName.length > 14 ? rawName.slice(0, 13) + '..' : rawName;
        doc.text(shortName, cellX + 2 + tagWidth / 2, tagY + 3.4, { align: 'center' });
      }

      currentCol++;
      if (currentCol === 7) {
        currentCol = 0;
        currentRow++;
      }
    });

    // --- RIGHT PANEL: AGENDA LIBUR RESMI ---
    // Outer Card for Agenda Table
    doc.setFillColor(...PDF_COLORS.bgCard);
    doc.setDrawColor(...PDF_COLORS.borderSubtle);
    doc.setLineWidth(0.35);
    doc.roundedRect(agendaStartX, contentStartY, agendaWidth, contentHeight, 3, 3, 'FD');

    // Agenda Header Banner
    const agendaHeaderHeight = 12;
    doc.setFillColor(...PDF_COLORS.bgCardHeader);
    doc.roundedRect(agendaStartX + 0.3, contentStartY + 0.3, agendaWidth - 0.6, agendaHeaderHeight, 2.7, 2.7, 'F');
    doc.setDrawColor(...PDF_COLORS.borderSubtle);
    doc.line(agendaStartX, contentStartY + agendaHeaderHeight, agendaStartX + agendaWidth, contentStartY + agendaHeaderHeight);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...PDF_COLORS.textPrimary);
    doc.text('AGENDA LIBUR & CUTI BERSAMA', agendaStartX + 4, contentStartY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...PDF_COLORS.textSecondary);
    doc.text('Rincian ketetapan tanggal merah resmi sepanjang bulan ini', agendaStartX + 4, contentStartY + 9.5);

    // Get holidays for this specific month
    const monthHolidays = allHolidays.filter(h => {
      const d = new Date(h.date);
      return d.getMonth() === monthData.month && d.getFullYear() === year;
    }).sort((a, b) => a.date.localeCompare(b.date));

    if (monthHolidays.length > 0) {
      const tableData = monthHolidays.map(item => {
        const d = new Date(item.date);
        const dayNum = String(d.getDate()).padStart(2, '0');
        const weekday = new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(d);
        return [
          dayNum,
          weekday,
          item.name,
          item.type === 'libur' ? 'Libur' : 'Cuti',
        ];
      });

      // Render Clean Table with autoTable (Strictly Contained, Anti-Bocor)
      autoTable(doc, {
        startY: contentStartY + agendaHeaderHeight + 2,
        margin: { left: agendaStartX + 2, right: MARGIN_X + 2 },
        tableWidth: agendaWidth - 4,
        head: [['Tgl', 'Hari', 'Keterangan Peringatan Resmi', 'Kategori']],
        body: tableData,
        theme: 'plain',
        styles: {
          font: 'helvetica',
          fontSize: 7.5,
          cellPadding: { top: 2.5, bottom: 2.5, left: 2, right: 2 },
          textColor: [PDF_COLORS.textPrimary[0], PDF_COLORS.textPrimary[1], PDF_COLORS.textPrimary[2]],
          overflow: 'linebreak',
          lineColor: [PDF_COLORS.borderSubtle[0], PDF_COLORS.borderSubtle[1], PDF_COLORS.borderSubtle[2]],
          lineWidth: 0.15,
        },
        headStyles: {
          fillColor: [PDF_COLORS.bgCardHeader[0], PDF_COLORS.bgCardHeader[1], PDF_COLORS.bgCardHeader[2]],
          textColor: [PDF_COLORS.textSecondary[0], PDF_COLORS.textSecondary[1], PDF_COLORS.textSecondary[2]],
          fontStyle: 'bold',
          fontSize: 7,
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center', fontStyle: 'bold' },
          1: { cellWidth: 14, halign: 'center', textColor: [PDF_COLORS.textSecondary[0], PDF_COLORS.textSecondary[1], PDF_COLORS.textSecondary[2]] },
          2: { cellWidth: agendaWidth - 4 - 10 - 14 - 18, fontStyle: 'normal' }, // dynamic flex width
          3: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
        },
        didParseCell: function(data) {
          if (data.section === 'body' && data.column.index === 3) {
            const raw = data.cell.raw;
            if (raw === 'Libur') {
              data.cell.styles.fillColor = [PDF_COLORS.holidayBg[0], PDF_COLORS.holidayBg[1], PDF_COLORS.holidayBg[2]];
              data.cell.styles.textColor = [PDF_COLORS.holidayText[0], PDF_COLORS.holidayText[1], PDF_COLORS.holidayText[2]];
            } else if (raw === 'Cuti') {
              data.cell.styles.fillColor = [PDF_COLORS.cutiBg[0], PDF_COLORS.cutiBg[1], PDF_COLORS.cutiBg[2]];
              data.cell.styles.textColor = [PDF_COLORS.cutiText[0], PDF_COLORS.cutiText[1], PDF_COLORS.cutiText[2]];
            }
          }
        },
      });
    } else {
      // Empty State for Months with 0 Holidays
      const emptyY = contentStartY + agendaHeaderHeight + 24;
      doc.setFillColor(...PDF_COLORS.bgCardHeader);
      doc.setDrawColor(...PDF_COLORS.borderSubtle);
      doc.setLineWidth(0.2);
      doc.roundedRect(agendaStartX + 6, emptyY, agendaWidth - 12, 28, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...PDF_COLORS.textPrimary);
      doc.text('Tidak Ada Hari Libur Nasional / Cuti Bersama', agendaStartX + agendaWidth / 2, emptyY + 11, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...PDF_COLORS.textSecondary);
      doc.text('Seluruh hari kerja berjalan efektif sesuai kalender standar.', agendaStartX + agendaWidth / 2, emptyY + 18, { align: 'center' });
    }

    // 4. Bottom Page Footer
    const footerY = PAGE_HEIGHT - MARGIN_Y + 4;
    doc.setDrawColor(...PDF_COLORS.borderSubtle);
    doc.setLineWidth(0.25);
    doc.line(MARGIN_X, footerY - 4.5, PAGE_WIDTH - MARGIN_X, footerY - 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(...PDF_COLORS.textMuted);

    // Left Footer
    doc.text(`© ${year} Gandiva Labs • kalender.gandivalabs.my.id`, MARGIN_X, footerY);

    // Center Footer
    doc.text(`Ketetapan Resmi SKB 3 Menteri RI (Kemenag, Kemenaker, KemenPAN-RB)`, PAGE_WIDTH / 2, footerY, { align: 'center' });

    // Right Footer: Page counter
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PDF_COLORS.textSecondary);
    doc.text(`Halaman ${pageIndex + 1} dari 12`, PAGE_WIDTH - MARGIN_X, footerY, { align: 'right' });
  });

  // Save the PDF
  doc.save(`Kalender-${year}-Indonesia-GandivaLabs.pdf`);
}
