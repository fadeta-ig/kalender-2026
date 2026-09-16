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
  const options: { year: SupportedYear; title: string; subtitle: string }[] = [
    { year: 2026, title: "Tahun 2026", subtitle: "Tahun Berjalan" },
    { year: 2027, title: "Tahun 2027", subtitle: "Resmi SKB Terbaru" },
  ];

  return (
    <div className="flex justify-center">
      <div className="inline-flex rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-1">
        {options.map((item) => {
          const isSelected = selectedYear === item.year;
          return (
            <button
              key={item.year}
              type="button"
              onClick={() => onSelectYear(item.year)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                isSelected
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200/90 dark:border-zinc-700/90"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <span>{item.title}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-normal ${
                  isSelected
                    ? "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                    : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                {item.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
