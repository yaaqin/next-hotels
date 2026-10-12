export type FaqLang = 'idn' | 'eng' | 'jpn' | 'chn'

export interface listingFaqTranslation {
  lang: FaqLang
  question: string
  answer: string
}

// FAQ otomatis: kalimatnya dirakit dari data di halaman listing, admin cuma atur tampil & urutan
export interface listingFaqAutoItem {
  kind: 'auto'
  id: string // key, mis. "price"
  label: string
  isHidden: boolean
  sortOrder: number
}

export interface listingFaqCustomItem {
  kind: 'custom'
  id: string
  siteCode: string | null // null = semua cabang
  siteName: string | null
  roomTypeId: string | null // null = semua tipe kamar
  roomTypeName: string | null
  isActive: boolean
  sortOrder: number
  translations: listingFaqTranslation[]
}

export type listingFaqItem = listingFaqAutoItem | listingFaqCustomItem

export interface listingFaqListProps {
  success: boolean
  message: string
  data: listingFaqItem[]
}

export interface listingFaqPayload {
  siteCode: string | null
  roomTypeId: string | null
  isActive: boolean
  translations: listingFaqTranslation[]
}
