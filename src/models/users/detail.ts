export interface detailUserProps {
  success: boolean
  message: string
  data: detailUserState
}

export interface detailUserState {
  id: string
  username: string
  email: string
  createdAt: string
  createdBy: string
  isActive: boolean
  role: Role
}

export interface Role {
  name: string
  level: number
}
