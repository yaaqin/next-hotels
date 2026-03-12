import { axiosUser } from "@/src/libs/instance"
import { bookingHistoryListProps } from "@/src/models/public/bookingHistory/list"

export const bookingHistoryList = async (): Promise<bookingHistoryListProps> => {
  const res = await axiosUser.get(`/user/bookings`)

  if (!res) {
    throw new Error('fail to get list boooking')
  }

  const data = await res.data
  return data
}

//harusnya bakal gadipake karen udah dipisah module