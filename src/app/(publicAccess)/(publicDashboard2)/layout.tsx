'use client'
import Footer from "@/src/components/organisms/layouts/footers/publicFooter";
import TopLanguageNavbar from "@/src/components/organisms/layouts/navbars/topNavbarLang";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import { Suspense } from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section>
            <TopLanguageNavbar />
            <section className="bg-white text-center w-full shadow-2xl min-h-4 py-3">
                <Link href={'/'} className="cursor-pointer text-4xl font-bold">MBS</Link>
            </section>
            <Suspense>
                <SessionProvider>{children}</SessionProvider>
            </Suspense>
            <Footer />
        </section>
    );
}
