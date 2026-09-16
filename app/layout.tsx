import type { Metadata } from "next";
import "./globals.css";

// Import font Inter Variable agar aktif
import "@fontsource-variable/inter";

export const metadata: Metadata = {
  title: "Kalender Resmi Indonesia 2026 - 2027 | SKB 3 Menteri",
  description:
    "Daftar resmi libur nasional dan cuti bersama 2026 - 2027 sesuai SKB 3 Menteri Republik Indonesia dilengkapi AI rekomendasi cuti optimal dan ekspor PDF.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
