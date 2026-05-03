import { assignOwner } from "@/src/services/adminResto/assignOwner"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useAssignOwner = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: assignOwner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-list"] })
    },
  })
}