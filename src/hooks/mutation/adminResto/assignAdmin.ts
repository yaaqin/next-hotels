import { assignResto } from "@/src/services/adminResto/assignAdmin"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useAssignResto = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: assignResto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-resto-list"] })
    },
  })
}