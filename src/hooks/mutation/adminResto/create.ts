import { CreateAdminRestoReq, CreateAdminRestoRes } from "@/src/models/adminResto/create"
import { createAdminResto } from "@/src/services/adminResto/create"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateAdminResto = () => {
  const queryClient = useQueryClient()

  return useMutation<CreateAdminRestoRes, Error, CreateAdminRestoReq>({
    mutationFn: createAdminResto,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-resto-list"],
      })
    },
  })
}