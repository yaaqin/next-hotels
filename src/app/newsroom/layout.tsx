import NewsroomShell from '@/src/components/organisms/newsroom/shell'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Newsroom — MBS',
  robots: { index: false, follow: false },
}

export default function NewsroomLayout({ children }: { children: React.ReactNode }) {
  return (
    <NewsroomShell>
      <Suspense>{children}</Suspense>
    </NewsroomShell>
  )
}
