import type { Metadata } from 'next'
import NotFoundView from '../components/organisms/notFound/NotFoundView'
import PublicShell from '../components/organisms/layouts/PublicShell'

export const metadata: Metadata = { title: '404 | MBS Hotel' }

// URL tidak dikenal, dan notFound() yang dirender Next dari root (mis. /hotel/{segment-asing}).
// Dibungkus layout public supaya navbar & footer tetap ada.
export default function NotFound() {
  return (
    <PublicShell>
      <NotFoundView />
    </PublicShell>
  )
}
