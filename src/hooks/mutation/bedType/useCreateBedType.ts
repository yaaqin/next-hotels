import { CreateBedTypePayload } from '@/src/models/bedType/create'
import { createBedType } from '@/src/services/servers/bed-types/create'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateBedType = () => {
  return useMutation({
    mutationFn: (payload: CreateBedTypePayload) => createBedType(payload),
  })
}
