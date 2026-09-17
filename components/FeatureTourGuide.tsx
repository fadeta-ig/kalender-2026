"use client";

import { useEffect, useState, useCallback, useRef } from "react";

export type TourStep = {
  targetId: string;
  title: string;
  description: string;
  badge: string;
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
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  onGoToStep: (index: number) => void;
  steps?: TourStep[];
};

type RectCoords = {
  x: number;
  y: number;
  width: number;
  height: number;
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
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const activeStep = steps[currentStep] || steps[0];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const progressPercent = Math.round(((currentStep + 1) / steps.length) * 100);

  // Ukur posisi elemen target
  const updateTargetRect = useCallback(() => {
    if (!isOpen || !activeStep) return;

    const el = document.getElementById(activeStep.targetId);
    if (el) {
      const rect = el.getBoundingClientRect();
      // Tambahkan margin padding di sekitar elemen target
      const padX = 6;
      const padY = 5;
      setSpotlightRect({
        x: Math.max(0, rect.left - padX),
        y: Math.max(0, rect.top - padY),
        width: rect.width + padX * 2,
        height: rect.height + padY * 2,
      });
    } else {
      // Fallback jika elemen belum ada di DOM (misal pada viewport tertentu)
      setSpotlightRect({
        x: Math.max(20, (window.innerWidth - 300) / 2),
        y: 80,
        width: 300,
        height: 48,
      });
    }
  }, [isOpen, activeStep]);

  // Deteksi ukuran layar mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll target ke tampilan saat langkah berganti
  useEffect(() => {
    if (!isOpen || !activeStep) return;

    const el = document.getElementById(activeStep.targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      // Berikan jeda setelah animasi scroll selesai sebelum menghitung bounding rect
      const timer = setTimeout(() => {
        updateTargetRect();
      }, 350);
      return () => clearTimeout(timer);
    } else {
      updateTargetRect();
    }
  }, [isOpen, currentStep, activeStep, updateTargetRect]);

  // Listener scroll & resize untuk menjaga posisi spotlight tetap sinkron
  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updateTargetRect();
    };

    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, updateTargetRect]);

  // Keyboard navigation: Panah kanan / Enter (Next), Panah kiri (Prev), Escape (Close)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        onNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onNext, onPrev, onClose]);

  if (!isOpen || !spotlightRect) return null;

  // Kalkulasi posisi kartu floating di layar Desktop (>= 640px)
  const cardWidth = 380;
  const cardMargin = 16;
  let desktopTop = spotlightRect.y + spotlightRect.height + cardMargin;
  // Jika tidak cukup ruang di bawah, tempatkan di atas elemen
  if (desktopTop + 240 > window.innerHeight) {
    desktopTop = Math.max(cardMargin, spotlightRect.y - 250 - cardMargin);
  }

  let desktopLeft = spotlightRect.x + spotlightRect.width / 2 - cardWidth / 2;
  desktopLeft = Math.max(cardMargin, Math.min(window.innerWidth - cardWidth - cardMargin, desktopLeft));

  return (
    <aside aria-label="Panduan Fitur Kalender" className="fixed inset-0 z-50 overflow-hidden">
      {/* 1. Backdrop Gelap dengan Lubang Spotlight SVG (Smooth Transition) */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none transition-all duration-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="tour-spotlight-mask">
            {/* Area putih = tetap gelap */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Area hitam = lubang transparan tembus pandang */}
            <rect
              x={spotlightRect.x}
              y={spotlightRect.y}
              width={spotlightRect.width}
              height={spotlightRect.height}
              rx="12"
              ry="12"
              fill="black"
              className="transition-all duration-300 ease-out"
            />
          </mask>
        </defs>
        {/* Layer latar belakang penutup yang dipotong oleh mask */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(10, 10, 12, 0.65)"
          mask="url(#tour-spotlight-mask)"
          className="pointer-events-auto cursor-pointer"
          onClick={onClose}
          aria-label="Tutup panduan"
        />
      </svg>

      {/* 2. Cincin Pulsing Emerald di Sekeliling Target */}
      <div
        style={{
          position: "fixed",
          left: `${spotlightRect.x - 3}px`,
          top: `${spotlightRect.y - 3}px`,
          width: `${spotlightRect.width + 6}px`,
          height: `${spotlightRect.height + 6}px`,
          borderRadius: "14px",
        }}
        className="pointer-events-none border-2 border-emerald-500/90 shadow-[0_0_24px_rgba(16,185,129,0.35)] transition-all duration-300 ease-out z-50 animate-pulse"
      />

      {/* 3. Kartu Dialog Interaktif (Desktop: Dynamic Floating Popover, Mobile: Bottom Sheet) */}
      <div
        ref={cardRef}
        style={
          isMobile
            ? undefined
            : {
                position: "fixed",
                top: `${desktopTop}px`,
                left: `${desktopLeft}px`,
                width: `${cardWidth}px`,
              }
        }
        className={
          isMobile
            ? "fixed bottom-3 left-3 right-3 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ease-out p-4 sm:p-5"
            : "fixed z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ease-out p-5"
        }
      >
        {/* Micro Progress Bar di Puncak Kartu */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Header Kartu: Kategori & Tombol Tutup */}
        <div className="flex items-center justify-between gap-2 pt-1 pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 truncate">
              {activeStep.badge}
            </span>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
              Langkah {currentStep + 1} dari {steps.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
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

        {/* Footer: Step Dots & Tombol Aksi */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-zinc-100 dark:border-zinc-800/80">
          {/* Tombol Lewati */}
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 font-medium transition-colors"
          >
            Lewati
          </button>

          {/* Indikator Titik Step */}
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
              onClick={onNext}
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
