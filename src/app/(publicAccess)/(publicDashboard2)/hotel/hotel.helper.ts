import type { Metadata } from 'next'
import {
  Crumb,
  ListingLink,
  ListingRoom,
  ListingSort,
  ResolvedListing,
  ResolvedPath,
  SearchListingResult,
} from '@/src/models/public/roomListing'
import type { ServerT } from '@/src/i18n/server'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mbsc.yaaqin.xyz'
export const BRAND = 'MBS Hotel'

// Di bawah ini halaman listing dianggap thin content → noindex, follow
export const MIN_INDEXABLE_ROOMS = 2
const PAGE_SIZE = 12

type SearchParams = Record<string, string | string[] | undefined>

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)
const isDate = (value?: string) => !!value && /^\d{4}-\d{2}-\d{2}$/.test(value)

// State UI dari query string — tidak pernah membentuk halaman baru (canonical ke path)
export function parseListingQuery(searchParams: SearchParams) {
  const checkin = first(searchParams.checkin)
  const checkout = first(searchParams.checkout)
  const hasDates = isDate(checkin) && isDate(checkout) && checkout! > checkin!
  const sort = first(searchParams.sort) as ListingSort | undefined
  const page = Math.max(1, Number.parseInt(first(searchParams.page) ?? '1', 10) || 1)

  return {
    checkin: hasDates ? checkin : undefined,
    checkout: hasDates ? checkout : undefined,
    sort: sort && ['price_asc', 'price_desc', 'number'].includes(sort) ? sort : undefined,
    page,
    pageSize: PAGE_SIZE,
  }
}

export type ListingQuery = ReturnType<typeof parseListingQuery>

// Query string yang ikut dibawa saat redirect alias/urutan (state user tidak hilang)
export function toQueryString(searchParams: SearchParams) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(searchParams)) {
    for (const v of Array.isArray(value) ? value : value ? [value] : []) params.append(key, v)
  }
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

// Tanggal hari ini & besok versi WIB — default untuk halaman detail kamar
export function defaultStayDates() {
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' })
  const today = fmt.format(new Date())
  const tomorrow = fmt.format(new Date(Date.now() + 24 * 60 * 60 * 1000))
  return { checkin: today, checkout: tomorrow }
}

// Halaman "semua cabang" (/hotel, /hotel/deluxe) isinya identik dengan halaman cabang
// selama baru satu cabang yang punya kamarnya → canonical ke halaman cabang itu.
// Otomatis kembali self-canonical begitu cabang kedua punya kamar yang sama.
export function effectiveCanonicalPath(resolved: ResolvedPath) {
  if (resolved.kind !== 'listing' || resolved.location || resolved.promo) return resolved.canonicalPath
  const { locations } = resolved.links
  return locations.length === 1 ? locations[0].path : resolved.canonicalPath
}

export function buildListingMetadata(
  resolved: ResolvedPath,
  result: SearchListingResult | null,
  query: ListingQuery,
): Metadata {
  const canonicalPath = effectiveCanonicalPath(resolved)
  const isOwnCanonical = canonicalPath === resolved.canonicalPath
  // Paginasi: self-canonical per halaman supaya produk di halaman 2+ tetap terbaca
  const pageSuffix = resolved.kind === 'listing' && isOwnCanonical && query.page > 1 ? `?page=${query.page}` : ''
  const canonical = `${SITE_URL}${canonicalPath}${pageSuffix}`

  const enoughResults = resolved.kind === 'room' || (result?.meta.total ?? 0) >= MIN_INDEXABLE_ROOMS
  const index = resolved.meta.index && enoughResults
  const title = `${resolved.meta.title}${query.page > 1 ? ` — Halaman ${query.page}` : ''} | ${BRAND}`

  return {
    title,
    description: resolved.meta.description,
    alternates: { canonical },
    robots: { index, follow: true },
    openGraph: {
      title,
      description: resolved.meta.description,
      url: canonical,
      siteName: BRAND,
      type: 'website',
      locale: 'id_ID',
    },
  }
}

// ── JSON-LD ─────────────────────────────────────────────────────────────────

export function breadcrumbJsonLd(breadcrumb: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      item: `${SITE_URL}${crumb.path}`,
    })),
  }
}

export function roomPath(room: ListingRoom) {
  return `/hotel/${room.site.slug}/kamar/${room.slug}`
}

export function itemListJsonLd(items: ListingRoom[], startPosition: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((room, i) => ({
      '@type': 'ListItem',
      position: startPosition + i,
      url: `${SITE_URL}${roomPath(room)}`,
      item: {
        '@type': 'HotelRoom',
        name: `Kamar ${room.roomType.name ?? ''} ${room.number}`.trim(),
        ...(room.roomType.description && { description: room.roomType.description }),
        ...(room.roomType.imageUrl && { image: room.roomType.imageUrl }),
        ...(room.bedType.name && { bed: room.bedType.name }),
        containedInPlace: { '@type': 'Hotel', name: room.site.nama },
        offers: {
          '@type': 'Offer',
          price: room.pricing.price,
          priceCurrency: 'IDR',
        },
      },
    })),
  }
}

export function hotelJsonLd(site: { nama: string; address: string | null; slug: string | null }, priceRange?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: `${BRAND} ${site.nama}`,
    url: `${SITE_URL}/hotel/${site.slug}`,
    ...(site.address && { address: site.address }),
    ...(priceRange && { priceRange }),
  }
}

export function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)
}

// ── Teks tampilan per bahasa ──────────────────────────────────────────────────
// Indonesia pakai teks persis dari BE (sama dengan title/description SEO).
// Bahasa lain dirakit dari bagian-bagian yang dikirim BE + template di file locale.

// Sama dengan aturan BE: alias pendek jadi keyword, mis. "Alam Sutera (BSD, Tangsel)"
function aliasSuffix(aliases: string[]) {
  const labels = aliases
    .filter((a) => !a.includes('-'))
    .map((a) => (a.length <= 3 ? a.toUpperCase() : a[0].toUpperCase() + a.slice(1)))
  return labels.length ? ` (${labels.join(', ')})` : ''
}

export function listingDisplayText(resolved: ResolvedListing, lang: string, t: ServerT) {
  if (lang === 'idn') {
    return { heading: resolved.meta.title, intro: resolved.meta.description }
  }

  const { location, roomType, promo } = resolved
  const place = location
    ? `${location.label}${location.kind === 'site' ? aliasSuffix(location.site.aliases) : ''}`
    : t('roomListing.allBranches')
  const type = roomType?.displayName

  const heading = promo
    ? type
      ? t('roomListing.headingPromoRooms', { type, place })
      : t('roomListing.headingPromoHotel', { place })
    : type
      ? t('roomListing.headingRooms', { type, place })
      : t('roomListing.headingHotel', { place })

  const address = location?.kind === 'site' ? location.site.address : null
  const intro = `${t('roomListing.intro', { title: heading })}${address ? ` ${t('roomListing.address', { address })}` : ''}`

  return { heading, intro }
}

export function crumbDisplayLabel(crumb: Crumb, t: ServerT) {
  switch (crumb.kind) {
    case 'root':
      return t('roomListing.crumbHotel')
    case 'promo':
      return t('roomListing.promo')
    case 'roomType':
      return crumb.name ?? crumb.label
    case 'room':
      return `${t('roomListing.room')} ${crumb.name ?? ''}`.trim()
    default:
      return crumb.label
  }
}

export function linkDisplayLabel(link: ListingLink, t: ServerT) {
  const type = link.roomTypeName
  const place = link.locationLabel
  if (type && place) return t('roomListing.headingRooms', { type, place })
  if (type) return t('roomListing.linkRooms', { type })
  if (place) return t('roomListing.headingHotel', { place })
  return link.label
}
