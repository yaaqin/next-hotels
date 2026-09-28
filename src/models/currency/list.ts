export interface currencyAdminListProps {
  success: boolean
  message: string
  data: currencyAdminListState
}

export interface currencyAdminListState {
  // false → akun ini cuma bisa lihat (hanya akun pusat yang bisa ubah kurs)
  canManage: boolean
  currencies: currencyAdminItem[]
}

export interface currencyAdminItem {
  code: string
  symbol: string
  decimals: number
  isActive: boolean
  sortOrder: number
  rate: currencyRate | null
}

export interface currencyRate {
  currencyCode: string
  idrPerUnit: number
  source: 'AUTO' | 'MANUAL'
  updatedBy: string | null
  updatedByUsername: string | null
  updatedAt: string
}
