import { axiosPrivate } from "@/src/libs/instance"
import { bookingDetailProps } from "@/src/models/bookings/detail"

export const confirmBooking = async (id: string): Promise<bookingDetailProps> => {
  const res = await axiosPrivate.patch(`/booking/${id}/confirm`)

  if (!res) {
    throw new Error('fail to get confirm booking') 
  }

  const data = await res.data
  return data
}