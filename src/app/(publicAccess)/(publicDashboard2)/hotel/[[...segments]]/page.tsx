import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { Suspense } from 'react'
import RoomDetailView from '@/src/components/organisms/roomDetail/RoomDetailView'
import Breadcrumbs from '@/src/components/organisms/roomListing/Breadcrumbs'
import JsonLd from '@/src/components/organisms/roomListing/JsonLd'
import ListingFilters from '@/src/components/organisms/roomListing/ListingFilters'
import ListingPagination from '@/src/components/organisms/roomListing/ListingPagination'
import RelatedLinks from '@/src/components/organisms/roomListing/RelatedLinks'
import RoomListingCard from '@/src/components/organisms/roomListing/RoomListingCard'
import { ResolvedListing } from '@/src/models/public/roomListing'
import {
  getPublicRoomDetail,
  getRequestCurrency,
  getRequestLang,
  resolveRoomListing,
  searchRoomListing,
} from '@/src/services/roomListing'
import PreferenceSync from '@/src/components/organisms/roomListing/PreferenceSync'
import { LANG_LOCALE } from '@/src/utils/currencyCookie'
import { getServerT } from '@/src/i18n/server'
import {
  breadcrumbJsonLd,
  buildListingMetadata,
  filterLabels,
  formatRupiah,
  hotelJsonLd,
  hotelRoomJsonLd,
  itemListJsonLd,
  listingDisplayText,
  ListingQuery,
  parseListingQuery,
  priceTagLabels,
  stayFromQuery,
  toQueryString,
} from '../hotel.helper'

type PageProps = {
  params: Promise<{ segments?: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

// Satu route untuk semua RLP: /hotel, /hotel/{lokasi}, /hotel/{lokasi}/{tipe}/{facet},
// dan detail kamar /hotel/{cabang}/kamar/{slug} (RDP, noindex). Arti tiap segment diputuskan BE.
async function load({ params, searchParams }: PageProps) {
  const [{ segments = [] }, rawSearchParams, lang, currency] = await Promise.all([
    params,
    searchParams,
    getRequestLang(),
    getRequestCurrency(),
  ])
  const resolved = await resolveRoomListing(segments.map(decodeURIComponent), lang)
  const query = parseListingQuery(rawSearchParams)

  const result =
    resolved?.kind === 'listing' && !resolved.redirect
      ? await searchRoomListing(searchPayload(resolved, query), lang, currency)
      : null

  const stay = stayFromQuery(query)
  const room =
    resolved?.kind === 'room' && !resolved.redirect
      ? await getPublicRoomDetail(resolved.room.id, stay, lang, currency)
      : null

  return { resolved, query, result, room, stay, rawSearchParams, lang, currency }
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
  const { resolved, query, result, room } = await load(props)
  if (!resolved || resolved.redirect) return {}
  return buildListingMetadata(resolved, result, query, room?.gallery?.images?.[0]?.url)
}

export default async function HotelListingPage(props: PageProps) {
  const { resolved, query, result, room, stay, rawSearchParams, lang, currency } = await load(props)
  const t = getServerT(lang)
  const locale = LANG_LOCALE[lang]
  const priceLabels = priceTagLabels(t)

  if (!resolved) notFound()
  // Alias / urutan segment lain → 301 ke path resmi, query user ikut dibawa
  if (resolved.redirect) permanentRedirect(`${resolved.redirect}${toQueryString(rawSearchParams)}`)

  if (resolved.kind === 'room') {
    if (!room) notFound()
    const typeCrumb = resolved.breadcrumb.find((c) => c.kind === 'roomType')
    const typeName = room.roomType.translation.name
    return (
      <>
        <PreferenceSync serverLang={lang} serverCurrency={currency} />
        <JsonLd data={breadcrumbJsonLd(resolved.breadcrumb)} />
        <JsonLd data={hotelRoomJsonLd(room, resolved)} />
        <RoomDetailView
          room={room}
          stay={stay}
          heading={`${typeName} · ${t('roomListing.room')} ${room.number}`}
          typeLink={{
            path: typeCrumb?.path ?? `/hotel/${resolved.site.slug}`,
            label: t('roomDetail.viewAllType', { type: typeName, place: resolved.locationLabel }),
          }}
          t={t}
          locale={locale}
          priceLabels={priceLabels}
          filterLabels={filterLabels(t)}
          breadcrumb={<Breadcrumbs items={resolved.breadcrumb} t={t} />}
        />
      </>
    )
  }

  const { items, meta } = result!
  const { heading, intro } = listingDisplayText(resolved, lang, t)
  const stayQuery = query.checkin ? `?checkin=${query.checkin}&checkout=${query.checkout}` : ''
  const site = resolved.location?.kind === 'site' ? resolved.location.site : null
  const prices = items.map((i) => i.pricing.price)
  const priceRange = prices.length
    ? `${formatRupiah(Math.min(...prices))} - ${formatRupiah(Math.max(...prices))}`
    : undefined

  return (
    <div className="min-h-screen bg-[#EEF3FA]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <PreferenceSync serverLang={lang} serverCurrency={currency} />
      <JsonLd data={breadcrumbJsonLd(resolved.breadcrumb)} />
      {items.length > 0 && <JsonLd data={itemListJsonLd(items, (meta.page - 1) * meta.pageSize + 1)} />}
      {site && <JsonLd data={hotelJsonLd(site, priceRange)} />}

      {/* ── Header ── */}
      <header className="bg-[#05111F] px-6 py-8 md:py-10">
        <div className="max-w-6xl mx-auto space-y-4">
          <Breadcrumbs items={resolved.breadcrumb} t={t} />
          <h1 className="text-2xl md:text-3xl font-semibold text-[#C8DCEF]">{heading}</h1>
          <p className="max-w-3xl text-sm text-[#6A9EC5]">{intro}</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <Suspense>
          <ListingFilters labels={filterLabels(t)} />
        </Suspense>

        {/* Hub kota: daftar cabang di kota ini */}
        {resolved.location?.kind === 'city' && (
          <RelatedLinks
            title={t('roomListing.branchesIn', { city: resolved.location.label })}
            links={resolved.location.sites.map((s) => ({ label: s.nama, path: `/hotel/${s.slug}` }))}
            t={t}
          />
        )}

        <p className="text-sm text-gray-500">
          {meta.hasDates
            ? t('roomListing.availableForDates', { count: meta.total })
            : t('roomListing.totalRooms', { count: meta.total })}
        </p>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((room) => (
              <RoomListingCard
                key={room.id}
                room={room}
                stayQuery={stayQuery}
                t={t}
                locale={locale}
                priceLabels={priceLabels}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#DCE6F2] space-y-2">
            <p className="text-3xl">🛏️</p>
            <p className="text-base font-semibold text-[#05111F]">
              {resolved.promo ? t('roomListing.emptyPromoTitle') : t('roomListing.emptyTitle')}
            </p>
            <p className="text-sm text-gray-500">{t('roomListing.emptyHint')}</p>
          </div>
        )}

        <ListingPagination
          basePath={resolved.canonicalPath}
          page={meta.page}
          totalPages={meta.totalPages}
          searchParams={rawSearchParams}
          t={t}
        />

        <RelatedLinks title={t('roomListing.otherRoomTypes')} links={resolved.links.roomTypes} t={t} />
        <RelatedLinks title={t('roomListing.otherBranches')} links={resolved.links.locations} t={t} />
      </main>
    </div>
  )
}
