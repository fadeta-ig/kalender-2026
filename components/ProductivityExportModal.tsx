"use client";

import { useState, useEffect } from "react";
import type { Holiday, SupportedYear } from "@/data/holidays";
import {
  generateNotionCSV,
  generateGoogleSheetsCSV,
  generateObsidianMarkdown,
  downloadFile,
} from "@/lib/productivityExport";

type ProductivityExportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  year: SupportedYear;
  holidays: Holiday[];
  jointLeave: Holiday[];
};

type ExportTab = "notion" | "sheets" | "obsidian";

export default function ProductivityExportModal({
  isOpen,
  onClose,
  year,
  holidays,
  jointLeave,
}: ProductivityExportModalProps) {
  const [activeTab, setActiveTab] = useState<ExportTab>("notion");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownloadNotion = () => {
    const csv = generateNotionCSV(year, holidays, jointLeave);
    downloadFile(csv, `Kalender_Indonesia_${year}_Notion.csv`);
  };

  const handleDownloadSheets = () => {
    const csv = generateGoogleSheetsCSV(year, holidays, jointLeave);
    downloadFile(csv, `Kalender_Indonesia_${year}_Sheets.csv`);
  };

  const handleCopyMarkdown = async () => {
    const md = generateObsidianMarkdown(year, holidays, jointLeave);
    try {
      await navigator.clipboard.writeText(md);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-export-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/60 backdrop-blur-sm animate-fade-in"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-label="Tutup dialog ekspor"
      />

      <div className="relative w-full max-w-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            <h2
              id="modal-export-title"
              className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-tight truncate"
            >
              Ekspor Data Produktivitas
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              Format data kalender resmi {year} siap pakai untuk Notion, Google Sheets, &amp; Obsidian
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
            aria-label="Tutup dialog"
          >
            <svg className="w-5 h-5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Pemilih Format */}
        <div className="px-4 sm:px-5 pt-3 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/30 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("notion")}
            className={`pb-2.5 px-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "notion"
                ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <span>Notion Database</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              CSV
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sheets")}
            className={`pb-2.5 px-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "sheets"
                ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <span>Google Sheets &amp; Excel</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              UTF-8
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("obsidian")}
            className={`pb-2.5 px-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "obsidian"
                ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <span>Obsidian &amp; Markdown</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              Tabel MD
            </span>
          </button>
        </div>

        {/* Konten Tab Interaktif */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: NOTION */}
          {activeTab === "notion" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 space-y-2">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  Panduan Impor Notion 3 Langkah
                </h4>
                <ol className="text-xs text-zinc-600 dark:text-zinc-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>Unduh berkas CSV terstruktur menggunakan tombol di bawah ini.</li>
                  <li>Buka Notion, buat halaman baru, lalu pilih tipe <code className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-[11px]">Database - Full page</code>.</li>
                  <li>Klik menu titik tiga (<code className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-[11px]">...</code>) di kanan atas, pilih <strong className="text-zinc-900 dark:text-zinc-100">Merge with CSV</strong>, lalu pilih file ini.</li>
                </ol>
              </div>

              <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300 block">Properti Otomatis yang Terbentuk:</span>
                <p>Nama Agenda (Title), Tanggal Mulai/Selesai (Date), Kategori (Select), Hari (Text), Kuartal (Select), Ketetapan Regulasi (Text).</p>
              </div>

              <button
                type="button"
                onClick={handleDownloadNotion}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <svg className="w-4 h-4 pointer-events-none shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span>Unduh Berkas Notion CSV ({year})</span>
              </button>
            </div>
          )}

          {/* TAB 2: GOOGLE SHEETS & EXCEL */}
          {activeTab === "sheets" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 space-y-2">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  Kompatibilitas Standar UTF-8 BOM
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Berkas ini telah disematkan tanda pengenal Byte Order Mark (BOM). Anda dapat langsung membuka berkas dengan double-click di Microsoft Excel tanpa masalah teks berantakan, atau mengunggahnya ke Google Sheets melalui menu <strong className="text-zinc-900 dark:text-zinc-100">File &rarr; Import</strong>.
                </p>
              </div>

              <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300 block">Isi Kolom Data:</span>
                <p>24+ baris agenda resmi SKB 3 Menteri lengkap dengan pemilahan kuartal (Q1–Q4) dan status hari kerja vs akhir pekan.</p>
              </div>

              <button
                type="button"
                onClick={handleDownloadSheets}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <svg className="w-4 h-4 pointer-events-none shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span>Unduh Berkas Google Sheets / Excel CSV ({year})</span>
              </button>
            </div>
          )}

          {/* TAB 3: OBSIDIAN & MARKDOWN */}
          {activeTab === "obsidian" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Pratinjau Tabel Markdown
                  </span>
                  <span className="text-[10px] text-zinc-400">Siap salin ke Daily Notes</span>
                </div>
                <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-950 font-mono text-[11px] text-zinc-700 dark:text-zinc-300 max-h-36 overflow-y-auto whitespace-pre leading-snug select-all">
                  {generateObsidianMarkdown(year, holidays, jointLeave).slice(0, 450)}...
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyMarkdown}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                  isCopied
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
              >
                {isCopied ? (
                  <>
                    <svg className="w-4 h-4 pointer-events-none shrink-0 text-emerald-400 dark:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Tersalin ke Clipboard!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 pointer-events-none shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                    <span>Salin Seluruh Tabel Markdown</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-950/60 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
          <span>Format terstandardisasi SKB 3 Menteri</span>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
