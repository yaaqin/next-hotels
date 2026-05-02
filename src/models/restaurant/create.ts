export interface CreateRestoReq {
  name: string
  description: string
  logoUrl: string
}

export interface CreateRestoRes {
  success: boolean
  message: string
  data: {
    id: string
    name: string
    description: string
    logoUrl: string
    isActive: boolean
    createdAt: string
  }
}