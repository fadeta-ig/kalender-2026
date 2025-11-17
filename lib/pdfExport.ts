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

// Colors
const COLORS = {
  primary: '#0ea5e9', // sky-500
  secondary: '#8b5cf6', // purple-500
  emerald: '#10b981', // emerald-500
  sky: '#38bdf8', // sky-400
  text: '#1e293b', // slate-800
  textLight: '#64748b', // slate-500
  border: '#e2e8f0', // slate-200
  background: '#f8fafc', // slate-50
  weekend: '#f1f5f9', // slate-100
};

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

    // Add gradient-like background effect with rectangles
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F');

    // Add decorative elements
    doc.setFillColor(14, 165, 233, 0.05);
    doc.circle(PAGE_WIDTH - 30, 30, 40, 'F');
    doc.setFillColor(139, 92, 246, 0.05);
    doc.circle(30, PAGE_HEIGHT - 30, 35, 'F');

    // Header
    const headerY = MARGIN;

    // Month and year title
    doc.setFontSize(24);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text(`${monthData.monthName} ${monthData.year}`, MARGIN, headerY + 8);

    // Subtitle with stats
    const holidayCount = monthData.days.filter(d => d.isHoliday && d.isCurrentMonth).length;
    const cutiCount = monthData.days.filter(d => d.isCutiBersama && d.isCurrentMonth).length;
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text(`${holidayCount} Libur Nasional  •  ${cutiCount} Cuti Bersama`, MARGIN, headerY + 14);

    // Calendar Grid
    const calendarStartY = headerY + 22;
    const calendarWidth = 140;
    const cellWidth = calendarWidth / 7;
    const cellHeight = 10;

    // Day headers
    const dayHeaders = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);

    dayHeaders.forEach((day, i) => {
      const x = MARGIN + i * cellWidth;
      doc.text(day, x + cellWidth / 2, calendarStartY + 4, { align: 'center' });
    });

    // Calendar days
    let currentRow = 0;
    let currentCol = 0;
    const gridStartY = calendarStartY + 7;

    monthData.days.forEach((dayData) => {
      const x = MARGIN + currentCol * cellWidth;
      const y = gridStartY + currentRow * cellHeight;

      // Cell background
      if (dayData.isCurrentMonth) {
        if (dayData.isHoliday) {
          doc.setFillColor(16, 185, 129, 0.2); // emerald
          doc.rect(x, y, cellWidth, cellHeight, 'F');
        } else if (dayData.isCutiBersama) {
          doc.setFillColor(56, 189, 248, 0.2); // sky
          doc.rect(x, y, cellWidth, cellHeight, 'F');
        } else if (dayData.isWeekend) {
          doc.setFillColor(241, 245, 249); // light gray
          doc.rect(x, y, cellWidth, cellHeight, 'F');
        }
      }

      // Cell border
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.1);
      doc.rect(x, y, cellWidth, cellHeight);

      // Day number
      doc.setFontSize(8);
      doc.setFont('helvetica', dayData.isCurrentMonth ? 'normal' : 'normal');
      doc.setTextColor(dayData.isCurrentMonth ? 30 : 148, dayData.isCurrentMonth ? 41 : 163, dayData.isCurrentMonth ? 59 : 184);
      doc.text(String(dayData.day), x + cellWidth / 2, y + cellHeight / 2 + 1.5, { align: 'center' });

      // Indicator dot for holidays
      if ((dayData.isHoliday || dayData.isCutiBersama) && dayData.isCurrentMonth) {
        const dotColor: [number, number, number] = dayData.isHoliday ? [16, 185, 129] : [56, 189, 248];
        doc.setFillColor(dotColor[0], dotColor[1], dotColor[2]);
        doc.circle(x + cellWidth / 2, y + cellHeight - 2, 0.8, 'F');
      }

      currentCol++;
      if (currentCol === 7) {
        currentCol = 0;
        currentRow++;
      }
    });

    // Holiday List Section
    const listStartX = MARGIN + calendarWidth + 12;
    const listWidth = PAGE_WIDTH - listStartX - MARGIN;

    // List title
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Daftar Libur & Cuti', listStartX, calendarStartY);

    // Legend
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);

    // Libur legend
    doc.setFillColor(16, 185, 129);
    doc.circle(listStartX, calendarStartY + 5, 1, 'F');
    doc.text('Libur Nasional', listStartX + 3, calendarStartY + 6);

    // Cuti legend
    doc.setFillColor(56, 189, 248);
    doc.circle(listStartX + 27, calendarStartY + 5, 1, 'F');
    doc.text('Cuti Bersama', listStartX + 30, calendarStartY + 6);

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
        startY: calendarStartY + 10,
        head: [['Tgl', 'Hari', 'Keterangan', 'Jenis']],
        body: tableData,
        margin: { left: listStartX, right: MARGIN },
        styles: {
          fontSize: 7,
          cellPadding: 2,
          lineColor: [226, 232, 240],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [241, 245, 249],
          textColor: [71, 85, 105],
          fontStyle: 'bold',
          halign: 'left',
        },
        bodyStyles: {
          textColor: [30, 41, 59],
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 22 },
          2: { cellWidth: listWidth - 46 },
          3: { cellWidth: 14, halign: 'center' },
        },
        didParseCell: function(data) {
          if (data.section === 'body' && data.column.index === 3) {
            const rowData = tableData[data.row.index];
            if (rowData && rowData[3] === 'Libur') {
              data.cell.styles.fillColor = [220, 252, 231]; // emerald-100
              data.cell.styles.textColor = [5, 150, 105];
            } else if (rowData && rowData[3] === 'Cuti') {
              data.cell.styles.fillColor = [224, 242, 254]; // sky-100
              data.cell.styles.textColor = [2, 132, 199];
            }
          }
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
      });
    } else {
      // No holidays this month
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.setFont('helvetica', 'italic');
      doc.text('Tidak ada libur atau cuti pada bulan ini', listStartX, calendarStartY + 15);
    }

    // Footer
    const footerY = PAGE_HEIGHT - MARGIN - 3;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, footerY - 5, PAGE_WIDTH - MARGIN, footerY - 5);

    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text('Kalender 2026 Indonesia - Libur Nasional & Cuti Bersama', MARGIN, footerY);
    doc.text(`Halaman ${index + 1} dari 12`, PAGE_WIDTH - MARGIN, footerY, { align: 'right' });
  });

  // Save the PDF
  doc.save('Kalender-2026-Indonesia.pdf');
}
