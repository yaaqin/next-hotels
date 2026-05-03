'use client'
import Link from "next/link"
import FoodCategoryTable from "../../organisms/foodCategory/table"
import { useFoodCategoryList } from "@/src/hooks/query/foodCategory/list"

export default function FoodCategorySection() {
  const { data, isLoading } = useFoodCategoryList()

  const rows = data?.data ?? []

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-blue-50 p-10 text-center">
        <p className="text-sm text-blue-300">Memuat data kategori...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-blue-400 uppercase tracking-wider">
            Master Data
          </p>
          <p className="text-xl font-bold text-gray-900 mt-0.5">
            Kategori Makanan
          </p>
          <p className="text-xs text-gray-400">
            {rows.length} kategori terdaftar
          </p>
        </div>

        <Link
          href="/dashboard/food-category/create"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Kategori
        </Link>
      </div>

      <FoodCategoryTable data={rows} />
    </div>
  )
}