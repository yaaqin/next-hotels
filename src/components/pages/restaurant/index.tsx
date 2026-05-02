'use client'
import { useRestoList } from '@/src/hooks/query/restaurant/list'
import RestaurantTable from '../../organisms/restaurant/table'
import Link from 'next/link'
import Loading from '../../organisms/loading'
import { useTranslation } from 'react-i18next'

export default function RestaurantPage() {
  const { data, isLoading } = useRestoList()
  const { t } = useTranslation()

  return (
    <div>
      <section className="flex justify-between items-center mb-4">
        <h6 className="text-xl font-semibold">List Restaurant</h6>
        <Link
          href="/dashboard/restaurant/create"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          {t('label.create')}
        </Link>
      </section>

      {isLoading ? (
        <Loading />
      ) : data && (
        <RestaurantTable data={data.data} />
      )}
    </div>
  )
}