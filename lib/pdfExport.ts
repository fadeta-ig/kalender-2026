import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type HolidayType = "libur" | "cuti-bersama";

type Holiday = {
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

// B5 Landscape dimensions in mm
const PAGE_WIDTH = 250;
const PAGE_HEIGHT = 176;
const MARGIN = 12;

// High Contrast Colors for Glass Morphism
const COLORS = {
  // Glass layers with opacity
  glassLight: { r: 255, g: 255, b: 255, a: 0.95 }, // Very light white glass
  glassMid: { r: 248, g: 250, b: 252, a: 0.85 },
  glassDark: { r: 241, g: 245, b: 249, a: 0.9 },

  // Gradients for depth
  gradientTop: { r: 14, g: 165, b: 233, a: 0.15 }, // sky-500
  gradientBottom: { r: 139, g: 92, b: 246, a: 0.15 }, // purple-500

  // High contrast text
  textDark: { r: 15, g: 23, b: 42 }, // slate-900 - very dark for readability
  textMedium: { r: 51, g: 65, b: 85 }, // slate-700
  textLight: { r: 255, g: 255, b: 255 }, // white for dark backgrounds

  // Holiday colors - high contrast
  holidayBg: { r: 16, g: 185, b: 129, a: 0.25 }, // emerald with higher opacity
  holidayText: { r: 5, g: 150, b: 105 }, // emerald-700 dark
  holidayGlow: { r: 16, g: 185, b: 129, a: 0.4 },

  cutiaBg: { r: 14, g: 165, b: 233, a: 0.25 }, // sky with higher opacity
  cutiaText: { r: 3, g: 105, b: 161 }, // sky-800 dark
  cutiaGlow: { r: 14, g: 165, b: 233, a: 0.4 },

  // Glass borders and highlights
  borderGlass: { r: 255, g: 255, b: 255, a: 0.6 },
  borderDark: { r: 203, g: 213, b: 225 }, // slate-300
  shadow: { r: 15, g: 23, b: 42, a: 0.1 },
  highlight: { r: 255, g: 255, b: 255, a: 0.8 },
};

// Helper: Draw 3D glass morphism card with depth
function drawGlassCard(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  options: {
    shadowDepth?: number;
    glowColor?: { r: number; g: number; b: number; a?: number };
    borderThickness?: number;
  } = {}
) {
  const { shadowDepth = 2, glowColor, borderThickness = 0.5 } = options;

  // Shadow layer (bottom) for 3D depth
  doc.setFillColor(COLORS.shadow.r, COLORS.shadow.g, COLORS.shadow.b);
  doc.setGState(new doc.GState({ opacity: COLORS.shadow.a || 0.1 }));
  doc.roundedRect(x + shadowDepth, y + shadowDepth, width, height, 3, 3, 'F');

  // Outer glow if specified
  if (glowColor) {
    doc.setFillColor(glowColor.r, glowColor.g, glowColor.b);
    doc.setGState(new doc.GState({ opacity: glowColor.a || 0.3 }));
    doc.roundedRect(x - 1, y - 1, width + 2, height + 2, 3.5, 3.5, 'F');
  }

  // Main glass layer (semi-transparent white)
  doc.setFillColor(COLORS.glassLight.r, COLORS.glassLight.g, COLORS.glassLight.b);
  doc.setGState(new doc.GState({ opacity: COLORS.glassLight.a || 0.95 }));
  doc.roundedRect(x, y, width, height, 3, 3, 'F');

  // Gradient overlay for depth (top to bottom)
  const gradientSteps = 8;
  for (let i = 0; i < gradientSteps; i++) {
    const stepHeight = height / gradientSteps;
    const stepY = y + i * stepHeight;
    const opacity = 0.08 - (i / gradientSteps) * 0.05;

    doc.setFillColor(COLORS.gradientTop.r, COLORS.gradientTop.g, COLORS.gradientTop.b);
    doc.setGState(new doc.GState({ opacity }));

    if (i === 0) {
      doc.rect(x, stepY, width, stepHeight, 'F');
    } else if (i === gradientSteps - 1) {
      doc.rect(x, stepY, width, stepHeight, 'F');
    } else {
      doc.rect(x, stepY, width, stepHeight, 'F');
    }
  }

  // Glass highlight (top-left to simulate light reflection)
  doc.setFillColor(COLORS.highlight.r, COLORS.highlight.g, COLORS.highlight.b);
  doc.setGState(new doc.GState({ opacity: COLORS.highlight.a || 0.8 }));
  doc.roundedRect(x, y, width, height * 0.4, 3, 3, 'F');

  // Blur simulation with multiple semi-transparent layers
  for (let i = 0; i < 3; i++) {
    doc.setFillColor(255, 255, 255);
    doc.setGState(new doc.GState({ opacity: 0.15 - i * 0.05 }));
    doc.roundedRect(x + i * 0.3, y + i * 0.3, width - i * 0.6, height - i * 0.6, 3 - i * 0.5, 3 - i * 0.5, 'F');
  }

  // Glass border (white highlight)
  doc.setGState(new doc.GState({ opacity: COLORS.borderGlass.a || 0.6 }));
  doc.setDrawColor(COLORS.borderGlass.r, COLORS.borderGlass.g, COLORS.borderGlass.b);
  doc.setLineWidth(borderThickness * 1.5);
  doc.roundedRect(x, y, width, height, 3, 3, 'S');

  // Inner border (darker) for definition
  doc.setGState(new doc.GState({ opacity: 1 }));
  doc.setDrawColor(COLORS.borderDark.r, COLORS.borderDark.g, COLORS.borderDark.b);
  doc.setLineWidth(borderThickness);
  doc.roundedRect(x + 0.5, y + 0.5, width - 1, height - 1, 2.5, 2.5, 'S');

  // Reset opacity
  doc.setGState(new doc.GState({ opacity: 1 }));
}

// Helper: Draw frosted glass background
function drawFrostedBackground(doc: jsPDF) {
  // Base gradient background
  const steps = 20;
  for (let i = 0; i < steps; i++) {
    const y = (PAGE_HEIGHT / steps) * i;
    const heightStep = PAGE_HEIGHT / steps;

    // Interpolate between two gradient colors
    const ratio = i / steps;
    const r = Math.round(COLORS.gradientTop.r + (COLORS.gradientBottom.r - COLORS.gradientTop.r) * ratio);
    const g = Math.round(COLORS.gradientTop.g + (COLORS.gradientBottom.g - COLORS.gradientTop.g) * ratio);
    const b = Math.round(COLORS.gradientTop.b + (COLORS.gradientBottom.b - COLORS.gradientTop.b) * ratio);

    doc.setFillColor(r, g, b);
    doc.setGState(new doc.GState({ opacity: 0.12 }));
    doc.rect(0, y, PAGE_WIDTH, heightStep, 'F');
  }

  // Frosted glass texture layers
  doc.setFillColor(255, 255, 255);
  doc.setGState(new doc.GState({ opacity: 0.7 }));
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F');

  // Decorative glass orbs with blur
  const orbs = [
    { x: PAGE_WIDTH - 40, y: 35, r: 45, color: COLORS.gradientTop },
    { x: 35, y: PAGE_HEIGHT - 35, r: 40, color: COLORS.gradientBottom },
    { x: PAGE_WIDTH / 2, y: 20, r: 30, color: { ...COLORS.gradientTop, a: 0.1 } },
  ];

  orbs.forEach(orb => {
    // Multiple layers for blur effect
    for (let i = 0; i < 5; i++) {
      const radius = orb.r + i * 3;
      const opacity = (orb.color.a || 0.15) * (1 - i * 0.15);

      doc.setFillColor(orb.color.r, orb.color.g, orb.color.b);
      doc.setGState(new doc.GState({ opacity }));
      doc.circle(orb.x, orb.y, radius, 'F');
    }
  });

  // Reset opacity
  doc.setGState(new doc.GState({ opacity: 1 }));
}

function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function generateCalendarMonths(holidays: Holiday[], jointLeave: Holiday[]): CalendarMonth[] {
  const year = 2026;
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

export function exportCalendarToPDF(holidays: Holiday[], jointLeave: Holiday[]) {
  // Create PDF with B5 landscape orientation
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [PAGE_HEIGHT, PAGE_WIDTH]
  });

  const calendarMonths = generateCalendarMonths(holidays, jointLeave);
  const allHolidays = [...holidays, ...jointLeave];

  calendarMonths.forEach((monthData, index) => {
    if (index > 0) {
      doc.addPage();
    }

    // Draw frosted glass background with depth
    drawFrostedBackground(doc);

    // Header section with glass card
    const headerY = MARGIN;
    const headerHeight = 20;

    // Draw glass card for header
    drawGlassCard(doc, MARGIN, headerY, PAGE_WIDTH - MARGIN * 2, headerHeight, {
      shadowDepth: 3,
      borderThickness: 0.6,
    });

    // Month and year title - HIGH CONTRAST
    doc.setFontSize(24);
    doc.setTextColor(COLORS.textDark.r, COLORS.textDark.g, COLORS.textDark.b);
    doc.setFont('helvetica', 'bold');
    doc.text(`${monthData.monthName} ${monthData.year}`, MARGIN + 6, headerY + 10);

    // Subtitle with stats - HIGH CONTRAST
    const holidayCount = monthData.days.filter(d => d.isHoliday && d.isCurrentMonth).length;
    const cutiCount = monthData.days.filter(d => d.isCutiBersama && d.isCurrentMonth).length;
    doc.setFontSize(9);
    doc.setTextColor(COLORS.textMedium.r, COLORS.textMedium.g, COLORS.textMedium.b);
    doc.setFont('helvetica', 'bold');
    doc.text(`${holidayCount} Libur Nasional  •  ${cutiCount} Cuti Bersama`, MARGIN + 6, headerY + 16);

    // Calendar Grid
    const calendarStartY = headerY + headerHeight + 6;
    const calendarWidth = 140;
    const cellWidth = calendarWidth / 7;
    const cellHeight = 10;
    const calendarCardPadding = 4;

    // Calculate total calendar height
    const weekCount = Math.ceil(monthData.days.length / 7);
    const calendarHeight = 8 + weekCount * cellHeight + calendarCardPadding * 2;

    // Draw glass card for calendar grid
    drawGlassCard(doc, MARGIN, calendarStartY - calendarCardPadding, calendarWidth + calendarCardPadding * 2, calendarHeight, {
      shadowDepth: 2.5,
      borderThickness: 0.5,
    });

    // Day headers - HIGH CONTRAST
    const dayHeaders = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.textDark.r, COLORS.textDark.g, COLORS.textDark.b);

    dayHeaders.forEach((day, i) => {
      const x = MARGIN + calendarCardPadding + i * cellWidth;
      doc.text(day, x + cellWidth / 2, calendarStartY + 4, { align: 'center' });
    });

    // Calendar days
    let currentRow = 0;
    let currentCol = 0;
    const gridStartY = calendarStartY + 7;

    monthData.days.forEach((dayData) => {
      const x = MARGIN + calendarCardPadding + currentCol * cellWidth;
      const y = gridStartY + currentRow * cellHeight;

      // Cell background with glass effect for holidays
      if (dayData.isCurrentMonth) {
        if (dayData.isHoliday) {
          // Holiday glass card with glow
          doc.setFillColor(COLORS.holidayBg.r, COLORS.holidayBg.g, COLORS.holidayBg.b);
          doc.setGState(new doc.GState({ opacity: COLORS.holidayBg.a }));
          doc.roundedRect(x + 0.5, y + 0.5, cellWidth - 1, cellHeight - 1, 1.5, 1.5, 'F');

          // Glow effect
          doc.setFillColor(COLORS.holidayGlow.r, COLORS.holidayGlow.g, COLORS.holidayGlow.b);
          doc.setGState(new doc.GState({ opacity: COLORS.holidayGlow.a }));
          doc.roundedRect(x, y, cellWidth, cellHeight, 2, 2, 'F');

          doc.setGState(new doc.GState({ opacity: 1 }));
        } else if (dayData.isCutiBersama) {
          // Cuti glass card with glow
          doc.setFillColor(COLORS.cutiaBg.r, COLORS.cutiaBg.g, COLORS.cutiaBg.b);
          doc.setGState(new doc.GState({ opacity: COLORS.cutiaBg.a }));
          doc.roundedRect(x + 0.5, y + 0.5, cellWidth - 1, cellHeight - 1, 1.5, 1.5, 'F');

          // Glow effect
          doc.setFillColor(COLORS.cutiaGlow.r, COLORS.cutiaGlow.g, COLORS.cutiaGlow.b);
          doc.setGState(new doc.GState({ opacity: COLORS.cutiaGlow.a }));
          doc.roundedRect(x, y, cellWidth, cellHeight, 2, 2, 'F');

          doc.setGState(new doc.GState({ opacity: 1 }));
        } else if (dayData.isWeekend) {
          // Weekend subtle background
          doc.setFillColor(COLORS.glassDark.r, COLORS.glassDark.g, COLORS.glassDark.b);
          doc.setGState(new doc.GState({ opacity: 0.4 }));
          doc.roundedRect(x + 0.5, y + 0.5, cellWidth - 1, cellHeight - 1, 1, 1, 'F');
          doc.setGState(new doc.GState({ opacity: 1 }));
        }
      }

      // Cell border - subtle glass edge
      doc.setDrawColor(COLORS.borderDark.r, COLORS.borderDark.g, COLORS.borderDark.b);
      doc.setLineWidth(0.15);
      doc.rect(x, y, cellWidth, cellHeight);

      // Day number - HIGH CONTRAST
      doc.setFontSize(8);
      let textColor = COLORS.textDark;

      if (!dayData.isCurrentMonth) {
        textColor = COLORS.textMedium;
        doc.setFont('helvetica', 'normal');
        doc.setGState(new doc.GState({ opacity: 0.4 }));
      } else if (dayData.isHoliday) {
        textColor = COLORS.holidayText;
        doc.setFont('helvetica', 'bold');
      } else if (dayData.isCutiBersama) {
        textColor = COLORS.cutiaText;
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }

      doc.setTextColor(textColor.r, textColor.g, textColor.b);
      doc.text(String(dayData.day), x + cellWidth / 2, y + cellHeight / 2 + 1.5, { align: 'center' });

      if (!dayData.isCurrentMonth) {
        doc.setGState(new doc.GState({ opacity: 1 }));
      }

      // Indicator dot for holidays with enhanced glow
      if ((dayData.isHoliday || dayData.isCutiBersama) && dayData.isCurrentMonth) {
        const dotColor = dayData.isHoliday ? COLORS.holidayText : COLORS.cutiaText;

        // Glow around dot
        doc.setFillColor(dotColor.r, dotColor.g, dotColor.b);
        doc.setGState(new doc.GState({ opacity: 0.3 }));
        doc.circle(x + cellWidth / 2, y + cellHeight - 2, 1.2, 'F');

        // Main dot
        doc.setGState(new doc.GState({ opacity: 1 }));
        doc.setFillColor(dotColor.r, dotColor.g, dotColor.b);
        doc.circle(x + cellWidth / 2, y + cellHeight - 2, 0.9, 'F');
      }

      currentCol++;
      if (currentCol === 7) {
        currentCol = 0;
        currentRow++;
      }
    });

    // Holiday List Section
    const listStartX = MARGIN + calendarWidth + calendarCardPadding * 2 + 8;
    const listWidth = PAGE_WIDTH - listStartX - MARGIN;
    const listCardPadding = 4;

    // Draw glass card for holiday list
    const listCardHeight = PAGE_HEIGHT - (calendarStartY - calendarCardPadding) - MARGIN - 10;
    drawGlassCard(doc, listStartX, calendarStartY - calendarCardPadding, listWidth, listCardHeight, {
      shadowDepth: 2.5,
      borderThickness: 0.5,
    });

    // List title - HIGH CONTRAST
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.textDark.r, COLORS.textDark.g, COLORS.textDark.b);
    doc.text('Daftar Libur & Cuti', listStartX + listCardPadding, calendarStartY + 2);

    // Legend - HIGH CONTRAST
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.textMedium.r, COLORS.textMedium.g, COLORS.textMedium.b);

    // Libur legend with glass effect
    doc.setFillColor(COLORS.holidayText.r, COLORS.holidayText.g, COLORS.holidayText.b);
    doc.setGState(new doc.GState({ opacity: 0.3 }));
    doc.circle(listStartX + listCardPadding, calendarStartY + 8, 1.5, 'F');
    doc.setGState(new doc.GState({ opacity: 1 }));
    doc.setFillColor(COLORS.holidayText.r, COLORS.holidayText.g, COLORS.holidayText.b);
    doc.circle(listStartX + listCardPadding, calendarStartY + 8, 1, 'F');
    doc.text('Libur Nasional', listStartX + listCardPadding + 3.5, calendarStartY + 9);

    // Cuti legend with glass effect
    doc.setFillColor(COLORS.cutiaText.r, COLORS.cutiaText.g, COLORS.cutiaText.b);
    doc.setGState(new doc.GState({ opacity: 0.3 }));
    doc.circle(listStartX + listCardPadding + 28, calendarStartY + 8, 1.5, 'F');
    doc.setGState(new doc.GState({ opacity: 1 }));
    doc.setFillColor(COLORS.cutiaText.r, COLORS.cutiaText.g, COLORS.cutiaText.b);
    doc.circle(listStartX + listCardPadding + 28, calendarStartY + 8, 1, 'F');
    doc.text('Cuti Bersama', listStartX + listCardPadding + 31.5, calendarStartY + 9);

    // Get holidays for this month
    const monthHolidays = allHolidays.filter(h => {
      const holidayDate = new Date(h.date);
      return holidayDate.getMonth() === monthData.month && holidayDate.getFullYear() === 2026;
    }).sort((a, b) => a.date.localeCompare(b.date));

    // Holiday list
    if (monthHolidays.length > 0) {
      const tableData = monthHolidays.map(holiday => {
        const date = new Date(holiday.date);
        const dayFormatter = new Intl.DateTimeFormat("id-ID", { day: '2-digit' });
        const weekdayFormatter = new Intl.DateTimeFormat("id-ID", { weekday: 'long' });

        return [
          dayFormatter.format(date),
          weekdayFormatter.format(date),
          holiday.name,
          holiday.type === 'libur' ? 'Libur' : 'Cuti'
        ];
      });

      autoTable(doc, {
        startY: calendarStartY + 12,
        head: [['Tgl', 'Hari', 'Keterangan', 'Jenis']],
        body: tableData,
        margin: { left: listStartX + listCardPadding, right: MARGIN + listCardPadding },
        styles: {
          fontSize: 7,
          cellPadding: 2.5,
          lineColor: [COLORS.borderDark.r, COLORS.borderDark.g, COLORS.borderDark.b],
          lineWidth: 0.2,
          fontStyle: 'normal',
        },
        headStyles: {
          fillColor: [COLORS.glassDark.r, COLORS.glassDark.g, COLORS.glassDark.b],
          textColor: [COLORS.textDark.r, COLORS.textDark.g, COLORS.textDark.b],
          fontStyle: 'bold',
          halign: 'left',
        },
        bodyStyles: {
          textColor: [COLORS.textDark.r, COLORS.textDark.g, COLORS.textDark.b],
          fontStyle: 'normal',
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center', fontStyle: 'bold' },
          1: { cellWidth: 20 },
          2: { cellWidth: listWidth - listCardPadding * 2 - 44 },
          3: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
        },
        didParseCell: function(data) {
          if (data.section === 'body' && data.column.index === 3) {
            const rowData = tableData[data.row.index];
            if (rowData && rowData[3] === 'Libur') {
              // High contrast emerald background
              data.cell.styles.fillColor = [16, 185, 129]; // emerald-500
              data.cell.styles.textColor = [255, 255, 255]; // white text
              data.cell.styles.fontStyle = 'bold';
            } else if (rowData && rowData[3] === 'Cuti') {
              // High contrast sky background
              data.cell.styles.fillColor = [14, 165, 233]; // sky-500
              data.cell.styles.textColor = [255, 255, 255]; // white text
              data.cell.styles.fontStyle = 'bold';
            }
          }
        },
        alternateRowStyles: {
          fillColor: [COLORS.glassMid.r, COLORS.glassMid.g, COLORS.glassMid.b],
        },
      });
    } else {
      // No holidays this month
      doc.setFontSize(8);
      doc.setTextColor(COLORS.textMedium.r, COLORS.textMedium.g, COLORS.textMedium.b);
      doc.setFont('helvetica', 'italic');
      doc.text('Tidak ada libur atau cuti pada bulan ini', listStartX + listCardPadding, calendarStartY + 15);
    }

    // Footer with glass effect
    const footerY = PAGE_HEIGHT - MARGIN - 3;

    // Glass divider line
    doc.setDrawColor(COLORS.borderGlass.r, COLORS.borderGlass.g, COLORS.borderGlass.b);
    doc.setGState(new doc.GState({ opacity: COLORS.borderGlass.a }));
    doc.setLineWidth(0.5);
    doc.line(MARGIN, footerY - 5, PAGE_WIDTH - MARGIN, footerY - 5);

    // Darker line for definition
    doc.setGState(new doc.GState({ opacity: 1 }));
    doc.setDrawColor(COLORS.borderDark.r, COLORS.borderDark.g, COLORS.borderDark.b);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, footerY - 4.7, PAGE_WIDTH - MARGIN, footerY - 4.7);

    // Footer text - HIGH CONTRAST
    doc.setFontSize(7);
    doc.setTextColor(COLORS.textMedium.r, COLORS.textMedium.g, COLORS.textMedium.b);
    doc.setFont('helvetica', 'bold');
    doc.text('Kalender 2026 Indonesia - Libur Nasional & Cuti Bersama', MARGIN, footerY);
    doc.text(`Halaman ${index + 1} dari 12`, PAGE_WIDTH - MARGIN, footerY, { align: 'right' });
  });

  // Save the PDF
  doc.save('Kalender-2026-Indonesia.pdf');
}
