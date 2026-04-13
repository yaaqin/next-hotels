'use client'

import { useDailyMatrix } from "@/src/hooks/query/finance/dailyMatrix"
import { DailyMetricsCard } from "../../organisms/home/dailyMatrix"
import Loading from "../../organisms/loading"
import RevenueOccupancyChart from "../../organisms/dashboard/chart"
import { useRevenueOccupancy } from "@/src/hooks/query/finance/revenueOccupancy"
import { useState } from "react"
import { downloadBookingReport } from "@/src/services/finance/report"

export default function DashboardAdmin() {
  const { data, isLoading } = useDailyMatrix()
  const { data: revoccup, startDate, endDate } = useRevenueOccupancy()
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      await downloadBookingReport(startDate, endDate)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      {isLoading ? (
        <Loading />
      ) : data && (
        <DailyMetricsCard data={data?.data} />
      )}
      {revoccup && (
        <RevenueOccupancyChart data={revoccup.data} />
      )}

      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="self-start px-4 py-2 bg-blue-600 text-white text-sm rounded-lg disabled:opacity-50"
      >
        {isDownloading ? 'Downloading...' : 'Download Report'}
      </button>
    </div>
  )
}