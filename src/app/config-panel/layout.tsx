import ConfigShell from '@/src/components/organisms/configPanel/shell'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Config Panel — MBS',
  robots: { index: false, follow: false },
}

export default function ConfigPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConfigShell>
      <Suspense>{children}</Suspense>
    </ConfigShell>
  )
}
