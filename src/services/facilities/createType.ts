import { axiosPrivate } from "@/src/libs/instance";
import { CreateFacilityTypePayload } from "@/src/models/facilities/createType";

export const createFacilityType = async (
    payload: CreateFacilityTypePayload
) => {
    const res = await axiosPrivate.post("/facility-types", payload);

    return res.data;
};