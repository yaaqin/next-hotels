import { bookingCheckIn } from '@/src/services/bookingUser/checkIn'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCheckIn = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (bookingCode: string) => bookingCheckIn(bookingCode),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recent-activity-list'] })
        },
    })
}