import { bookingCheckout } from '@/src/services/userRecentActivity/checkOut'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCheckOut = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (bookingCode: string) => bookingCheckout(bookingCode),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recent-activity-list'] })
        },
    })
}