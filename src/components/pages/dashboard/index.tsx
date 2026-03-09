'use client'
import { useDailyMatrix } from "@/src/hooks/query/finance/dailyMatrix"
import { DailyMetricsCard } from "../../organisms/home/dailyMatrix"
import Loading from "../../organisms/loading"

export default function DashboardAdmin() {
  const { data, isLoading } = useDailyMatrix()
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : data && (
        <DailyMetricsCard data={data?.data} />
      )}
    </>
  )
}
