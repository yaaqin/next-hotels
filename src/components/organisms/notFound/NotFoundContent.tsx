'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LostScene from './LostScene'
import NewsScene from './NewsScene'

export interface NotFoundVariantLabels {
  title: string
  description: string
  cta: string
}

const isNewsPath = (pathname: string | null) => pathname === '/news' || !!pathname?.startsWith('/news/')

// not-found tidak menerima params, jadi varian dipilih dari pathname:
// /news/... → berita tidak ditemukan (ke /news), selain itu → tersesat (ke beranda)
export default function NotFoundContent({
  eyebrow,
  general,
  news,
}: {
  eyebrow: string
  general: NotFoundVariantLabels
  news: NotFoundVariantLabels
}) {
  const isNews = isNewsPath(usePathname())
  const labels = isNews ? news : general
  const Scene = isNews ? NewsScene : LostScene
  const sceneClass = 'w-full rounded-3xl border border-[#DCE6F2] shadow-[0_20px_60px_-30px_rgba(3,13,26,0.6)]'

  return (
    <div className="w-full max-w-xl text-center space-y-6">
      <Scene className={sceneClass} />

      <div className="space-y-2">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#5B90C9]">{eyebrow}</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#05111F]">{labels.title}</h1>
        <p className="text-sm text-[#2C4E72] max-w-md mx-auto">{labels.description}</p>
      </div>

      <Link
        href={isNews ? '/news' : '/'}
        className="inline-block w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold tracking-wide text-white bg-[#0A1828] hover:bg-[#163356] transition-colors"
      >
        {labels.cta}
      </Link>
    </div>
  )
}
