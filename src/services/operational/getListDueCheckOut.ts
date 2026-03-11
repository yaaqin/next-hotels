import { axiosPrivate } from "@/src/libs/instance"
import { dueCHeckOutProps } from "@/src/models/operational/dueCheckOut"

export const getListDueCheckout = async (): Promise<dueCHeckOutProps> => {
  const res = await axiosPrivate.get(`/operational/due-checkout`)

  if (!res) {
    throw new Error('fail to get list due check out')
  }

  const data = await res.data
  return data
}