import { CreateFacilityItemPayload } from '@/src/models/facilities/createItems';
import { createFacilityItem } from '@/src/services/facilities/createItems';
import { useMutation } from '@tanstack/react-query';

export const useCreateFacilityItem = () => {
  return useMutation({
    mutationFn: (payload: CreateFacilityItemPayload) =>
      createFacilityItem(payload),
  });
};