import { createServerPrivate } from "@/src/libs/serverInstance"
import { bedTypeListState } from "@/src/models/bedType/list"


export interface BedTypesResponse {
  data: bedTypeListState[]
  message?: string
}

export const getBedTypes = async (): Promise<BedTypesResponse> => {
  const api = await createServerPrivate()
  const { data } = await api.get<BedTypesResponse>('/bed-types')
  return data
}