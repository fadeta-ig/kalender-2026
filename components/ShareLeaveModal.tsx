"use client";

import { useState } from "react";

export type ShareLeavePlanData = {
  year: number;
  title: string;
  totalDaysOff: number;
  usedQuota: number;
  datesDescription: string;
  shareUrl: string;
};

type ShareLeaveModalProps = {
  isOpen: boolean;
  planData: ShareLeavePlanData;
  onClose: () => void;
};

export default function ShareLeaveModal({
  isOpen,
  planData,
  onClose,
}: ShareLeaveModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const viralMessage = `🏖️ Ini loh rencana libur & cuti panjangku di tahun ${planData.year}! Cuma pakai ${planData.usedQuota} hari cuti, bisa dapet ${planData.totalDaysOff} hari libur beruntun (${planData.datesDescription}). Yuk cek jadwalnya dan agendakan liburan bareng: ${planData.shareUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(planData.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback manual copy
      const textArea = document.createElement("textarea");
      textArea.value = planData.shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(viralMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(viralMessage)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(planData.shareUrl)}&text=${encodeURIComponent(viralMessage)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 text-zinc-900 dark:text-zinc-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-start justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 shrink-0">
              <svg className="w-5 h-5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 truncate">
                Bagikan Rencana Cuti
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                Ajak teman kantor atau keluarga liburan bareng {planData.year}.
              </p>
            </div>
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

        {/* Visual Preview Card: "Ini Loh Rencana Cuti Saya" */}
        <div className="rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50/70 via-white to-zinc-50 dark:from-emerald-950/30 dark:via-zinc-900 dark:to-zinc-950 p-4 space-y-2.5 relative overflow-hidden shadow-inner">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <span className="flex items-center gap-1.5">
              <span>✈️</span>
              <span>Rencana Libur {planData.year}</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-[11px]">
              {planData.totalDaysOff} Hari Libur
            </span>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 break-words">
              {planData.title}
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 break-words">
              Periode: <strong className="text-zinc-800 dark:text-zinc-200">{planData.datesDescription}</strong>
            </p>
          </div>

          <div className="pt-2 border-t border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">
              Pakai cuti: <strong className="text-zinc-800 dark:text-zinc-200">{planData.usedQuota} Hari</strong>
            </span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              Hemat Cuti!
            </span>
          </div>
        </div>

        {/* Pesan Teks Siap Kirim */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Pratinjau Pesan yang Dikirim:
          </label>
          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 font-mono leading-relaxed max-h-20 overflow-y-auto break-words">
            {viralMessage}
          </div>
        </div>

        {/* Action Buttons: WhatsApp, Telegram, X & Copy */}
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all hover:shadow"
            >
              <svg className="w-4 h-4 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.3-.778.98-.954 1.18-.176.2-.352.226-.653.076-.301-.15-1.272-.469-2.424-1.496-.897-.799-1.503-1.787-1.68-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.3-.502.101-.2.05-.376-.025-.527-.075-.15-.678-1.635-.93-2.242-.244-.59-.493-.51-.678-.52l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.511 1.079 2.912 1.23 3.113c.15.2 2.124 3.243 5.146 4.549.719.311 1.28.497 1.718.637.723.23 1.38.198 1.9.12.58-.087 1.78-.727 2.03-1.429.252-.702.252-1.304.177-1.43-.075-.125-.276-.2-.577-.35zM12.042 21.82a9.78 9.78 0 01-4.992-1.365l-.358-.213-3.711.973.99-3.616-.233-.371A9.784 9.784 0 012.25 12.04c0-5.399 4.393-9.792 9.792-9.792 2.616 0 5.075 1.02 6.924 2.871a9.73 9.73 0 012.874 6.924c0 5.4-4.394 9.792-9.798 9.792z"/>
              </svg>
              <span>Kirim via WhatsApp</span>
            </a>

            {/* Telegram */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-sm transition-all hover:shadow"
            >
              <svg className="w-4 h-4 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
              <span>Kirim via Telegram</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Salin Tautan (Copy Link) */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-medium transition-colors"
            >
              <svg className="w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              <span>{copied ? "Tautan Tersalin!" : "Salin Tautan"}</span>
            </button>

            {/* Salin Teks Lengkap */}
            <button
              type="button"
              onClick={handleCopyText}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-medium transition-colors"
            >
              <svg className="w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
              </svg>
              <span>Salin Teks Pesan</span>
            </button>
          </div>
        </div>

        {copied && (
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-center text-xs font-medium text-emerald-700 dark:text-emerald-300 animate-fade-in">
            ✓ Berhasil disalin ke clipboard! Siap ditempelkan ke WhatsApp atau media sosial.
          </div>
        )}
      </div>
    </div>
  );
}
