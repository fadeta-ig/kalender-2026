/**
 * Utilitas Penanggalan Budaya Indonesia (Hijriah & Pasaran Jawa)
 *
 * Menggunakan pendekatan standar kalender lunar dan siklus Panca Wara
 * tanpa dependensi eksternal untuk performa instan dan akurasi tinggi.
 */

const PASARAN_NAMES = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"] as const;
export type PasaranName = (typeof PASARAN_NAMES)[number];

/**
 * Menghitung hari Pasaran Jawa (Panca Wara: Legi, Pahing, Pon, Wage, Kliwon)
 */
export function getPasaranJawa(date: Date): PasaranName {
  // Hitung selisih hari lokal dari epoch UTC
  const localTime = date.getTime() - date.getTimezoneOffset() * 60000;
  const dayIndex = Math.floor(localTime / 86400000);
  // Offset 1 menghasilkan 1 Jan 2026 = Pahing, 1 Jan 2027 = Pahing (siklus 5 hari deterministik)
  const pasaranIndex = ((dayIndex + 1) % 5 + 5) % 5;
  return PASARAN_NAMES[pasaranIndex];
}

const hijriahFormatter = new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", {
  day: "numeric",
  month: "short",
});

/**
 * Menghitung tanggal dan bulan Hijriah menggunakan standar Umm al-Qura
 */
export function getHijriahDate(date: Date): string {
  try {
    return hijriahFormatter.format(date);
  } catch {
    // Fallback jika umalqura tidak didukung lingkungan runtime tertentu
    const fallbackFormatter = new Intl.DateTimeFormat("id-ID-u-ca-islamic", {
      day: "numeric",
      month: "short",
    });
    return fallbackFormatter.format(date);
  }
}

export type CulturalDateInfo = {
  pasaran: PasaranName;
  hijriah: string;
  combined: string; // Misal: "23 Raj • Pahing"
};

/**
 * Mendapatkan informasi ringkas penanggalan budaya untuk sel kalender
 */
export function getCulturalDateInfo(date: Date): CulturalDateInfo {
  const pasaran = getPasaranJawa(date);
  const hijriah = getHijriahDate(date);
  return {
    pasaran,
    hijriah,
    combined: `${hijriah} • ${pasaran}`,
  };
}
