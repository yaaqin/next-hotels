'use client'

import { useDailyMatrix } from "@/src/hooks/query/finance/dailyMatrix"
import { DailyMetricsCard } from "../../organisms/home/dailyMatrix"
import Loading from "../../organisms/loading"
import RevenueOccupancyChart from "../../organisms/dashboard/chart"
import { useRevenueOccupancy } from "@/src/hooks/query/finance/revenueOccupancy"
import { useCallback, useState } from "react"
import { downloadBookingReport } from "@/src/services/finance/report"
import RevenueDailyChart from "../../organisms/dashboard/revenueDailyChart"
import RevenueDetail from "../../organisms/dashboard/revenueDetail"
import { useRevenueDaily, wibToday } from "@/src/hooks/query/finance/revenueDaily"

export default function DashboardAdmin() {
  const { data, isLoading } = useDailyMatrix()
  const { data: revoccup, startDate, endDate } = useRevenueOccupancy()
  const [isDownloading, setIsDownloading] = useState(false)

  // Uang masuk per tanggal bayar + rincian hari yang dipilih (default hari ini)
  const { data: revenueDaily } = useRevenueDaily(30)
  const [selectedDate, setSelectedDate] = useState(wibToday)
  const handleSelectDate = useCallback((date: string) => setSelectedDate(date), [])

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
      {revenueDaily && (
        <RevenueDailyChart
          data={revenueDaily.data}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
        />
      )}
      <RevenueDetail date={selectedDate} />
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