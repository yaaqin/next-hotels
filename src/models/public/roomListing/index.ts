// Kontrak BE: /public/room-listing/* dan /public/sites

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export type CrumbKind = 'root' | 'city' | 'site' | 'roomType' | 'promo' | 'room'

export interface Crumb {
  // Teks bahasa Indonesia (juga dipakai JSON-LD / SEO)
  label: string
  path: string
  kind: CrumbKind
  // Nama dalam bahasa user: nama tipe kamar, atau nomor kamar
  name?: string
}

export interface ListingLink {
  label: string
  path: string
  // Bagian-bagian untuk merakit teks link di bahasa user
  roomTypeName?: string | null
  locationLabel?: string | null
}

export interface PublicSite {
  siteCode: string
  nama: string
  slug: string | null
  aliases: string[]
  city: string | null
  citySlug: string | null
  address: string | null
}

export type ListingLocation =
  | { kind: 'site'; slug: string; label: string; site: PublicSite }
  | { kind: 'city'; slug: string; label: string; sites: PublicSite[] }

export interface ListingMeta {
  title: string
  description: string
  index: boolean
}

export interface ResolvedListing {
  kind: 'listing'
  canonicalPath: string
  redirect: string | null
  location: ListingLocation | null
  roomType: { id: string; slug: string; name: string; displayName: string } | null
  promo: boolean
  filters: { siteCodes: string[]; roomTypeIds: string[]; promo: boolean }
  breadcrumb: Crumb[]
  meta: ListingMeta
  links: { roomTypes: ListingLink[]; locations: ListingLink[] }
}

export interface ResolvedRoom {
  kind: 'room'
  canonicalPath: string
  redirect: string | null
  site: PublicSite
  room: { id: string; slug: string; number: string; siteCode: string; roomTypeName: string }
  locationLabel: string
  breadcrumb: Crumb[]
  meta: ListingMeta
}

export type ResolvedPath = ResolvedListing | ResolvedRoom

export type ListingSort = 'price_asc' | 'price_desc' | 'number'

export interface SearchListingPayload {
  site_codes?: string[]
  room_type_ids?: string[]
  promo?: boolean
  check_in?: string
  check_out?: string
  sort?: ListingSort
  page?: number
  page_size?: number
}

export interface ListingRoom {
  id: string
  slug: string
  number: string
  floor: string
  site: { siteCode: string; nama: string; slug: string | null; city: string | null; citySlug: string | null }
  roomType: { id: string; slug: string | null; name: string | null; description: string | null; imageUrl: string | null }
  bedType: { id: string; code: string; name: string | null }
  pricing: {
    price: number
    basePrice: number
    isDiscounted: boolean
    originalPrice: number | null
    // true = harga acuan hari ini ("mulai dari"), belum sesuai tanggal pilihan user
    isStartingPrice: boolean
    checkIn: string
    checkOut: string
    nights: number
    totalPrice: number
  }
}

export interface SearchListingResult {
  items: ListingRoom[]
  meta: { page: number; pageSize: number; total: number; totalPages: number; hasDates: boolean }
}

export interface PublicSiteWithRooms extends PublicSite {
  totalRooms: number
}
