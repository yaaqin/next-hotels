'use client'
import { useParams } from 'next/navigation'
import { useAdminRestoDetail } from '@/src/hooks/query/adminResto/detail'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import Loading from '@/src/components/organisms/loading'

export default function AdminRestoDetailPage() {
    const { id } = useParams<{ id: string }>()
    const { data, isLoading } = useAdminRestoDetail(id)
    const { t } = useTranslation()

    if (isLoading) return <Loading />
    if (!data?.data) return <div className="text-center py-10 text-gray-500">Data not found</div>

    const admin = data.data

    return (
        <div className="space-y-6">

            {/* Header */}
            <section className="flex justify-between items-center">
                <h6 className="text-xl font-semibold">Detail Admin Restaurant</h6>
                <div className="flex gap-2">
                    <Link
                        href={`/dashboard/admin-restaurant/${admin.id}/edit`}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                    >
                        {t('label.edit')}
                    </Link>
                    <Link
                        href="/dashboard/admin-restaurant"
                        className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
                    >
                        {t('label.back')}
                    </Link>
                </div>
            </section>

            {/* Info Utama */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-base font-semibold text-gray-700 mb-4">Info Admin</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-gray-400 uppercase mb-1">ID</p>
                        <p className="text-sm font-mono text-gray-700">{admin.id}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase mb-1">{t('label.name')}</p>
                        <p className="text-sm font-medium text-gray-800">{admin.name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase mb-1">Email</p>
                        <p className="text-sm text-gray-700">{admin.email}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase mb-1">{t('label.phone')}</p>
                        <p className="text-sm text-gray-700">{admin.phone || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase mb-1">{t('label.status')}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${admin.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {admin.isActive ? t('label.active') : t('label.inactive')}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase mb-1">{t('label.createAt')}</p>
                        <p className="text-sm text-gray-700">
                            {new Date(admin.createdAt).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Site Access */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-base font-semibold text-gray-700 mb-4">Site Access</h3>
                {admin.siteAccess.length === 0 ? (
                    <p className="text-sm text-gray-400">-</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Site Code', 'Restaurant', 'Role', t('label.status'), t('label.assignedAt')].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {admin.siteAccess.map((s) => (
                                    <tr key={s.restaurantSite.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-mono text-xs">{s.restaurantSite.siteCode}</td>
                                        <td className="px-4 py-3">{s.restaurantSite.restaurant.name}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                                                {s.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.restaurantSite.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {s.restaurantSite.isActive ? t('label.active') : t('label.inactive')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {new Date(s.assignedAt).toLocaleDateString('id-ID', {
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

            {/* Ownerships */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-base font-semibold text-gray-700 mb-4">Ownerships</h3>
                {admin.ownerships.length === 0 ? (
                    <p className="text-sm text-gray-400">-</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['ID', t('label.name')].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {admin.ownerships.map((o, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-mono text-xs">{o?.id || '-'}</td>
                                        <td className="px-4 py-3">{o?.name || '-'}</td>
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