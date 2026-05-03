import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createMenu } from "@/src/services/restaurant/restoDashboard/menu/create"

export const useCreateMenu = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-resto-list"] })
    },
  })
}