import { createFacilityGroup, CreateFacilityGroupPayload } from '@/src/services/facilities/createGroup'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export const useCreateFacilityGroup = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: CreateFacilityGroupPayload) => createFacilityGroup(payload),
    onSuccess: () => {
      router.push('/dashboard/facility/group')
    },
  })
}