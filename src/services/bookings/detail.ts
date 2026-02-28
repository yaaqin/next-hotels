import { axiosPrivate } from "@/src/libs/instance"
import { bookingDetailProps } from "@/src/models/bookings/detail"

export const bookingDetail = async (id: string): Promise<bookingDetailProps> => {
  const res = await axiosPrivate.get(`/booking/${id}`)

  if (!res) {
    throw new Error('fail to get detail boooking')
  }

  const data = await res.data
  return data
}