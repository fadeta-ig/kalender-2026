"use client";

import { useMemo, useState } from "react";
import { getCalendarData, type SupportedYear } from "@/data/holidays";
import { generateCalendarMonths, buildSchedules } from "@/lib/calendar";
import { analyzeLeaveOpportunities } from "@/lib/leaveRecommendation";
import { exportCalendarToPDF } from "@/lib/pdfExport";
import YearSelector from "./YearSelector";
import CalendarHeader from "./CalendarHeader";
import CalendarGridView from "./CalendarGridView";
import CalendarListView from "./CalendarListView";
import LeaveRecommendations from "./LeaveRecommendations";

export default function CalendarMain() {
  const [selectedYear, setSelectedYear] = useState<SupportedYear>(2027);
  const [activeTab, setActiveTab] = useState<"calendar" | "recommendations">("calendar");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Load holiday data for active year
  const yearData = useMemo(() => getCalendarData(selectedYear), [selectedYear]);

  // Generate calendar grid for active year
  const calendarMonths = useMemo(
    () => generateCalendarMonths(selectedYear, yearData.holidays, yearData.jointLeave),
    [selectedYear, yearData]
  );

  // Generate list schedules for active year
  const schedules = useMemo(
    () => buildSchedules(selectedYear, yearData.holidays, yearData.jointLeave),
    [selectedYear, yearData]
  );

  // AI recommendations for active year
  const recommendations = useMemo(
    () => analyzeLeaveOpportunities(yearData.holidays, yearData.jointLeave),
    [yearData]
  );

  const handleExportPDF = () => {
    exportCalendarToPDF(yearData.holidays, yearData.jointLeave, selectedYear);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 relative overflow-hidden">
      {/* Dynamic ambient blur orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-emerald-500/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        {/* Year Switcher (2026 / 2027) */}
        <YearSelector selectedYear={selectedYear} onSelectYear={setSelectedYear} />

        {/* Dynamic Header */}
        <CalendarHeader
          year={selectedYear}
          holidaysCount={yearData.holidays.length}
          jointLeaveCount={yearData.jointLeave.length}
          recommendationsCount={recommendations.length}
          skbInfo={yearData.skbInfo}
        />

        {/* Main Tab Navigation */}
        <div className="flex justify-center">
          <div className="glass-strong rounded-2xl p-2 inline-flex gap-2 border border-white/15">
            <button
              type="button"
              onClick={() => setActiveTab("calendar")}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                activeTab === "calendar"
                  ? "bg-gradient-to-r from-sky-500 to-purple-600 text-white shadow-lg shadow-sky-500/20"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Kalender Lengkap
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("recommendations")}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                activeTab === "recommendations"
                  ? "bg-gradient-to-r from-sky-500 to-purple-600 text-white shadow-lg shadow-sky-500/20"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              Rekomendasi AI
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "recommendations" ? (
          <LeaveRecommendations recommendations={recommendations} />
        ) : (
          <div className="space-y-6">
            {/* View Mode Switcher and Export PDF */}
            <div className="flex flex-wrap justify-between items-center gap-4">
              {/* Export PDF Button */}
              <button
                type="button"
                onClick={handleExportPDF}
                className="glass-strong rounded-xl px-5 py-2.5 font-semibold text-sm transition-all duration-300 hover:bg-white/10 hover-lift group border border-white/15"
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-white">Export PDF ({selectedYear})</span>
                </span>
              </button>

              {/* View Mode Toggle */}
              <div className="glass-strong rounded-xl p-1 inline-flex gap-1 border border-white/15">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`px-3.5 py-1.5 rounded-lg font-medium text-xs transition-all duration-300 flex items-center gap-1.5 ${
                    viewMode === "grid"
                      ? "bg-white/20 text-white shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                    />
                  </svg>
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`px-3.5 py-1.5 rounded-lg font-medium text-xs transition-all duration-300 flex items-center gap-1.5 ${
                    viewMode === "list"
                      ? "bg-white/20 text-white shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  List
                </button>
              </div>
            </div>

            {/* Grid or List View Component */}
            {viewMode === "grid" ? (
              <CalendarGridView calendarMonths={calendarMonths} />
            ) : (
              <CalendarListView schedules={schedules} />
            )}
          </div>
        )}

        {/* Footer with SKB Reference */}
        <footer className="glass-strong rounded-2xl p-6 text-center text-sm text-slate-300 animate-slide-up border border-white/10 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-bold text-white">Sumber Regulasi Resmi Pemerintah</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            {yearData.skbInfo.description} (
            <span className="text-sky-300 font-medium">{yearData.skbInfo.decreeNumber}</span>
            ).
          </p>
          <p className="text-xs text-slate-400">
            Penandatangan: {yearData.skbInfo.signatories.join(", ")}.
          </p>
        </footer>
      </div>
    </main>
  );
}
