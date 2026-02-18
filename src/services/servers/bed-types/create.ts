import { createServerPrivate } from "@/src/libs/serverInstance"
import { BedTypeDetailResponse, BedTypesResponse, CreateBedTypePayload } from "@/src/models/bedType/create"

export const createBedType = async (
  payload: CreateBedTypePayload
): Promise<BedTypeDetailResponse> => {
  const api = await createServerPrivate()
  const { data } = await api.post<BedTypeDetailResponse>('/bed-types', payload)
  return data
}