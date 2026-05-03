'use client'
import Link from "next/link"
import { useMenuRestoList } from "@/src/hooks/query/restaurant/restoDashboard/menu/list"
import MenuRestoTable from "@/src/components/organisms/restaurant/restoDashboard/menu/table"

export default function MenuRestoSection() {
  const { data, isLoading } = useMenuRestoList()

  const rows = data?.data ?? []

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-orange-50 p-10 text-center">
        <p className="text-sm text-orange-300">Memuat data menu...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-orange-400 uppercase tracking-wider">
            Manajemen Menu
          </p>
          <p className="text-xl font-bold text-gray-900 mt-0.5">
            Daftar Menu
          </p>
          <p className="text-xs text-gray-400">
            {rows.length} menu terdaftar
          </p>
        </div>

        <Link
          href="/restaurant/menu/create"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Menu
        </Link>
      </div>

      <MenuRestoTable data={rows} />
    </div>
  )
}