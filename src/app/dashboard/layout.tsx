'use client'
import Navbar from "@/src/components/organisms/layouts/navbars";
import Sidebars from "@/src/components/organisms/layouts/sidebars";
import { ARTICLE_ADMIN_ROLE } from "@/src/constans/newsroom";
import { useMe } from "@/src/hooks/query/auth/me";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter()
    const { data: me, isLoading } = useMe()
    const isArticleAdmin = me?.data?.role?.name === ARTICLE_ADMIN_ROLE

    // Admin artikel tidak punya akses ke dashboard hotel (BE membalas 403), arahkan ke newsroom
    useEffect(() => {
        if (isArticleAdmin) router.replace('/newsroom')
    }, [isArticleAdmin, router])

    // Tahan render sampai role diketahui supaya dashboard tidak sempat berkedip sebelum redirect
    if (isLoading || isArticleAdmin) {
        return (
            <section className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
            </section>
        )
    }

    return (
        <section className="flex h-screen overflow-hidden">
            <Toaster/>
            <Sidebars/>
            <div className={` duration-500 flex flex-col flex-1 min-w-0 max-w-screen`}>
                <Navbar/>
                <section className="overflow-y-scroll hide-scrollbar flex-1 p-4">
                    <Suspense>
                        {children}
                    </Suspense>
                </section>
            </div>
        </section>
    );
}
