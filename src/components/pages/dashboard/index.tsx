'use client'

import { useDailyMatrix } from "@/src/hooks/query/finance/dailyMatrix"
import { DailyMetricsCard } from "../../organisms/home/dailyMatrix"
import Loading from "../../organisms/loading"
import RevenueOccupancyChart from "../../organisms/dashboard/chart"
import { REVENUE_OCCUPANCY_DUMMY } from "@/src/constans/dummy"

export default function DashboardAdmin() {
  const { data, isLoading } = useDailyMatrix()

  return (
    <div className="flex flex-col gap-4 p-6">
      {isLoading ? (
        <Loading />
      ) : data && (
        <DailyMetricsCard data={data?.data} />
      )}
      <RevenueOccupancyChart data={REVENUE_OCCUPANCY_DUMMY} />
    </div>
  )
}