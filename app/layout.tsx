import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { clsx } from "clsx";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DocumentManagement | Pharmaceutical DMS",
  description:
    "21 CFR Part 11 compliant document management system tailored for pharmaceutical quality, regulatory, and GMP operations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={clsx(inter.variable)}>
      <body className="min-h-screen bg-slate-950/5 text-slate-900 antialiased">
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-primary-50 via-white to-white/60">
          {children}
        </div>
      </body>
    </html>
  );
}
