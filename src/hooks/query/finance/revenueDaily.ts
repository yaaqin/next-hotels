import { useQuery } from "@tanstack/react-query"
import { getRevenueDaily, getRevenueDetail } from "@/src/services/finance/revenueDaily"
import { revenueDailyProps, revenueDetailProps } from "@/src/models/finance/revenueDaily"

const DAY_MS = 24 * 60 * 60 * 1000
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000

// Tanggal versi hotel (WIB) — sama dengan cara BE mengelompokkan pembayaran
export const wibToday = () => new Date(Date.now() + WIB_OFFSET_MS).toISOString().slice(0, 10)
const shiftDate = (date: string, days: number) =>
  new Date(new Date(`${date}T00:00:00.000Z`).getTime() + days * DAY_MS).toISOString().slice(0, 10)

export const useRevenueDaily = (days = 30, siteCode?: string) => {
  const endDate = wibToday()
  const startDate = shiftDate(endDate, -(days - 1))

  const { data, isLoading } = useQuery<revenueDailyProps>({
    queryKey: ["revenue-daily", startDate, endDate, siteCode],
    queryFn: () => getRevenueDaily(startDate, endDate, siteCode),
  })

  return { data, isLoading, startDate, endDate }
}

export const useRevenueDetail = (date: string, siteCode?: string) => {
  const { data, isLoading, isFetching } = useQuery<revenueDetailProps>({
    queryKey: ["revenue-detail", date, siteCode],
    queryFn: () => getRevenueDetail(date, siteCode),
    enabled: !!date,
  })

  return { data, isLoading, isFetching }
}
