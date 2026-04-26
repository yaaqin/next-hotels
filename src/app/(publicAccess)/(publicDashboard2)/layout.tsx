'use client'

import Footer from '@/src/components/organisms/layouts/footers/publicFooter'
import TopLanguageNavbar from '@/src/components/organisms/layouts/navbars/topNavbarLang'
import Link from 'next/link'
import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'

function HeaderSkeleton() {
  return (
    <section className="bg-white text-center w-full shadow-sm min-h-4 py-3 border-b border-gray-100">
      <div className="w-16 h-8 bg-gray-100 rounded-lg mx-auto animate-pulse" />
    </section>
  )
}

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#f5f4f0] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-blue-200 border-t-blue-500 animate-spin" />
        <p className="text-xs tracking-widest uppercase text-gray-400">Memuat...</p>
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <section className="flex flex-col min-h-screen">
        <Toaster/>
        {/* Top Language Bar */}
        <Suspense fallback={null}>
          <TopLanguageNavbar />
        </Suspense>

        {/* Brand Header */}
        <header className="bg-white text-center w-full shadow-sm border-b border-gray-100 py-3 sticky top-0 z-20">
          <Link
            href="/"
            className="cursor-pointer text-4xl font-bold text-gray-900 tracking-tight hover:opacity-70 transition-opacity duration-200 inline-block"
          >
            MBS
          </Link> 
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <Suspense fallback={<PageSkeleton />}>
            {children}
          </Suspense>
        </main>

        {/* Footer */}
        <Footer />
      </section>
  )
}