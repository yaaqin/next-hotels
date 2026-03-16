import { getCancelPreview } from '@/src/services/userRecentActivity/cancelPreview'
import { useQuery } from '@tanstack/react-query'

export const useCancelPreview = (bookingCode: string | null) => {
  return useQuery({
    queryKey: ['cancel-preview', bookingCode],
    queryFn: () => getCancelPreview(bookingCode!),
    enabled: !!bookingCode,
    staleTime: 0, 
  })
}