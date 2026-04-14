export interface userLogsProps {
  success: boolean
  data: userLogsState[]
}

export interface userLogsState {
  id: string
  name: string
  email: string
  phone: any
  avatarUrl: string
  isActive: boolean
  createdAt: string
  totalBookings: number
  totalRefunds: number
}
