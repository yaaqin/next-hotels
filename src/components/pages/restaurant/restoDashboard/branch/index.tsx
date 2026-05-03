'use client'
import BranchRestoTable from "@/src/components/organisms/restaurant/restoDashboard/branch/table"
import { useRestoBranchList } from "@/src/hooks/query/restaurant/restoDashboard/branch/list"

export default function BranchRestoSection() {
  const { data, isLoading } = useRestoBranchList()

  const rows = data?.data ?? []

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <p className="text-sm text-gray-400">Memuat data cabang...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Cabang Restoran
          </p>
          <p className="text-xl font-bold text-gray-900 mt-0.5">
            Daftar Cabang
          </p>
          <p className="text-xs text-gray-400">
            {rows.length} cabang terdaftar
          </p>
        </div>
      </div>

      <BranchRestoTable data={rows} />
    </div>
  )
}