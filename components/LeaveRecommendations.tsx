"use client";

import { useMemo, useState } from "react";
import type { LeaveRecommendation } from "@/lib/leaveRecommendation";

type Props = {
  recommendations: LeaveRecommendation[];
};

export default function LeaveRecommendations({ recommendations }: Props) {
  const [selectedRec, setSelectedRec] = useState<LeaveRecommendation | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const topRecommendations = useMemo(() => {
    return recommendations.slice(0, 6);
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

  const getEfficiencyColor = (efficiency: number): string => {
    if (efficiency >= 3) return "text-emerald-400";
    if (efficiency >= 2) return "text-sky-400";
    return "text-purple-400";
  };

  const getEfficiencyLabel = (efficiency: number): string => {
    if (efficiency >= 3) return "Sangat Efisien";
    if (efficiency >= 2) return "Efisien";
    return "Baik";
  };

  if (recommendations.length === 0) {
    return (
      <section className="glass-strong rounded-3xl p-8 text-center animate-scale-in">
        <p className="text-slate-300">Tidak ada rekomendasi cuti tersedia.</p>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4 animate-slide-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
          </span>
          <span className="text-sm font-semibold text-sky-300 uppercase tracking-wider">
            AI Recommendations
          </span>
        </div>
        <h2 className="text-3xl font-bold lg:text-4xl gradient-text">
          Rekomendasi Cuti Optimal
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Algoritma AI kami menganalisis pola libur nasional dan cuti bersama untuk menemukan
          peluang terbaik mendapatkan libur panjang dengan cuti minimal.
        </p>
      </div>

      {/* Top 3 Highlights */}
      <div className="grid gap-6 md:grid-cols-3">
        {topRecommendations.slice(0, 3).map((rec, index) => (
          <article
            key={rec.id}
            className="glass-strong rounded-2xl p-6 hover-lift cursor-pointer animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setSelectedRec(rec)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-purple-600 text-white font-bold text-sm">
                  {index + 1}
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wider ${getEfficiencyColor(rec.efficiency)}`}>
                  {getEfficiencyLabel(rec.efficiency)}
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{rec.totalDays}</div>
                <div className="text-xs text-slate-400 uppercase">Hari Libur</div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
              {rec.title}
            </h3>

            <p className="text-sm text-slate-300 mb-4 line-clamp-2">
              {rec.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="text-center">
                <div className="text-xl font-bold text-sky-400">{rec.leaveDaysNeeded}</div>
                <div className="text-xs text-slate-400">Cuti Diperlukan</div>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-xl font-bold text-emerald-400">{rec.efficiency.toFixed(1)}x</div>
                <div className="text-xs text-slate-400">Efisiensi</div>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-400">{rec.savings}</div>
                <div className="text-xs text-slate-400">Hemat</div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* All Recommendations List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="flex h-1.5 w-1.5 rounded-full bg-sky-400"></span>
          Semua Rekomendasi
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {topRecommendations.map((rec, index) => {
            const isExpanded = expandedId === rec.id;

            return (
              <article
                key={rec.id}
                className="glass-card rounded-2xl overflow-hidden hover-lift transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-base font-semibold text-white mb-1 pr-4">
                        {rec.title}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {formatDateRange(rec.startDate, rec.endDate)}
                      </p>
                    </div>
                    <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-sky-400"></div>
                      <span className="text-sky-300 font-semibold">{rec.totalDays} hari</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      <span className="text-purple-300 font-semibold">{rec.leaveDaysNeeded} cuti</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      <span className={`font-semibold ${getEfficiencyColor(rec.efficiency)}`}>
                        {rec.efficiency.toFixed(1)}x
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-white/10 space-y-3 animate-slide-up">
                    <p className="text-sm text-slate-300">
                      {rec.description}
                    </p>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {rec.dates.map((date, i) => {
                        const dayDate = new Date(date.date);
                        const dayFormatter = new Intl.DateTimeFormat("id-ID", {
                          day: "numeric",
                          month: "short",
                        });

                        const typeColors = {
                          weekend: "bg-slate-700 text-slate-300",
                          holiday: "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40",
                          "joint-leave": "bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/40",
                          "personal-leave": "bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/40",
                        };

                        const typeLabels = {
                          weekend: "Weekend",
                          holiday: "Libur Nasional",
                          "joint-leave": "Cuti Bersama",
                          "personal-leave": "Ambil Cuti",
                        };

                        return (
                          <div
                            key={`${rec.id}-${date.date}`}
                            className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 font-medium w-20">
                                {dayFormatter.format(dayDate)}
                              </span>
                              <span className="text-slate-300">
                                {date.dayName}
                              </span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[date.type]}`}>
                              {typeLabels[date.type]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="glass-strong rounded-2xl p-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Quick Insights
        </h3>
        <div className="grid gap-4 sm:grid-cols-3 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-sky-400">
              {recommendations[0]?.totalDays || 0}
            </div>
            <div className="text-sm text-slate-300">Libur Terpanjang</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-emerald-400">
              {recommendations[0]?.efficiency.toFixed(1) || 0}x
            </div>
            <div className="text-sm text-slate-300">Efisiensi Terbaik</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-purple-400">
              {recommendations.slice(0, 3).reduce((sum, rec) => sum + rec.leaveDaysNeeded, 0)}
            </div>
            <div className="text-sm text-slate-300">Total Cuti Optimal (Top 3)</div>
          </div>
        </div>
      </div>
    </section>
  );
}
