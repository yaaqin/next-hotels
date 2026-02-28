import { axiosPrivate } from "@/src/libs/instance"
import { bookingListProps } from "@/src/models/bookings/list"

export const bookingList = async (date: string): Promise<bookingListProps> => {
  const res = await axiosPrivate.get(`/booking?date=${date}`)

  if (!res) {
    throw new Error('fail to get list boooking')
  }

  const data = await res.data
  return data
}