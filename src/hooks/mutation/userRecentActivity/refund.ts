import { postRefund, RefundPayload } from '@/src/services/userRecentActivity/refund';
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useRefund = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ bookingCode, payload }: { bookingCode: string; payload: RefundPayload }) =>
      postRefund(bookingCode, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recent-activity'] })
    },
  })
}