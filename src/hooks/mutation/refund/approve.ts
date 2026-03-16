import { useMutation, useQueryClient } from '@tanstack/react-query'
import { approveRefund } from '@/src/services/refund/approve'

export const useApproveRefund = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bookingCode: string) => approveRefund(bookingCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refund-list'] })
    },
  })
}