"use client";

import { useEffect, useState, useCallback, useRef } from "react";

export type TourStep = {
  targetId: string;
  badge: string;
  title: string;
  description: string;
};

export const TOUR_STEPS: TourStep[] = [
  {
    targetId: "tour-year-selector",
    badge: "Tahun & Regulasi",
    title: "Ketetapan Resmi SKB 3 Menteri",
    description:
      "Beralih antara Kalender 2026 dan 2027. Seluruh tanggal merah dan cuti bersama mengacu pada keputusan resmi pemerintah Republik Indonesia.",
  },
  {
    targetId: "tour-month-nav",
    badge: "Navigasi Kalender",
    title: "Lompat Bulan Cepat (1-Tap)",
    description:
      "Gunakan tombol pemilih bulan untuk fokus ke satu bulan spesifik atau menampilkan kembali seluruh 12 bulan secara bersamaan.",
  },
  {
    targetId: "tour-cultural-toggle",
    badge: "Overlay Kultural",
    title: "Penanggalan Jawa & Hijriah",
    description:
      "Aktifkan fitur ini untuk menampilkan siklus 5 pasaran Jawa (Legi, Pahing, Pon, Wage, Kliwon), nilai neptu, serta tanggal Hijriah.",
  },
  {
    targetId: "tour-tab-tips",
    badge: "Simulasi Cuti",
    title: "Smart Leave Planner & Harpitnas",
    description:
      "Tentukan batas kuota cuti tahunan Anda untuk menghitung rekomendasi libur panjang maksimal dengan memanfaatkan hari kejepit nasional.",
  },
  {
    targetId: "tour-sync-btn",
    badge: "Integrasi Perangkat",
    title: "Sinkronisasi & Ekspor Kalender",
    description:
      "Tambahkan seluruh jadwal libur resmi langsung ke Google Calendar, Apple iCal, Microsoft Outlook, atau unduh kalender PDF cetak.",
  },
];

type FeatureTourGuideProps = {
  isOpen: boolean;
  currentStep: number;
  onNext: (dontShowAgain?: boolean) => void;
  onPrev: () => void;
  onClose: (dontShowAgain?: boolean) => void;
  onGoToStep: (index: number) => void;
  steps?: TourStep[];
};

type RectCoords = {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
};

export default function FeatureTourGuide({
  isOpen,
  currentStep,
  onNext,
  onPrev,
  onClose,
  onGoToStep,
  steps = TOUR_STEPS,
}: FeatureTourGuideProps) {
  const [spotlightRect, setSpotlightRect] = useState<RectCoords | null>(null);
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");
  const [cardPos, setCardPos] = useState<{ top: number; left: number; arrowLeft: number } | null>(null);
  const [dontShowAgain, setDontShowAgain] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  const activeStep = steps[currentStep] || steps[0];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const progressPercent = Math.round(((currentStep + 1) / steps.length) * 100);

  // Kalkulasi koordinat spotlight dan posisi kartu popover floating
  const updatePosition = useCallback(() => {
    if (!isOpen || !activeStep) return;

    const el = document.getElementById(activeStep.targetId);
    if (!el) {
      // Fallback jika elemen target tidak ditemukan
      const fallbackW = Math.min(320, window.innerWidth - 32);
      const fallbackH = 48;
      const fallbackX = (window.innerWidth - fallbackW) / 2;
      const fallbackY = 90;
      setSpotlightRect({
        x: fallbackX,
        y: fallbackY,
        width: fallbackW,
        height: fallbackH,
        borderRadius: 12,
      });
      setCardPos({
        top: fallbackY + fallbackH + 14,
        left: (window.innerWidth - 380) / 2,
        arrowLeft: 190,
      });
      setPlacement("bottom");
      return;
    }

    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    const parsedRadius = parseFloat(style.borderRadius) || 12;

    const padX = 6;
    const padY = 5;
    const spotX = Math.max(0, rect.left - padX);
    const spotY = Math.max(0, rect.top - padY);
    const spotW = rect.width + padX * 2;
    const spotH = rect.height + padY * 2;

    setSpotlightRect({
      x: spotX,
      y: spotY,
      width: spotW,
      height: spotH,
      borderRadius: Math.min(parsedRadius + 4, 16),
    });

    const isMobile = window.innerWidth < 640;
    const cardWidth = Math.min(380, window.innerWidth - 32);
    const cardHeight = cardRef.current?.offsetHeight || 230;

    const spaceBelow = window.innerHeight - (spotY + spotH);
    const spaceAbove = spotY;

    let chosenPlacement: "bottom" | "top" = "bottom";
    let top = 0;

    if (isMobile) {
      if (spaceBelow >= cardHeight + 16) {
        chosenPlacement = "bottom";
        top = spotY + spotH + 12;
      } else if (spaceAbove >= cardHeight + 16) {
        chosenPlacement = "top";
        top = Math.max(12, spotY - cardHeight - 12);
      } else {
        chosenPlacement = "bottom";
        top = Math.max(12, window.innerHeight - cardHeight - 12);
      }
    } else {
      if (spaceBelow >= cardHeight + 18) {
        chosenPlacement = "bottom";
        top = spotY + spotH + 12;
      } else if (spaceAbove >= cardHeight + 18) {
        chosenPlacement = "top";
        top = spotY - cardHeight - 12;
      } else {
        chosenPlacement = spaceBelow >= spaceAbove ? "bottom" : "top";
        top = chosenPlacement === "bottom"
          ? Math.min(window.innerHeight - cardHeight - 12, spotY + spotH + 8)
          : Math.max(12, spotY - cardHeight - 8);
      }
    }

    const targetCenterX = spotX + spotW / 2;
    let left = targetCenterX - cardWidth / 2;
    left = Math.max(16, Math.min(window.innerWidth - cardWidth - 16, left));

    const arrowLeft = Math.max(24, Math.min(cardWidth - 24, targetCenterX - left));

    setPlacement(chosenPlacement);
    setCardPos({ top, left, arrowLeft });
  }, [isOpen, activeStep]);

  // Scroll target ke tengah layar dengan animasi mulus saat langkah berganti
  useEffect(() => {
    if (!isOpen || !activeStep) return;

    const el = document.getElementById(activeStep.targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

      updatePosition();
      const t1 = setTimeout(updatePosition, 100);
      const t2 = setTimeout(updatePosition, 250);
      const t3 = setTimeout(updatePosition, 450);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      updatePosition();
    }
  }, [isOpen, currentStep, activeStep, updatePosition]);

  // Listener scroll dan resize untuk sinkronisasi posisi real-time
  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, updatePosition]);

  // Kontrol navigasi keyboard: Panah Kanan / Enter (Lanjut), Panah Kiri (Kembali), Escape (Tutup)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose(dontShowAgain);
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        if (isLastStep) {
          onClose(dontShowAgain);
        } else {
          onNext(dontShowAgain);
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (!isFirstStep) {
          onPrev();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isFirstStep, isLastStep, dontShowAgain, onNext, onPrev, onClose]);

  if (!isOpen || !spotlightRect || !cardPos) return null;

  return (
    <aside aria-label="Panduan Fitur Kalender" className="relative">
      {/* 1. Backdrop Transparan Interaktif (Klik di luar untuk menutup) */}
      <div
        onClick={() => onClose(dontShowAgain)}
        className="fixed inset-0 z-40 bg-transparent cursor-pointer"
        aria-label="Tutup panduan fitur"
      />

      {/* 2. Spotlight Target Box-Shadow Overlay (Solusi Antigravity Bebas Bug SVG) */}
      <div
        style={{
          position: "fixed",
          left: `${spotlightRect.x}px`,
          top: `${spotlightRect.y}px`,
          width: `${spotlightRect.width}px`,
          height: `${spotlightRect.height}px`,
          borderRadius: `${spotlightRect.borderRadius}px`,
          boxShadow:
            "0 0 0 9999px rgba(10, 10, 14, 0.72), 0 0 0 2px rgba(16, 185, 129, 0.9), 0 0 25px rgba(16, 185, 129, 0.35)",
          transition:
            "left 0.35s cubic-bezier(0.16, 1, 0.3, 1), top 0.35s cubic-bezier(0.16, 1, 0.3, 1), width 0.35s cubic-bezier(0.16, 1, 0.3, 1), height 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          zIndex: 45,
        }}
        className="pointer-events-none"
      >
        {/* Radar Beacon Pulse Ring */}
        <div className="absolute -inset-1.5 rounded-[18px] border border-emerald-400/50 animate-ping opacity-35 pointer-events-none" />

        {/* Badge Nomor Langkah Melekat pada Target */}
        <div className="absolute -top-3.5 -right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg pointer-events-none border border-emerald-300 ring-2 ring-black/20">
          {currentStep + 1}/{steps.length}
        </div>
      </div>

      {/* 3. Kartu Dialog Interaktif Dinamis (Mengikuti Posisi Target + Panah Petunjuk) */}
      <div
        ref={cardRef}
        style={{
          position: "fixed",
          top: `${cardPos.top}px`,
          left: `${cardPos.left}px`,
          width: `${Math.min(380, window.innerWidth - 32)}px`,
          transition:
            "top 0.35s cubic-bezier(0.16, 1, 0.3, 1), left 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          zIndex: 50,
        }}
        className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xl rounded-2xl overflow-visible p-4 sm:p-5"
      >
        {/* Panah Petunjuk yang Mengarah Tepat ke Titik Tengah Target */}
        <div
          style={{ left: `${cardPos.arrowLeft}px` }}
          className={`absolute w-3.5 h-3.5 -translate-x-1/2 rotate-45 bg-white dark:bg-zinc-900 border-zinc-200/90 dark:border-zinc-800/90 transition-all duration-300 pointer-events-none ${
            placement === "bottom"
              ? "-top-2 border-t border-l"
              : "-bottom-2 border-b border-r"
          }`}
        />

        {/* Micro Progress Bar di Puncak Kartu */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-100 dark:bg-zinc-800 overflow-hidden rounded-t-2xl">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Header Kartu: Kategori, Indikator Langkah & Tombol Tutup */}
        <div className="flex items-center justify-between gap-2 pt-1 pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800/70 truncate">
                {activeStep.badge}
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
              Langkah {currentStep + 1} dari {steps.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onClose(dontShowAgain)}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
            title="Tutup panduan"
            aria-label="Tutup panduan fitur"
          >
            <svg className="w-4 h-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Konten Utama: Judul & Deskripsi */}
        <div className="py-3 space-y-1.5 min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-snug">
            {activeStep.title}
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed break-words">
            {activeStep.description}
          </p>
        </div>

        {/* Baris Checklist: Jangan Tampilkan Lagi */}
        <div className="pt-2 pb-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
          <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-zinc-300 dark:border-zinc-700 text-emerald-600 focus:ring-emerald-500/30 accent-emerald-600 cursor-pointer"
            />
            <span className="font-medium">Jangan tampilkan lagi</span>
          </label>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 hidden sm:inline">
            Gunakan panah keyboard
          </span>
        </div>

        {/* Footer: Step Dots & Tombol Aksi */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-zinc-100 dark:border-zinc-800/80">
          {/* Tombol Lewati */}
          <button
            type="button"
            onClick={() => onClose(dontShowAgain)}
            className="text-[11px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 font-medium transition-colors"
          >
            Lewati
          </button>

          {/* Indikator Titik Step (Dapat Diklik) */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onGoToStep(idx)}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  idx === currentStep
                    ? "w-4 bg-emerald-500"
                    : "w-1.5 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600"
                }`}
                aria-label={`Buka langkah ${idx + 1}`}
              />
            ))}
          </div>

          {/* Tombol Navigasi: Kembali & Lanjut/Mulai Eksplorasi */}
          <div className="flex items-center gap-1.5">
            {!isFirstStep && (
              <button
                type="button"
                onClick={onPrev}
                className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Kembali
              </button>
            )}
            <button
              type="button"
              onClick={() => (isLastStep ? onClose(dontShowAgain) : onNext(dontShowAgain))}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors shadow-xs"
            >
              {isLastStep ? "Mulai Eksplorasi" : "Lanjut"}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
