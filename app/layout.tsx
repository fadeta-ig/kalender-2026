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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent MetaMask auto-injection errors for non-Web3 apps
              if (typeof window !== 'undefined') {
                // Silence MetaMask connection errors since we don't use it
                const originalError = console.error;
                console.error = function(...args) {
                  const errorMsg = args[0]?.toString() || '';
                  // Filter out MetaMask-related errors
                  if (errorMsg.includes('MetaMask') ||
                      errorMsg.includes('ethereum') ||
                      errorMsg.includes('chrome-extension://')) {
                    return; // Silently ignore
                  }
                  originalError.apply(console, args);
                };

                // Prevent MetaMask from auto-connecting on page load
                if (window.ethereum) {
                  window.ethereum.autoRefreshOnNetworkChange = false;
                }
              }
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
