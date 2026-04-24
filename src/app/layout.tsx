import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { saira } from "./fonts";
import Providers from "../components/organisms/providers/query";
import { Suspense } from "react";
import SyncUserToken from "../components/organisms/layouts/SyncUserToken";
import I18nProvider from "../components/organisms/providers/I18nProvider";
import { SuiProvider } from "../components/providers/suiProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'MBS Hotel Booking — Demo Project',
  description: 'Demo aplikasi reservasi hotel modern dengan Next.js, payment gateway, dan Web3 crypto payment.',
  authors: [{ name: 'Nama Lu' }],
  keywords: [
    "hotel booking",
    "book hotel online",
    "cheap hotels",
    "hotel deals",
    "hotel reservation",
    "best hotel price",
    "travel accommodation",
  ],
  openGraph: {
    title: 'MBS Hotel Booking',
    description: 'Demo aplikasi reservasi hotel — Next.js + Midtrans + SGT Crypto',
    url: 'https://mbsc.yaaqin.xyz',
    type: 'website',
  },
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
              <SuiProvider>
                {children}
              </SuiProvider>
            </Suspense>
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
