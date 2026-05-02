import { axiosPrivate } from "@/src/libs/instance"
import { CreateAdminRestoReq } from "@/src/models/adminResto/create"

export const createAdminResto = async (payload: CreateAdminRestoReq) => {
  const res = await axiosPrivate.post("/restaurant-admin", payload)
  return res.data
}