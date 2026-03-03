import { axiosPublic } from "@/src/libs/instance"
import { BookingPayload, BookingResponse } from "@/src/models/bookings/create"

export const createBooking = async (
  payload: BookingPayload
): Promise<BookingResponse> => {
  const { data } = await axiosPublic.post('/booking', payload)
  return data
}