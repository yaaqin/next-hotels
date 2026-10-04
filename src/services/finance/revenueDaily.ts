import { axiosPrivate } from "@/src/libs/instance"
import { revenueDailyProps, revenueDetailProps } from "@/src/models/finance/revenueDaily"

export const getRevenueDaily = async (
  startDate: string,
  endDate: string,
  siteCode?: string,
): Promise<revenueDailyProps> => {
  const res = await axiosPrivate.get(`/finance/revenue/daily`, {
    params: { startDate, endDate, ...(siteCode && { siteCode }) },
  })
  return res.data
}

export const getRevenueDetail = async (date: string, siteCode?: string): Promise<revenueDetailProps> => {
  const res = await axiosPrivate.get(`/finance/revenue/detail`, {
    params: { date, ...(siteCode && { siteCode }) },
  })
  return res.data
}
