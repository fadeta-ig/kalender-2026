"use client";

import { useMemo, useState } from "react";
import { getCalendarData, type SupportedYear } from "@/data/holidays";
import { generateCalendarMonths, buildSchedules } from "@/lib/calendar";
import { analyzeLeaveOpportunities } from "@/lib/leaveRecommendation";
import { exportCalendarToPDF } from "@/lib/pdfExport";
import { optimizeLeaveBudget, type LeaveStrategy } from "@/lib/leaveOptimizer";
import Navbar from "./Navbar";
import CalendarHeader from "./CalendarHeader";
import CalendarGridView from "./CalendarGridView";
import CalendarListView from "./CalendarListView";
import FocusedMonthView from "./FocusedMonthView";
import MonthQuickNavigator from "./MonthQuickNavigator";
import LeaveRecommendations from "./LeaveRecommendations";
import LeaveBudgetSimulator from "./LeaveBudgetSimulator";
import CalendarSyncModal from "./CalendarSyncModal";

export default function CalendarMain() {
  const [selectedYear, setSelectedYear] = useState<SupportedYear>(2027);
  const [activeTab, setActiveTab] = useState<"calendar" | "tips">("calendar");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Quick Month Navigator state: null = Semua Bulan, 0..11 = Bulan Spesifik
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // State untuk Fitur #2: Modal Sinkronisasi Kalender
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // State untuk Fitur #5: Minimalist Cultural Overlay (Hijriah & Pasaran Jawa)
  const [showCulturalOverlay, setShowCulturalOverlay] = useState(false);

  // State untuk Fitur #1: Smart Leave Budget Simulator
  const [leaveQuota, setLeaveQuota] = useState(5);
  const [leaveStrategy, setLeaveStrategy] = useState<LeaveStrategy>("longest");
  const [isCalendarHighlighted, setIsCalendarHighlighted] = useState(false);

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

  const handleExportPDF = () => {
    exportCalendarToPDF(yearData.holidays, yearData.jointLeave, selectedYear);
  };

  const handleYearChange = (year: SupportedYear) => {
    setSelectedYear(year);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors duration-150">
      {/* Top Enterprise Navbar */}
      <Navbar
        selectedYear={selectedYear}
        onSelectYear={handleYearChange}
        onExportPDF={handleExportPDF}
        onOpenSync={() => setIsSyncModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Header & Stats */}
        <CalendarHeader
          year={selectedYear}
          holidaysCount={yearData.holidays.length}
          jointLeaveCount={yearData.jointLeave.length}
          recommendationsCount={recommendations.length}
          skbInfo={yearData.skbInfo}
        />

        {/* Primary Tabs Navigation - Flat segmented control */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-1 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab("calendar")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                activeTab === "calendar"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/90 dark:border-zinc-700/90"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span>Kalender Tahunan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("tips")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                activeTab === "tips"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/90 dark:border-zinc-700/90"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.516 0c.85.493 1.508 1.333 1.508 2.316V18" />
              </svg>
              <span>Tips Libur & Simulasi Cuti</span>
            </button>
          </div>

          {/* Sub-controls when on calendar tab */}
          {activeTab === "calendar" && (
            <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2.5">
              {/* Toggle Fitur #5: Penanggalan Budaya (Hijriah & Pasaran Jawa) */}
              <button
                type="button"
                onClick={() => setShowCulturalOverlay(!showCulturalOverlay)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  showCulturalOverlay
                    ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
                title="Tampilkan tanggal Hijriah dan pasaran Jawa (Pon, Wage, Kliwon, Legi, Pahing)"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                <span>Hijriah & Pasaran</span>
              </button>

              {/* View Mode Toggle: Grid vs List */}
              <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("grid");
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700/80"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                  <span>Bulan</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setViewMode("list");
                    setSelectedMonth(null); // List view menampilkan semua jadwal
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    viewMode === "list"
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700/80"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 17.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <span>Daftar</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tab Content Display */}
        {activeTab === "tips" ? (
          <div className="space-y-8">
            {/* Fitur #1: Smart Leave Budget Simulator */}
            <LeaveBudgetSimulator
              quota={leaveQuota}
              strategy={leaveStrategy}
              plan={simulatedPlan}
              isCalendarHighlighted={isCalendarHighlighted}
              onUpdateQuota={setLeaveQuota}
              onUpdateStrategy={setLeaveStrategy}
              onToggleHighlightCalendar={() => setIsCalendarHighlighted(!isCalendarHighlighted)}
            />

            {/* Rekomendasi Cuti Umum */}
            <LeaveRecommendations recommendations={recommendations} />
          </div>
        ) : viewMode === "list" ? (
          <CalendarListView schedules={schedules} />
        ) : (
          /* Grid Mode: dengan Quick Month Navigator & Focused View */
          <div className="space-y-6">
            {/* Quick Month Navigator Bar */}
            <MonthQuickNavigator
              calendarMonths={calendarMonths}
              selectedMonth={selectedMonth}
              onSelectMonth={(m) => setSelectedMonth(m)}
            />

            {/* Jika ada bulan yang dipilih: Tampilkan Focused Single Month View */}
            {selectedMonth !== null ? (
              <FocusedMonthView
                monthData={calendarMonths[selectedMonth]}
                showCulturalOverlay={showCulturalOverlay}
                highlightedPersonalLeaveDates={isCalendarHighlighted ? simulatedPlan.highlightDateSet : undefined}
                onPrevMonth={() => setSelectedMonth((selectedMonth + 11) % 12)}
                onNextMonth={() => setSelectedMonth((selectedMonth + 1) % 12)}
                onBackToOverview={() => setSelectedMonth(null)}
              />
            ) : (
              /* Tinjauan 12 Bulan Lengkap */
              <CalendarGridView
                calendarMonths={calendarMonths}
                showCulturalOverlay={showCulturalOverlay}
                highlightedPersonalLeaveDates={isCalendarHighlighted ? simulatedPlan.highlightDateSet : undefined}
                onSelectMonth={(monthIdx) => setSelectedMonth(monthIdx)}
              />
            )}
          </div>
        )}

        {/* Enterprise Flat Footer */}
        <footer className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 text-center text-xs text-zinc-500 dark:text-zinc-400 space-y-2 mt-12">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              Keterangan Regulasi Resmi
            </span>
          </div>
          <p className="max-w-3xl mx-auto leading-relaxed">
            {yearData.skbInfo.description} ({yearData.skbInfo.decreeNumber}).
          </p>
          <p className="text-zinc-400 dark:text-zinc-500">
            Penetapan bersama oleh: {yearData.skbInfo.signatories.join(" • ")}.
          </p>
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
    </div>
  );
}
