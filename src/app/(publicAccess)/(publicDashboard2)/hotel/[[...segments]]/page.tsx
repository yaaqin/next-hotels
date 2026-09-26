import type { Metadata } from 'next'
import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { Suspense } from 'react'
import PublicRoomDetailPage from '@/src/components/pages/(publicPage)/booking/room/detail'
import Breadcrumbs from '@/src/components/organisms/roomListing/Breadcrumbs'
import JsonLd from '@/src/components/organisms/roomListing/JsonLd'
import ListingFilters from '@/src/components/organisms/roomListing/ListingFilters'
import ListingPagination from '@/src/components/organisms/roomListing/ListingPagination'
import RelatedLinks from '@/src/components/organisms/roomListing/RelatedLinks'
import RoomListingCard from '@/src/components/organisms/roomListing/RoomListingCard'
import { ResolvedListing } from '@/src/models/public/roomListing'
import { getRequestLang, resolveRoomListing, searchRoomListing } from '@/src/services/roomListing'
import LanguageSync from '@/src/components/organisms/roomListing/LanguageSync'
import {
  breadcrumbJsonLd,
  buildListingMetadata,
  defaultStayDates,
  formatRupiah,
  hotelJsonLd,
  itemListJsonLd,
  ListingQuery,
  parseListingQuery,
  toQueryString,
} from '../hotel.helper'

type PageProps = {
  params: Promise<{ segments?: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

// Satu route untuk semua RLP: /hotel, /hotel/{lokasi}, /hotel/{lokasi}/{tipe}/{facet},
// dan detail kamar /hotel/{cabang}/kamar/{slug}. Arti tiap segment diputuskan BE.
async function load({ params, searchParams }: PageProps) {
  const [{ segments = [] }, rawSearchParams, lang] = await Promise.all([
    params,
    searchParams,
    getRequestLang(),
  ])
  const resolved = await resolveRoomListing(segments.map(decodeURIComponent), lang)
  const query = parseListingQuery(rawSearchParams)

  const result =
    resolved?.kind === 'listing' && !resolved.redirect
      ? await searchRoomListing(searchPayload(resolved, query), lang)
      : null

  return { resolved, query, result, rawSearchParams, lang }
}

function searchPayload(resolved: ResolvedListing, query: ListingQuery) {
  return {
    site_codes: resolved.filters.siteCodes,
    room_type_ids: resolved.filters.roomTypeIds,
    promo: resolved.filters.promo,
    ...(query.checkin && { check_in: query.checkin, check_out: query.checkout }),
    ...(query.sort && { sort: query.sort }),
    page: query.page,
    page_size: query.pageSize,
  }
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { resolved, query, result } = await load(props)
  if (!resolved || resolved.redirect) return {}
  return buildListingMetadata(resolved, result, query)
}

export default async function HotelListingPage(props: PageProps) {
  const { resolved, query, result, rawSearchParams, lang } = await load(props)

  if (!resolved) notFound()
  // Alias / urutan segment lain → 301 ke path resmi, query user ikut dibawa
  if (resolved.redirect) permanentRedirect(`${resolved.redirect}${toQueryString(rawSearchParams)}`)

  if (resolved.kind === 'room') {
    // Halaman detail lama butuh tanggal — isi default hari ini kalau user datang tanpa tanggal
    if (!rawSearchParams.checkin) {
      const { checkin, checkout } = defaultStayDates()
      redirect(`${resolved.canonicalPath}?checkin=${checkin}&checkout=${checkout}`)
    }
    return (
      <>
        <LanguageSync serverLang={lang} />
        <JsonLd data={breadcrumbJsonLd(resolved.breadcrumb)} />
        <div className="bg-[#05111F] px-5 py-3">
          <Breadcrumbs items={resolved.breadcrumb} />
        </div>
        <Suspense>
          <PublicRoomDetailPage roomId={resolved.room.id} />
        </Suspense>
      </>
    )
  }

  const { items, meta } = result!
  const stayQuery = query.checkin ? `?checkin=${query.checkin}&checkout=${query.checkout}` : ''
  const site = resolved.location?.kind === 'site' ? resolved.location.site : null
  const prices = items.map((i) => i.pricing.price)
  const priceRange = prices.length
    ? `${formatRupiah(Math.min(...prices))} - ${formatRupiah(Math.max(...prices))}`
    : undefined

  return (
    <div className="min-h-screen bg-[#EEF3FA]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <LanguageSync serverLang={lang} />
      <JsonLd data={breadcrumbJsonLd(resolved.breadcrumb)} />
      {items.length > 0 && <JsonLd data={itemListJsonLd(items, (meta.page - 1) * meta.pageSize + 1)} />}
      {site && <JsonLd data={hotelJsonLd(site, priceRange)} />}

      {/* ── Header ── */}
      <header className="bg-[#05111F] px-6 py-8 md:py-10">
        <div className="max-w-6xl mx-auto space-y-4">
          <Breadcrumbs items={resolved.breadcrumb} />
          <h1 className="text-2xl md:text-3xl font-semibold text-[#C8DCEF]">{resolved.meta.title}</h1>
          <p className="max-w-3xl text-sm text-[#6A9EC5]">{resolved.meta.description}</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <Suspense>
          <ListingFilters />
        </Suspense>

        {/* Hub kota: daftar cabang di kota ini */}
        {resolved.location?.kind === 'city' && (
          <RelatedLinks
            title={`Cabang di ${resolved.location.label}`}
            links={resolved.location.sites.map((s) => ({ label: s.nama, path: `/hotel/${s.slug}` }))}
          />
        )}

        <p className="text-sm text-gray-500">
          {meta.total} kamar{meta.hasDates ? ' tersedia untuk tanggal pilihanmu' : ''}
        </p>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((room) => (
              <RoomListingCard key={room.id} room={room} stayQuery={stayQuery} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#DCE6F2] space-y-2">
            <p className="text-3xl">🛏️</p>
            <p className="text-base font-semibold text-[#05111F]">
              {resolved.promo ? 'Belum ada promo saat ini' : 'Belum ada kamar yang bisa dipesan'}
            </p>
            <p className="text-sm text-gray-500">Coba tanggal lain atau lihat pilihan kamar di bawah.</p>
          </div>
        )}

        <ListingPagination
          basePath={resolved.canonicalPath}
          page={meta.page}
          totalPages={meta.totalPages}
          searchParams={rawSearchParams}
        />

        <RelatedLinks title="Tipe kamar lainnya" links={resolved.links.roomTypes} />
        <RelatedLinks title="Cabang lainnya" links={resolved.links.locations} />
      </main>
    </div>
  )
}
