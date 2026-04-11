import { SessionProvider } from 'next-auth/react'
import { Suspense } from 'react'

export default function RoomAvailibilityLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SessionProvider>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#f5f4f0] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-blue-200 border-t-blue-500 animate-spin" />
              <p className="text-xs tracking-widest uppercase text-gray-400">Memuat...</p>
            </div>
          </div>
        }
      >
        {children}
      </Suspense>
    </SessionProvider>
  )
}