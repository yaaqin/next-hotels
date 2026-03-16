import { postCancelConfirm } from '@/src/services/userRecentActivity/cancelConfirm';
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCancelConfirm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ bookingCode, previewToken }: { bookingCode: string; previewToken: string }) =>
      postCancelConfirm(bookingCode, previewToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recent-activity-list'] })
    },
  })
}