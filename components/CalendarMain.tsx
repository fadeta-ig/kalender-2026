"use client";

import { useMemo, useState, useTransition } from "react";
import { getCalendarData, type SupportedYear } from "@/data/holidays";
import { generateCalendarMonths, buildSchedules } from "@/lib/calendar";
import { analyzeLeaveOpportunities, type LeaveRecommendation } from "@/lib/leaveRecommendation";
import { exportCalendarToPDF } from "@/lib/pdfExport";
import { optimizeLeaveBudget } from "@/lib/leaveOptimizer";
import { useCalendarUrlParams } from "@/hooks/useCalendarUrlParams";
import Navbar from "./Navbar";
import CalendarHeader from "./CalendarHeader";
import CalendarGridView from "./CalendarGridView";
import CalendarListView from "./CalendarListView";
import FocusedMonthView from "./FocusedMonthView";
import MonthQuickNavigator from "./MonthQuickNavigator";
import MonthSelectorModal from "./MonthSelectorModal";
import DayDetailInspector from "./DayDetailInspector";
import LeaveRecommendations from "./LeaveRecommendations";
import LeaveBudgetSimulator from "./LeaveBudgetSimulator";
import CalendarSyncModal from "./CalendarSyncModal";
import ShareLeaveModal, { type ShareLeavePlanData } from "./ShareLeaveModal";
import FeatureTourGuide from "./FeatureTourGuide";
import { useFeatureTour } from "@/hooks/useFeatureTour";

export default function CalendarMain() {
  const [, startTransition] = useTransition();

  // Sinkronisasi parameter URL (year, quota, strategy, tab) tanpa cascading renders
  const {
    selectedYear,
    setSelectedYear,
    activeTab,
    setActiveTab,
    leaveQuota,
    setLeaveQuota,
    leaveStrategy,
    setLeaveStrategy,
  } = useCalendarUrlParams();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Quick Month Navigator state: null = Semua Bulan, 0..11 = Bulan Spesifik
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Dialog pemilih bulan (1-tap jump)
  const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);

  // Tanggal yang sedang dipilih untuk diinspeksi (klik/sentuh)
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Set tanggal cuti yang ditandai manual oleh pengguna
  const [customMarkedDates, setCustomMarkedDates] = useState<Set<string>>(new Set());

  // State untuk Fitur #2: Modal Sinkronisasi Kalender
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // State untuk Fitur #5: Minimalist Cultural Overlay (Hijriah & Pasaran Jawa)
  const [showCulturalOverlay, setShowCulturalOverlay] = useState(false);

  // Highlight simulasi di kalender
  const [isCalendarHighlighted, setIsCalendarHighlighted] = useState(false);

  // State untuk Fitur Viral: Modal Bagikan Rencana Cuti
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharePlanData, setSharePlanData] = useState<ShareLeavePlanData>({
    year: 2027,
    title: "Libur Panjang & Cuti Hemat 2027",
    totalDaysOff: 9,
    usedQuota: 1,
    datesDescription: "Momentum Iduladha & Waisak (15 - 23 Mei 2027)",
    shareUrl: "https://calendar.gandivalabs.my.id",
  });

  // Fitur Interactive Tour Guide
  const {
    isTourOpen,
    currentStep,
    startTour,
    closeTour,
    nextStep,
    prevStep,
    goToStep,
  } = useFeatureTour();

  // Ambil data hari libur resmi untuk tahun yang dipilih
  const yearData = useMemo(() => getCalendarData(selectedYear), [selectedYear]);

  // Bangun grid kalender 12 bulan
  const calendarMonths = useMemo(
    () => generateCalendarMonths(selectedYear, yearData.holidays, yearData.jointLeave),
    [selectedYear, yearData]
  );

  // Bangun daftar jadwal bulanan
  const schedules = useMemo(
    () => buildSchedules(selectedYear, yearData.holidays, yearData.jointLeave),
    [selectedYear, yearData]
  );

  // Hitung semua peluang rekomendasi cuti
  const recommendations = useMemo(
    () => analyzeLeaveOpportunities(yearData.holidays, yearData.jointLeave),
    [yearData]
  );

  // Hitung simulasi jatah cuti personal (Fitur #1)
  const simulatedPlan = useMemo(
    () => optimizeLeaveBudget(recommendations, leaveQuota, leaveStrategy),
    [recommendations, leaveQuota, leaveStrategy]
  );

  // Gabungan tanggal cuti (simulasi sistem + tandai manual pengguna)
  const activeHighlightedDates = useMemo(() => {
    const set = new Set<string>();
    if (isCalendarHighlighted) {
      for (const d of simulatedPlan.highlightDateSet) {
        set.add(d);
      }
    }
    for (const d of customMarkedDates) {
      set.add(d);
    }
    return set;
  }, [isCalendarHighlighted, simulatedPlan.highlightDateSet, customMarkedDates]);

  // Cari data tanggal yang sedang dipilih (untuk panel inspector di mode 12 bulan)
  const selectedDayData = useMemo(() => {
    if (!selectedDate) return null;
    for (const month of calendarMonths) {
      const found = month.days.find((d) => d.dateString === selectedDate && d.isCurrentMonth);
      if (found) return found;
    }
    return null;
  }, [selectedDate, calendarMonths]);

  const handleTogglePersonalLeave = (dateStr: string) => {
    setCustomMarkedDates((prev) => {
      const next = new Set(prev);
      if (next.has(dateStr)) {
        next.delete(dateStr);
      } else {
        next.add(dateStr);
      }
      return next;
    });
  };

  const handleExportPDF = () => {
    exportCalendarToPDF(yearData.holidays, yearData.jointLeave, selectedYear);
  };

  const handleYearChange = (year: SupportedYear) => {
    setSelectedYear(year);
  };

  const handleOpenShare = (custom?: Partial<ShareLeavePlanData>) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://calendar.gandivalabs.my.id";
    const shareUrl = `${baseUrl}/?year=${selectedYear}&quota=${leaveQuota}&strategy=${leaveStrategy}&tab=tips`;

    const bestPackage = simulatedPlan.selectedPackages[0];
    const title = custom?.title || (bestPackage ? bestPackage.title : `Libur Hemat ${selectedYear}`);
    const totalDaysOff = custom?.totalDaysOff ?? (simulatedPlan.totalDaysOff || 9);
    const usedQuota = custom?.usedQuota ?? (simulatedPlan.leaveDaysUsed || leaveQuota);
    const datesDescription =
      custom?.datesDescription ||
      (bestPackage ? `${bestPackage.startDate} - ${bestPackage.endDate}` : `Paket Cuti ${leaveQuota} Hari`);

    setSharePlanData({
      year: selectedYear,
      title,
      totalDaysOff,
      usedQuota,
      datesDescription,
      shareUrl,
    });
    setIsShareModalOpen(true);
  };

  const handleOpenRecommendationShare = (rec: LeaveRecommendation) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://calendar.gandivalabs.my.id";
    const shareUrl = `${baseUrl}/?year=${selectedYear}&tab=tips`;

    setSharePlanData({
      year: selectedYear,
      title: rec.title,
      totalDaysOff: rec.totalDays,
      usedQuota: rec.leaveDaysNeeded,
      datesDescription: `${rec.startDate} - ${rec.endDate} (${rec.description})`,
      shareUrl,
    });
    setIsShareModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors duration-150">
      {/* Top Enterprise Navbar - HANYA ADA Panduan, Tur Panduan, & Toggle Tema */}
      <Navbar onStartTour={startTour} />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Header & Stats */}
        <CalendarHeader
          year={selectedYear}
          holidaysCount={yearData.holidays.length}
          jointLeaveCount={yearData.jointLeave.length}
          recommendationsCount={recommendations.length}
          skbInfo={yearData.skbInfo}
        />

        {/* Primary Tabs Navigation - Adaptif untuk mobile tanpa meluap */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-3 sm:pb-4">
          <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-0.5 sm:p-1 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => startTransition(() => setActiveTab("calendar"))}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                activeTab === "calendar"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/90 dark:border-zinc-700/90"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <svg className="w-4 h-4 pointer-events-none shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span className="sm:hidden">Kalender</span>
              <span className="hidden sm:inline">Kalender Tahunan</span>
            </button>

            <button
              id="tour-tab-tips"
              type="button"
              onClick={() => startTransition(() => setActiveTab("tips"))}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                activeTab === "tips"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/90 dark:border-zinc-700/90"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <svg className="w-4 h-4 pointer-events-none shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.516 0c.85.493 1.508 1.333 1.508 2.316V18" />
              </svg>
              <span className="sm:hidden">Tips Cuti</span>
              <span className="hidden sm:inline">Tips Libur &amp; Simulasi Cuti</span>
            </button>
          </div>

          {/* Sub-controls when on calendar tab */}
          {activeTab === "calendar" && (
            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full lg:w-auto">
              {/* Toggle Fitur #5: Penanggalan Budaya (Hijriah & Pasaran Jawa) */}
              <button
                id="tour-cultural-toggle"
                type="button"
                onClick={() => setShowCulturalOverlay(!showCulturalOverlay)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  showCulturalOverlay
                    ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
                title="Tampilkan tanggal Hijriah dan pasaran Jawa (Pon, Wage, Kliwon, Legi, Pahing)"
              >
                <svg className="w-3.5 h-3.5 pointer-events-none shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                <span>Hijriah &amp; Pasaran</span>
              </button>

              {/* View Mode Toggle: Grid vs List */}
              <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-0.5 sm:p-1">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("grid");
                  }}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700/80"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  <svg className="w-3.5 h-3.5 pointer-events-none shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                  <span>Bulan</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setViewMode("list");
                    setSelectedMonth(null);
                  }}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    viewMode === "list"
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700/80"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  <svg className="w-3.5 h-3.5 pointer-events-none shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 17.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <span>Daftar</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tab View Content */}
        {activeTab === "tips" ? (
          <div className="space-y-8 animate-fade-in">
            {/* Fitur #1: Smart Leave Budget Simulator */}
            <LeaveBudgetSimulator
              quota={leaveQuota}
              strategy={leaveStrategy}
              plan={simulatedPlan}
              isCalendarHighlighted={isCalendarHighlighted}
              onUpdateQuota={setLeaveQuota}
              onUpdateStrategy={setLeaveStrategy}
              onToggleHighlightCalendar={() => setIsCalendarHighlighted(!isCalendarHighlighted)}
              onSharePlan={() => handleOpenShare()}
            />

            {/* Rekomendasi Cuti Umum */}
            <LeaveRecommendations
              recommendations={recommendations}
              onShareRecommendation={handleOpenRecommendationShare}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quick Month Navigator Bar & Unified Action Tools (Tahun, Bagikan, PDF, Sinkron) */}
            <div id="tour-month-nav">
              <MonthQuickNavigator
                calendarMonths={calendarMonths}
                selectedMonth={selectedMonth}
                onSelectMonth={(m) => setSelectedMonth(m)}
                onOpenMonthModal={() => setIsMonthModalOpen(true)}
                selectedYear={selectedYear}
                onSelectYear={handleYearChange}
                onExportPDF={handleExportPDF}
                onOpenShare={() => handleOpenShare()}
                onOpenSync={() => setIsSyncModalOpen(true)}
              />
            </div>

            {viewMode === "list" ? (
              <CalendarListView schedules={schedules} />
            ) : selectedMonth !== null ? (
              <FocusedMonthView
                monthData={calendarMonths[selectedMonth]}
                showCulturalOverlay={showCulturalOverlay}
                selectedDate={selectedDate}
                highlightedPersonalLeaveDates={activeHighlightedDates}
                onSelectDate={(d) => setSelectedDate(d === selectedDate ? null : d)}
                onPrevMonth={() => setSelectedMonth((selectedMonth + 11) % 12)}
                onNextMonth={() => setSelectedMonth((selectedMonth + 1) % 12)}
                onBackToOverview={() => setSelectedMonth(null)}
                onTogglePersonalLeave={handleTogglePersonalLeave}
              />
            ) : (
              /* Tinjauan 12 Bulan Lengkap */
              <div className="space-y-5">
                {/* Interactive Day Inspector jika pengguna memilih tanggal di mode 12 bulan */}
                {selectedDayData && (
                  <DayDetailInspector
                    dayData={selectedDayData}
                    showCulturalOverlay={showCulturalOverlay}
                    isPersonalLeave={activeHighlightedDates.has(selectedDayData.dateString)}
                    onClose={() => setSelectedDate(null)}
                    onTogglePersonalLeave={handleTogglePersonalLeave}
                  />
                )}

                <CalendarGridView
                  calendarMonths={calendarMonths}
                  showCulturalOverlay={showCulturalOverlay}
                  selectedDate={selectedDate}
                  highlightedPersonalLeaveDates={activeHighlightedDates}
                  onSelectDate={(d) => setSelectedDate(d === selectedDate ? null : d)}
                  onSelectMonth={(monthIdx) => setSelectedMonth(monthIdx)}
                />
              </div>
            )}
          </div>
        )}

        {/* Compact SEO Hub & Editorial Guide Card (Menggantikan section panjang untuk mempercepat INP) */}
        <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-50 via-white to-zinc-50 dark:from-zinc-900/80 dark:via-zinc-900 dark:to-zinc-950 p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 shadow-sm">
          <div className="space-y-1.5 max-w-2xl min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
              <span>Resmi SKB 3 Menteri RI</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Panduan Lengkap Kalender 2027, Trik Cuti &amp; Kalender Jawa
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Pelajari tabel lengkap 26 hari libur resmi, 9 formula hemat cuti (long weekend hacks), serta filosofi siklus 5 pasaran Jawa (Panca Wara &amp; neptu) di halaman panduan khusus kami.
            </p>
          </div>

          <a
            href="/panduan"
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold whitespace-nowrap shadow-sm transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto text-center"
          >
            <span>Baca Panduan Lengkap</span>
            <svg className="w-4 h-4 pointer-events-none shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </section>

        {/* Enterprise Footer dengan Branding Gandiva Labs & Tautan Sosial Media */}
        <footer className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-8 mt-10 sm:mt-14 text-xs text-zinc-500 dark:text-zinc-400 shadow-sm">
          {/* Top Bar: Official SKB Legal Status */}
          <div className="p-3 sm:p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 break-words">
                Regulasi Resmi Pemerintah RI: {yearData.skbInfo.decreeNumber}
              </span>
            </div>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 break-words">
              Penetapan: {yearData.skbInfo.signatories.join(" • ")}
            </span>
          </div>

          {/* Middle Columns: Brand, Links & Socials */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 text-left border-y border-zinc-200/80 dark:border-zinc-800/80 py-6 sm:py-8">
            {/* Col 1: Gandiva Labs Branding */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/80 p-1">
                  <img
                    src="/gandiva-mark-dark.webp"
                    alt="Gandiva Labs"
                    width={24}
                    height={24}
                    className="w-full h-full object-contain dark:hidden pointer-events-none"
                  />
                  <img
                    src="/gandiva-mark-light.webp"
                    alt="Gandiva Labs"
                    width={24}
                    height={24}
                    className="w-full h-full object-contain hidden dark:block pointer-events-none"
                  />
                </div>
                <div>
                  <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 block">
                    Gandiva Labs
                  </span>
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    Product Engineering &amp; Digital Innovation
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md">
                Aplikasi Kalender Resmi Indonesia dirancang oleh <strong>Gandiva Labs</strong> dengan standar kecepatan tinggi, privasi tanpa iklan, dan navigasi penanggalan modern untuk produktivitas masyarakat Indonesia.
              </p>
              <div className="pt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                Powered by Gandiva Labs • Dikelola secara independen untuk kepentingan publik.
              </div>
            </div>

            {/* Col 2: Navigasi Kalender */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider block">
                Navigasi Cepat
              </span>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="/panduan#kalender-2027" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                    Kalender 2027 Resmi
                  </a>
                </li>
                <li>
                  <a href="/panduan#rekomendasi-cuti" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                    Rekomendasi Cuti 2027
                  </a>
                </li>
                <li>
                  <a href="/panduan#kalender-jawa" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                    Kalender Jawa &amp; Weton
                  </a>
                </li>
                <li>
                  <a href="/panduan#faq" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                    FAQ Hari Libur 2027
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Kontak & Media Sosial Gandiva Labs */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider block">
                Terhubung dengan Kami
              </span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Ikuti perkembangan teknologi dan produk kami melalui saluran media sosial resmi:
              </p>
              <div className="flex flex-col gap-2 pt-1">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/gandivalabs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram @gandivalabs"
                  className="inline-flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors font-medium"
                >
                  <svg className="w-4 h-4 pointer-events-none shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/>
                  </svg>
                  <span>@gandivalabs</span>
                </a>

                {/* Threads */}
                <a
                  href="https://www.threads.com/@gandivalabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Threads @gandivalabs"
                  className="inline-flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium"
                >
                  <svg className="w-4 h-4 pointer-events-none shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z"/>
                  </svg>
                  <span>@gandivalabs</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-zinc-400 dark:text-zinc-500 pt-2">
            <div>
              © {new Date().getFullYear()} Gandiva Labs. Seluruh hak cipta dilindungi undang-undang.
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={startTour}
                className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer"
              >
                Panduan Fitur
              </button>
              <span>•</span>
              <span className="text-zinc-400 dark:text-zinc-500">
                calendar.gandivalabs.my.id
              </span>
            </div>
          </div>
        </footer>
      </main>

      {/* Modal Sinkronisasi Kalender (Fitur #2) */}
      <CalendarSyncModal
        isOpen={isSyncModalOpen}
        year={selectedYear}
        holidays={yearData.holidays}
        jointLeave={yearData.jointLeave}
        customLeaveDates={simulatedPlan.personalLeaveDates}
        onClose={() => setIsSyncModalOpen(false)}
      />

      {/* Modal Dialog Pemilih Bulan (1-Tap Jump) */}
      <MonthSelectorModal
        isOpen={isMonthModalOpen}
        year={selectedYear}
        calendarMonths={calendarMonths}
        selectedMonth={selectedMonth}
        onSelectMonth={(m) => setSelectedMonth(m)}
        onClose={() => setIsMonthModalOpen(false)}
      />

      {/* Modal Viral: Bagikan Rencana Cuti ke Teman */}
      <ShareLeaveModal
        isOpen={isShareModalOpen}
        planData={sharePlanData}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Interactive Feature Tour Guide */}
      <FeatureTourGuide
        isOpen={isTourOpen}
        currentStep={currentStep}
        onNext={nextStep}
        onPrev={prevStep}
        onClose={closeTour}
        onGoToStep={goToStep}
      />
    </div>
  );
}
