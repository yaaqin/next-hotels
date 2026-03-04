export interface sessionTokenLIstProps {
  success: boolean
  message: string
  data: sessionTokenLIstState[]
  meta: Meta
}

export interface sessionTokenLIstState {
  id: string
  adminId: string
  token: string
  isActive: boolean
  createdAt: string
  expiredAt: string
}

export interface Meta {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}
