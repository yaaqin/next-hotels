'use client'
import Navbar from "@/src/components/organisms/layouts/navbars";
import Sidebars from "@/src/components/organisms/layouts/sidebars";
import { Suspense } from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="flex h-screen overflow-hidden">
            <Sidebars/>
            <div className={` duration-500 flex flex-col flex-1 max-w-screen`}>
                <Navbar/>
                <section className="overflow-y-scroll hide-scrollbar flex-1">
                    <Suspense>
                        {children}
                    </Suspense>
                </section>
            </div>
        </section>
    );
}
