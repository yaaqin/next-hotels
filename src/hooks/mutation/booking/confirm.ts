import { confirmBooking } from '@/src/services/bookings/confirm'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useConfirmBooking = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (bookingCode: string) => confirmBooking(bookingCode),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['need-confirm-list'] })
        },
    })
}