import { axiosPrivate } from "@/src/libs/instance"
import { CreateRestoReq } from "@/src/models/restaurant/create"

export const createResto = async (payload: CreateRestoReq) => {
  const res = await axiosPrivate.post("/restaurant", payload)
  return res.data
}