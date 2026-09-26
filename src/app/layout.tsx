import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { saira } from "./fonts";
import Providers from "../components/organisms/providers/query";
import { Suspense } from "react";
import SyncUserToken from "../components/organisms/layouts/SyncUserToken";
import I18nProvider from "../components/organisms/providers/I18nProvider";
import { SuiProvider } from "../components/providers/suiProvider";
import { cookies } from "next/headers";
import { LANGUAGE_COOKIE, toSupportedLang } from "../utils/languageCookie";

// Kode bahasa aplikasi → atribut lang HTML
const HTML_LANG: Record<string, string> = { idn: "id", eng: "en", jpn: "ja", chn: "zh" };

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Bahasa dari cookie supaya teks yang dirender server sama dengan di browser
  const lang = toSupportedLang((await cookies()).get(LANGUAGE_COOKIE)?.value);

  return (
    <html lang={HTML_LANG[lang]} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${saira.className} antialiased`}
      >
        <I18nProvider lang={lang}>
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
