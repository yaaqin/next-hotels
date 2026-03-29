import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { saira } from "./fonts";
import Providers from "../components/organisms/providers/query";
import { Suspense } from "react";
import SyncUserToken from "../components/organisms/layouts/SyncUserToken";
import I18nProvider from "../components/organisms/providers/I18nProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MBSC - Booking Hotel",
  description:
    "Find and book hotels with the best prices. Easy booking, real-time availability, and secure payment for your perfect stay.",
  keywords: [
    "hotel booking",
    "book hotel online",
    "cheap hotels",
    "hotel deals",
    "hotel reservation",
    "best hotel price",
    "travel accommodation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${saira.className} antialiased`}
      >
        <I18nProvider>
          <Providers>
            <SyncUserToken />
            <Suspense fallback={<div>Loading...</div>}>
              {children}
            </Suspense>
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
