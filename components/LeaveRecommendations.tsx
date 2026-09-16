"use client";

import { useMemo, useState } from "react";
import type { LeaveRecommendation } from "@/lib/leaveRecommendation";

type Props = {
  recommendations: LeaveRecommendation[];
};

export default function LeaveRecommendations({ recommendations }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const topRecommendations = useMemo(() => {
    return recommendations.slice(0, 8);
  }, [recommendations]);

  const formatDateRange = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const formatter = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
    });

    const yearFormatter = new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
    });

    return `${formatter.format(start)} - ${formatter.format(end)} ${yearFormatter.format(end)}`;
  };

  const getSavingsBadge = (rec: LeaveRecommendation) => {
    const ratio = rec.totalDays / Math.max(rec.leaveDaysNeeded, 1);
    if (ratio >= 4) {
      return {
        label: "Sangat Hemat",
        classes: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60",
      };
    }
    if (ratio >= 2.5) {
      return {
        label: "Hemat Cuti",
        classes: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60",
      };
    }
    return {
      label: "Cukup Baik",
      classes: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700",
    };
  };

  if (recommendations.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Belum ada rekomendasi cuti yang tersedia untuk tahun ini.
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Intro Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300">
          <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.516 0c.85.493 1.508 1.333 1.508 2.316V18" />
          </svg>
          <span>Panduan Rencana Liburan</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Tips Libur Hemat Cuti
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-normal">
          Manfaatkan posisi hari libur resmi dan akhir pekan untuk menikmati istirahat panjang dengan hanya menggunakan sedikit jatah cuti kerja.
        </p>
      </div>

      {/* Cards List */}
      <div className="grid gap-4 md:grid-cols-2">
        {topRecommendations.map((rec) => {
          const isExpanded = expandedId === rec.id;
          const badge = getSavingsBadge(rec);

          return (
            <article
              key={rec.id}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 transition-colors flex flex-col justify-between"
            >
              <div>
                {/* Top Badge & Date range */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded ${badge.classes}`}>
                    {badge.label}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
                    {formatDateRange(rec.startDate, rec.endDate)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
                  {rec.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  {rec.description}
                </p>

                {/* Stat Metrics Pill */}
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  <div className="p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-800/40 text-center">
                    <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {rec.totalDays} Hari
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Total Hari Libur
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-800/40 text-center">
                    <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {rec.leaveDaysNeeded} Hari
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Pakai Cuti Kerja
                    </div>
                  </div>
                </div>
              </div>

              {/* Toggle Detail Button */}
              <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-3">
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                  className="w-full flex items-center justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  <span>{isExpanded ? "Sembunyikan Rincian Tanggal" : "Lihat Rincian Tanggal"}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {/* Expanded Details List */}
                {isExpanded && (
                  <div className="mt-3 space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                    {rec.dates.map((item) => {
                      const dayDate = new Date(item.date);
                      const dayFormatter = new Intl.DateTimeFormat("id-ID", {
                        day: "numeric",
                        month: "short",
                      });

                      let tagText = "Hari Kerja";
                      let tagClass = "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";

                      if (item.type === "holiday") {
                        tagText = "Libur Nasional";
                        tagClass = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60";
                      } else if (item.type === "joint-leave") {
                        tagText = "Cuti Bersama";
                        tagClass = "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60";
                      } else if (item.type === "weekend") {
                        tagText = "Akhir Pekan";
                        tagClass = "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
                      } else if (item.type === "personal-leave") {
                        tagText = "Ambil Cuti";
                        tagClass = "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 font-medium";
                      }

                      return (
                        <div
                          key={item.date}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded bg-zinc-50/70 dark:bg-zinc-800/30"
                        >
                          <span className="font-normal text-zinc-700 dark:text-zinc-300">
                            {item.dayName}, {dayFormatter.format(dayDate)}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded ${tagClass}`}>
                            {tagText}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
