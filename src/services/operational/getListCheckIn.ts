import { axiosPrivate } from "@/src/libs/instance"
import { checkinOprProps } from "@/src/models/operational/checkinList"

export const getListCheckInOpr = async (): Promise<checkinOprProps> => {
  const res = await axiosPrivate.get(`/operational/checked-in`)

  if (!res) {
    throw new Error('fail to get list data checin Operational')
  }

  const data = await res.data
  return data
}