import { assignStaffToSite } from "@/src/services/restaurant/restoDashboard/adminResto/assignment"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useAssignStaffToSite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: assignStaffToSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restodata-admin-list"] })
    },
  })
}