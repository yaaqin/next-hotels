export interface UpdateAdminRestoReq {
  name?: string
  phone?: string
}

export interface UpdateAdminRestoRes {
  success: boolean
  message: string
  data: {
    id: string
    name: string
    phone: string
    email: string
    isActive: boolean
    createdAt: string
  }
}