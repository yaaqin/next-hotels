'use client'
import { useAdminRestoList } from '@/src/hooks/query/adminResto/list'
import Link from 'next/link'
import Loading from '../../organisms/loading'
import { useTranslation } from 'react-i18next'
import AdminRestoTable from '../../organisms/adminRestaurant/table'

export default function AdminRestoPage() {
  const { data, isLoading } = useAdminRestoList()
  const { t } = useTranslation()

  return (
    <div>
      <section className="flex justify-between items-center mb-4">
        <h6 className="text-xl font-semibold">List Admin Restaurant</h6>
        <Link
          href="/dashboard/admin-resto/create"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          {t('label.create')}
        </Link>
      </section>

      {isLoading ? (
        <Loading />
      ) : data && (
        <AdminRestoTable data={data.data} />
      )}
    </div>
  )
}