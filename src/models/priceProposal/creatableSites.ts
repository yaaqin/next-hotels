export interface creatableSitesProps {
  success: boolean
  message: string
  data: creatableSitesState
}

export interface creatableSitesState {
  // Terisi → akun terkunci ke satu cabang, tidak perlu popup pilih cabang
  lockedSiteCode: string | null
  sites: creatableSite[]
}

export interface creatableSite {
  siteCode: string
  nama: string
  slug: string | null
  city: string | null
}
