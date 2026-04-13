import { axiosPrivate } from "@/src/libs/instance"
import { revocupProps } from "@/src/models/finance/revenueOcupancy"

export const getRevenueOccupancy = async (
  startDate: string,
  endDate: string,
  siteCode?: string
): Promise<revocupProps> => {
  const params = new URLSearchParams({ startDate, endDate })
  if (siteCode) params.append("siteCode", siteCode)

  const res = await axiosPrivate.get(`/finance/revenue/occupancy?${params.toString()}`)

  if (!res) throw new Error("Failed to get revenue occupancy")

  return res.data
}