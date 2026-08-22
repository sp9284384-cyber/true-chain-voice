import type { Metadata } from "next";
import { Inter, Fraunces, IBM_Plex_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import "./globals.css";

// next/font: self-hosted at build time, no render-blocking <link> tags,
// zero layout shift from late font swaps.
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
  display: "swap",
});
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "TrueChain — Anonymous Reporting",
  description: "Report harassment, corruption, or misconduct anonymously. Nothing that identifies you is ever collected.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable} ${mono.variable}`}>
      <body className="font-body min-h-screen bg-paper text-ink">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
