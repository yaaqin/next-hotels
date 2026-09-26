import Link from 'next/link'
import { ServerT } from '@/src/i18n/server'

interface ListingPaginationProps {
  basePath: string
  page: number
  totalPages: number
  // Query lain (tanggal, sort) yang dipertahankan antar halaman
  searchParams: Record<string, string | string[] | undefined>
  t: ServerT
}

function hrefFor(basePath: string, page: number, searchParams: ListingPaginationProps['searchParams']) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(searchParams)) {
    if (key === 'page' || !value) continue
    params.set(key, Array.isArray(value) ? value[0] : value)
  }
  if (page > 1) params.set('page', String(page))
  const qs = params.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

export default function ListingPagination({ basePath, page, totalPages, searchParams, t }: ListingPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav aria-label={t('roomListing.pages')} className="flex items-center justify-center gap-1.5">
      {page > 1 && (
        <Link rel="prev" href={hrefFor(basePath, page - 1, searchParams)} className="px-3 py-1.5 rounded-lg text-sm text-[#05111F] hover:bg-white">
          ‹ {t('roomListing.prev')}
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={hrefFor(basePath, p, searchParams)}
          aria-current={p === page ? 'page' : undefined}
          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm ${
            p === page ? 'bg-[#05111F] text-white' : 'text-[#05111F] hover:bg-white'
          }`}
        >
          {p}
        </Link>
      ))}
      {page < totalPages && (
        <Link rel="next" href={hrefFor(basePath, page + 1, searchParams)} className="px-3 py-1.5 rounded-lg text-sm text-[#05111F] hover:bg-white">
          {t('roomListing.next')} ›
        </Link>
      )}
    </nav>
  )
}
