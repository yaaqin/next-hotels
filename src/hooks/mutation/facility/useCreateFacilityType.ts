import { CreateFacilityTypePayload } from "@/src/models/facilities/createType";
import { createFacilityType } from "@/src/services/facilities/createType";
import { useMutation } from "@tanstack/react-query";

export const useCreateFacilityType = () => {
  return useMutation({
    mutationFn: (payload: CreateFacilityTypePayload) =>
      createFacilityType(payload),
  });
};
