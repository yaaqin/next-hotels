import UserGuide from '@/src/components/pages/(guide)/userGuide'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Panduan Pengguna — MBS Hotel',
  description: 'Cara booking kamar, bayar, reschedule, cancel & refund, booking credit, withdraw, dan pesan makanan di MBS Hotel.',
}

export default function page() {
  return (
    // UserGuide baca topik dari ?topic= (useSearchParams)
    <Suspense>
      <UserGuide />
    </Suspense>
  )
}
