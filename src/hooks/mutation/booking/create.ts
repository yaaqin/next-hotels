import { BookingPayload, BookingResponse } from '@/src/models/bookings/create'
import { createBooking } from '@/src/services/bookings/create'
import { useMutation } from '@tanstack/react-query'

export const useCreateBooking = () => {
  return useMutation<BookingResponse, Error, BookingPayload>({
    mutationFn: createBooking,
  })
}