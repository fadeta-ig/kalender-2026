import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://calendar.gandivalabs.my.id"),
  title: {
    default: "Kalender 2027 Indonesia Lengkap Libur Nasional, Rekomendasi Cuti & Kalender Jawa | Gandiva Labs",
    template: "%s | Kalender Gandiva Labs",
  },
  description:
    "Kalender 2027 resmi Indonesia berdasarkan SKB 3 Menteri. Cek daftar 18 hari libur nasional, 8 cuti bersama, strategi rekomendasi cuti hemat (long weekend), serta penanggalan Jawa (weton & pasaran) dan Hijriah.",
  keywords: [
    "kalender 2027",
    "rekomendasi cuti 2027",
    "kalender jawa 2027",
    "hari libur nasional 2027",
    "cuti bersama 2027",
    "skb 3 menteri 2027",
    "weton jawa 2027",
    "pasaran jawa 2027",
    "long weekend 2027",
    "kalender indonesia 2027",
    "unduh kalender 2027 pdf",
    "gandiva labs",
  ],
  authors: [{ name: "Gandiva Labs", url: "https://calendar.gandivalabs.my.id" }],
  creator: "Gandiva Labs",
  publisher: "Gandiva Labs",
  alternates: {
    canonical: "https://calendar.gandivalabs.my.id",
  },
  openGraph: {
    title: "Kalender 2027 Indonesia Lengkap Libur Nasional, Rekomendasi Cuti & Kalender Jawa",
    description:
      "Jadwal resmi hari libur nasional dan cuti bersama 2027 SKB 3 Menteri, panduan rekomendasi cuti hemat tahunan, penanggalan Jawa (weton & pasaran), serta ekspor PDF.",
    url: "https://calendar.gandivalabs.my.id",
    siteName: "Kalender Gandiva Labs",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/favicon-512.png",
        width: 512,
        height: 512,
        alt: "Kalender 2027 Indonesia Resmi Gandiva Labs",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Kalender 2027 Indonesia Lengkap Libur Nasional & Rekomendasi Cuti",
    description:
      "Jadwal resmi hari libur nasional dan cuti bersama 2027 SKB 3 Menteri, panduan cuti hemat, dan penanggalan Jawa.",
    images: ["/favicon-512.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://calendar.gandivalabs.my.id/#website",
      "url": "https://calendar.gandivalabs.my.id",
      "name": "Kalender Resmi Indonesia 2027 & 2026 - Gandiva Labs",
      "description":
        "Kalender resmi Indonesia 2027 dan 2026 SKB 3 Menteri, rekomendasi cuti hemat, kalender Jawa weton pasaran, dan unduh PDF.",
      "publisher": {
        "@id": "https://calendar.gandivalabs.my.id/#organization",
      },
      "inLanguage": "id-ID",
    },
    {
      "@type": "Organization",
      "@id": "https://calendar.gandivalabs.my.id/#organization",
      "name": "Gandiva Labs",
      "url": "https://calendar.gandivalabs.my.id",
      "logo": "https://calendar.gandivalabs.my.id/gandiva-mark-dark.webp",
      "sameAs": [
        "https://www.instagram.com/gandivalabs/",
        "https://www.threads.com/@gandivalabs",
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://calendar.gandivalabs.my.id/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Beranda",
          "item": "https://calendar.gandivalabs.my.id",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Kalender 2027",
          "item": "https://calendar.gandivalabs.my.id/#kalender-2027",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Rekomendasi Cuti 2027",
          "item": "https://calendar.gandivalabs.my.id/#rekomendasi-cuti",
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Kalender Jawa 2027",
          "item": "https://calendar.gandivalabs.my.id/#kalender-jawa",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://calendar.gandivalabs.my.id/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Kapan jadwal Hari Raya Idulfitri 2027 dan berapa hari liburnya?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Berdasarkan rilis SKB 3 Menteri, Hari Raya Idulfitri 1448 H jatuh pada Rabu dan Kamis, 10-11 Maret 2027. Bersama dengan Cuti Bersama pada tanggal 9, 12, dan 15 Maret 2027 serta Hari Suci Nyepi pada 8 Maret 2027, masyarakat berkesempatan menikmati libur panjang berturut-turut hingga 10 hari (6-15 Maret 2027).",
          },
        },
        {
          "@type": "Question",
          "name": "Bagaimana strategi rekomendasi cuti 2027 agar dapat libur panjang hemat?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Manfaatkan hari kejepit (harpitnas) di sekitar hari libur nasional. Contohnya, ambil 1 hari cuti pada Jumat 7 Mei 2027 (setelah Kenaikan Yesus Kristus) untuk mendapatkan 4 hari libur, atau ambil 1 hari cuti pada Jumat 21 Mei 2027 (antara Waisak dan akhir pekan) untuk mendapatkan libur maraton 9 hari bersama Iduladha.",
          },
        },
        {
          "@type": "Question",
          "name": "Apakah Kalender 2027 ini menyediakan penanggalan Jawa (weton dan pasaran)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Ya, aplikasi Kalender 2027 Gandiva Labs dilengkapi penanggalan budaya Jawa dengan siklus Panca Wara lengkap: Legi, Pahing, Pon, Wage, dan Kliwon, serta padanan tanggal lunar kalender Hijriah 1448-1449 H.",
          },
        },
        {
          "@type": "Question",
          "name": "Berapa jumlah hari libur nasional dan cuti bersama tahun 2027 menurut SKB 3 Menteri?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Total terdapat 18 hari libur nasional dan 8 hari cuti bersama resmi sesuai Surat Keputusan Bersama (SKB) Menteri Agama, Menteri Ketenagakerjaan, dan Menteri PANRB No. 1205/2026, No. 3/2026, No. 2/2026.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={instrumentSans.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdData),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('theme');
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 min-h-screen transition-colors duration-150">
        {children}
      </body>
    </html>
  );
}
