'use client'
import { AdminRestoRow } from "@/src/components/organisms/restaurant/restoDashboard/admin/column"
import AdminRestoTable from "@/src/components/organisms/restaurant/restoDashboard/admin/table"
import { useRestoDataAdminRestoList } from "@/src/hooks/query/restaurant/restoDashboard/adminResto/list"
import { Owner, Staff } from "@/src/models/restaurant/restoDashboard/adminResto/list"

export default function AdminRestoSection() {
  const { data, isLoading } = useRestoDataAdminRestoList()

  const rows: AdminRestoRow[] = [
    ...(data?.data?.owners ?? []).map((o: Owner) => ({
      ...o,
      type: 'OWNER' as const,
    })),
    ...(data?.data?.staff ?? []).map((s: Staff) => ({
      ...s,
      type: 'STAFF' as const,
    })),
  ]

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <p className="text-sm text-gray-400">Memuat data admin...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Tim Restoran
          </p>
          <p className="text-xl font-bold text-gray-900 mt-0.5">
            {data?.data?.restaurant?.name}
          </p>
          <p className="text-xs text-gray-400">
            {rows.length} anggota tim
          </p>
        </div>
      </div>

      <AdminRestoTable data={rows} />
    </div>
  )
}