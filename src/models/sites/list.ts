export interface sitelistProps {
  success: boolean
  message: string
  data: siteListState[]
}

export interface siteListState {
  id: string
  nama: string
  lokasi: string
  createdAt: string
  sitecode: string
  // SEO / RLP: /hotel/{slug}, alias di-301 ke slug, kota untuk halaman hub, alamat untuk FAQ & JSON-LD
  slug: string | null
  aliases: string[]
  city: string | null
  address: string | null
  creator: Creator
}

export interface siteSeoPayload {
  slug?: string
  aliases?: string[]
  city?: string
  address?: string
}

export interface Creator {
  username: string
}
