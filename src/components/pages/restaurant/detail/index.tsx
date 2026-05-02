'use client'
import { useParams } from 'next/navigation'
import { useRestoDetail } from '@/src/hooks/query/restaurant/detail'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import Loading from '@/src/components/organisms/loading'

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useRestoDetail(id)
  const { t } = useTranslation()

  if (isLoading) return <Loading />
  if (!data?.data) return <div className="text-center py-10 text-gray-500">Data not found</div>

  const resto = data.data

  return (
    <div className="space-y-6">

      {/* Header */}
      <section className="flex justify-between items-center">
        <h6 className="text-xl font-semibold">Detail Restaurant</h6>
        <Link
          href="/dashboard/restaurant"
          className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
        >
          {t('label.back')}
        </Link>
      </section>

      {/* Info Utama */}
      <div className="bg-white rounded-lg shadow p-6 flex gap-6 items-start">
        {resto.logoUrl && (
          <div className="shrink-0">
            <Image
              src={resto.logoUrl}
              alt={resto.name}
              width={80}
              height={80}
              className="rounded-lg object-cover border border-gray-200"
            />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-800">{resto.name}</h2>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              resto.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {resto.isActive ? t('label.active') : t('label.inactive')}
            </span>
          </div>
          <p className="text-gray-500 text-sm">{resto.description || '-'}</p>
          <p className="text-xs text-gray-400">
            {t('label.createAt')}:{' '}
            {new Date(resto.createdAt).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      {/* Ownerships */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-base font-semibold text-gray-700 mb-4">
          {t('label.owner')}
        </h3>
        {resto.ownerships.length === 0 ? (
          <p className="text-sm text-gray-400">-</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['ID', t('label.name'), 'Email', t('label.status'), t('label.assignedAt')].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resto.ownerships.map((o) => (
                  <tr key={o.restaurantAdmin.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{o.restaurantAdmin.id}</td>
                    <td className="px-4 py-3">{o.restaurantAdmin.name}</td>
                    <td className="px-4 py-3 text-gray-600">{o.restaurantAdmin.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        o.restaurantAdmin.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {o.restaurantAdmin.isActive ? t('label.active') : t('label.inactive')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(o.assignedAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Restaurant Sites */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-base font-semibold text-gray-700 mb-4">
          {t('label.site')}
        </h3>
        {resto.restaurantSites.length === 0 ? (
          <p className="text-sm text-gray-400">-</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Site Code', 'Nama', 'Lokasi', t('label.status'), t('label.createAt')].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resto.restaurantSites.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{s.siteCode}</td>
                    <td className="px-4 py-3">{s.site.nama}</td>
                    <td className="px-4 py-3 text-gray-600">{s.site.lokasi}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        s.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {s.isActive ? t('label.active') : t('label.inactive')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(s.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}