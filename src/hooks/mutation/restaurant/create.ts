import { CreateRestoReq, CreateRestoRes } from "@/src/models/restaurant/create"
import { createResto } from "@/src/services/restaurant/create"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateResto = () => {
  const queryClient = useQueryClient()

  return useMutation<CreateRestoRes, Error, CreateRestoReq>({
    mutationFn: createResto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resto-list"] })
    },
  })
}