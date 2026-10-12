// Kontrak BE: /public/room-listing/* dan /public/sites

import type { DisplayPricing } from '../currency'

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
  // Kode facility item pilihan autocomplete — kamar wajib punya semua
  facility_codes?: string[]
  // Teks bebas, dicocokkan BE ke nama fasilitas
  q?: string
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
    display?: DisplayPricing
  }
}

export interface FacilityLabel {
  code: string
  name: string
}

// Tafsiran BE atas pencarian fasilitas; null kalau user tidak mencari
export interface ListingSearchInfo {
  facilities: FacilityLabel[]
  query: string | null
  // Potongan teks yang dikenali → fasilitas yang dicari (cukup salah satu)
  terms: { term: string; facilities: FacilityLabel[] }[]
  // Kata yang tidak cocok ke fasilitas mana pun (tidak ikut memfilter)
  unmatched: string[]
}

export interface SearchListingResult {
  items: ListingRoom[]
  meta: { page: number; pageSize: number; total: number; totalPages: number; hasDates: boolean }
  search: ListingSearchInfo | null
}

// Opsi autocomplete: fasilitas yang dimiliki kamar di halaman listing ini
export interface ListingFacility extends FacilityLabel {
  typeName: string | null
  // Nama di semua bahasa, untuk mencocokkan ketikan user
  keywords: string[]
  roomCount: number
}

export interface PublicSiteWithRooms extends PublicSite {
  totalRooms: number
}

// Fakta FAQ RLP (/public/room-listing/faq) — kalimatnya dirakit FE per bahasa
export interface ListingFaqFacts {
  total: number
  discounted: number
  // Harga "mulai dari" hari ini, per mata uang tagihan cabang
  prices: { currency: string; min: number; max: number }[]
  roomTypes: { name: string; slug: string | null; count: number; minPrice: number; currency: string }[]
  sites: { nama: string; slug: string | null; city: string | null; address: string | null; roomCount: number }[]
  facilities: { everyRoom: string[]; someRooms: string[] }
  paymentMethods: { method: string; label: string }[]
  reschedule: {
    policies: { minDays: number; maxDays: number | null; penaltyPercent: number }[]
    allowReReschedule: boolean
  }
  refund: {
    policies: { minDays: number; maxDays: number | null; refundPercent: number; allowCash: boolean; allowCredit: boolean }[]
  }
  // FAQ otomatis yang tampil (yang disembunyikan admin tidak ada di sini) + urutannya
  auto?: { key: AutoFaqKey; sortOrder: number }[]
  // FAQ buatan admin untuk cakupan halaman ini, sudah dalam bahasa user
  custom?: { question: string; answer: string; sortOrder: number }[]
}

export type AutoFaqKey =
  | 'price'
  | 'roomTypes'
  | 'facilities'
  | 'location'
  | 'availability'
  | 'payment'
  | 'reschedule'
  | 'refund'
  | 'bookingData'
