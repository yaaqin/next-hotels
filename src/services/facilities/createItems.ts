import { axiosPrivate } from "@/src/libs/instance";
import { CreateFacilityItemPayload } from "@/src/models/facilities/createItems";


export const createFacilityItem = async (payload: CreateFacilityItemPayload) => {
  const { data } = await axiosPrivate.post('/facility-items', payload);
  return data;
};