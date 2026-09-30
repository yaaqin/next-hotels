import { useMutation, useQueryClient } from '@tanstack/react-query'
import { confirmReschedule } from '@/src/services/reschedule/reschedule'
import { rescheduleConfirmPayload, rescheduleConfirmProps } from '@/src/models/reschedule/preview'

export const useConfirmReschedule = () => {
  const queryClient = useQueryClient()
  return useMutation<rescheduleConfirmProps, Error, rescheduleConfirmPayload>({
    mutationFn: confirmReschedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reschedule-available-dates'] })
      queryClient.invalidateQueries({ queryKey: ['recent-activity-list'] })
    },
  })
}
