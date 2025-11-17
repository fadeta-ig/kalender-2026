import type { Metadata } from "next";
import "./globals.css";

// Import font Inter Variable agar aktif
import "@fontsource-variable/inter";

export const metadata: Metadata = {
  title: "Kalender 2026 Indonesia",
  description: "Kalender 2026 dengan AI rekomendasi cuti panjang",
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
