import { UpdateAdminRestoReq, UpdateAdminRestoRes } from "@/src/models/adminResto/edit"
import { updateAdminResto } from "@/src/services/adminResto/edit"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdateAdminResto = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation<UpdateAdminRestoRes, Error, UpdateAdminRestoReq>({
    mutationFn: (payload) => updateAdminResto(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-resto-list"] })
      queryClient.invalidateQueries({ queryKey: ["admin-resto-detail", id] })
    },
  })
}