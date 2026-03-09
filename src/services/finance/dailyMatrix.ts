import { axiosPrivate } from "@/src/libs/instance"
import { dailyMatrixProps } from "@/src/models/finance/dailyMatrix"

export const dailyMatrix = async (): Promise<dailyMatrixProps> => {
  const res = await axiosPrivate.get(`/finance/daily-metrics`)

  if (!res) {
    throw new Error('fail to get daily matrix')
  }

  const data = await res.data
  return data
}