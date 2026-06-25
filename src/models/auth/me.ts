export interface meProps {
  success: boolean
  message: string
  data: meState
}

export interface meState {
  username: string
  email: string
  role: roles
}

export interface roles {
  name: string;
  level: number
}
