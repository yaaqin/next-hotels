export interface userProfileProps {
  success: boolean
  message: string
  data: userProfileState
}

export interface userProfileState {
  id: string
  name: string
  email: string
  avatarUrl: string
  phone: any
  createdAt: string
  credit: Credit
}

export interface Credit {
  code: string
  balance: number
  expiredAt: string
  status: string
}
