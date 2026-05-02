export interface CreateAdminRestoReq {
  email: string
  name: string
  password: string
  phone: string
}

export interface CreateAdminRestoRes {
  success: boolean
  message: string
  data: {
    id: string
    email: string
    name: string
    phone: string
    isActive: boolean
    createdAt: string
  }
}