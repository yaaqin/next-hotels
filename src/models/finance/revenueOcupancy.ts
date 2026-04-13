export interface revocupProps {
  success: boolean
  message: string
  data: revocupState[]
}

export interface revocupState {
  date: string
  revenue: number
  occupancy: number
}
