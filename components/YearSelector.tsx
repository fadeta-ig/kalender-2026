"use client";

import type { SupportedYear } from "@/data/holidays";

type YearSelectorProps = {
  selectedYear: SupportedYear;
  onSelectYear: (year: SupportedYear) => void;
};

export default function YearSelector({
  selectedYear,
  onSelectYear,
}: YearSelectorProps) {
  const years: { year: SupportedYear; label: string; badge?: string }[] = [
    { year: 2026, label: "Tahun 2026", badge: "Berjalan" },
    { year: 2027, label: "Tahun 2027", badge: "SKB Resmi" },
  ];

  return (
    <div className="flex justify-center items-center">
      <div className="glass-strong rounded-2xl p-1.5 inline-flex gap-2 relative shadow-2xl border border-white/20">
        {years.map((item) => {
          const isActive = selectedYear === item.year;
          return (
            <button
              key={item.year}
              type="button"
              onClick={() => onSelectYear(item.year)}
              className={`relative px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 flex items-center gap-2.5 ${
                isActive
                  ? "bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-sky-500/25 scale-[1.02]"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-full transition-colors ${
                    isActive
                      ? "bg-white/25 text-white ring-1 ring-white/30"
                      : "bg-white/10 text-slate-400 group-hover:text-slate-200"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
