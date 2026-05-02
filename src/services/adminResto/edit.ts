import { axiosPrivate } from "@/src/libs/instance"
import { UpdateAdminRestoReq } from "@/src/models/adminResto/edit"

export const updateAdminResto = async (id: string, payload: UpdateAdminRestoReq) => {
  const res = await axiosPrivate.patch(`/restaurant-admin/${id}`, payload)
  return res.data
}