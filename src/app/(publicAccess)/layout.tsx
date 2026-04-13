import IdleRobotHelper from '@/src/components/organisms/layouts/robotHelper'
import SessionWrapper from '@/src/components/providers/sessionWrapper'
import { Suspense } from 'react'

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

export default function PublicAccessLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
     <SessionWrapper>
      <section className="flex flex-col min-h-screen">
        <main className="flex-1">
          <Suspense fallback={<PageSkeleton />}>
            {children}
          </Suspense>
        </main>
      </section>
      <IdleRobotHelper /> 
    </SessionWrapper>
  )
}