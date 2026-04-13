import { useQuery } from "@tanstack/react-query"
import { getRevenueOccupancy } from "@/src/services/finance/revenueOccupancy"
import { revocupProps } from "@/src/models/finance/revenueOcupancy"

const getDateRange = () => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 1)

  const fmt = (d: Date) => d.toISOString().split("T")[0]

  return {
    startDate: fmt(startDate),
    endDate: fmt(endDate),
  }
}

export const useRevenueOccupancy = (siteCode?: string) => {
  const { startDate, endDate } = getDateRange()

  const { data, isLoading, error, refetch } = useQuery<revocupProps>({
    queryKey: ["revenue-occupancy", startDate, endDate, siteCode],
    queryFn: () => getRevenueOccupancy(startDate, endDate, siteCode),
  })

  return { data, isLoading, error, refetch, startDate, endDate }
}