export interface userListProps {
  success: boolean
  message: string
  data: userListState[]
}

export interface userListState {
  id: string
  username: string
  email: string
  createdAt: string
  createdBy: string
  isActive: boolean
  sitecode?: string
  role: Role
}

export interface Role {
  id: string
  name: string
  level: number
}
