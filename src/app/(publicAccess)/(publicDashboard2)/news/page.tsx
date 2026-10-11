import type { Metadata } from 'next'
import Link from 'next/link'
import { getNewsList } from '@/src/services/news'
import { BRAND, SITE_URL } from '../hotel/hotel.helper'
import { formatNewsDate, shownPublishDate } from '@/src/components/organisms/news/helpers'

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

async function parse(searchParams: PageProps['searchParams']) {
  const sp = await searchParams
  const page = Math.max(1, Number(first(sp.page)) || 1)
  const tag = first(sp.tag)?.trim() || undefined
  return { page, tag }
}

const listHref = (page: number, tag?: string) => {
  const qs = new URLSearchParams()
  if (tag) qs.set('tag', tag)
  if (page > 1) qs.set('page', String(page))
  const s = qs.toString()
  return s ? `/news?${s}` : '/news'
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { page, tag } = await parse(searchParams)
  const title = tag ? `Berita: ${tag} — ${BRAND}` : `Berita & Artikel — ${BRAND}`
  return {
    title,
    description: `Kabar terbaru, promo, dan tips menginap dari ${BRAND}.`,
    alternates: { canonical: `${SITE_URL}${listHref(page, tag)}` },
    // Halaman filter tag tipis & duplikat → tidak diindex, link artikelnya tetap diikuti
    robots: tag ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { title, type: 'website', url: `${SITE_URL}${listHref(page, tag)}` },
  }
}

export default async function NewsListPage({ searchParams }: PageProps) {
  const { page, tag } = await parse(searchParams)
  const { items, meta } = await getNewsList(page, tag)
  const lastPage = Math.max(1, Math.ceil(meta.total / meta.pageSize))

  return (
    <div className="bg-[#f5f4f0] min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-gray-500">
          <Link href="/" className="hover:underline">Beranda</Link> / <span>Berita</span>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {tag ? <>Berita: <span className="text-blue-600">#{tag}</span></> : 'Berita & Artikel'}
        </h1>
        {tag && (
          <Link href="/news" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
            ← Semua berita
          </Link>
        )}

        {items.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
            Belum ada artikel.
          </p>
        ) : (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a, i) => (
              <li key={a.slug} className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
                <Link href={`/news/${a.slug}`} className="flex h-full flex-col">
                  {a.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.coverImage}
                      alt={a.coverAlt ?? ''}
                      loading={i < 3 ? 'eager' : 'lazy'}
                      className="aspect-[16/9] w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-[16/9] w-full bg-gradient-to-br from-blue-100 to-blue-200" />
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <time className="text-xs text-gray-500" dateTime={shownPublishDate(a) ?? undefined}>
                      {formatNewsDate(shownPublishDate(a))}
                    </time>
                    <h2 className="mt-1 line-clamp-2 text-lg font-semibold leading-snug text-gray-900 group-hover:text-blue-700">
                      {a.title}
                    </h2>
                    {a.excerpt && <p className="mt-2 line-clamp-3 text-sm text-gray-600">{a.excerpt}</p>}
                    {a.tags.length > 0 && (
                      <p className="mt-auto pt-4 text-xs text-blue-600">{a.tags.slice(0, 3).map((t) => `#${t}`).join(' ')}</p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {lastPage > 1 && (
          <nav aria-label="Halaman" className="mt-10 flex items-center justify-center gap-3 text-sm">
            {page > 1 && (
              <Link href={listHref(page - 1, tag)} rel="prev" className="rounded-full border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
                ← Sebelumnya
              </Link>
            )}
            <span className="text-gray-500">Halaman {page} dari {lastPage}</span>
            {page < lastPage && (
              <Link href={listHref(page + 1, tag)} rel="next" className="rounded-full border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
                Berikutnya →
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  )
}
