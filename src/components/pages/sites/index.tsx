'use client'
import { useState } from 'react'
import { useSiteList } from '@/src/hooks/query/sites'
import { useUpdateSiteSeo } from '@/src/hooks/mutation/sites/updateSeo'
import { siteListState } from '@/src/models/sites/list'
import { SiteSeoFormModal } from '../../organisms/sites/SiteSeoFormModal'
import Loading from '../../organisms/loading'

export default function SitePages() {
  const { data, isLoading } = useSiteList()
  const update = useUpdateSiteSeo()
  const [editing, setEditing] = useState<siteListState | null>(null)

  return (
    <div className="space-y-4">
      {editing && (
        <SiteSeoFormModal
          site={editing}
          isSaving={update.isPending}
          onClose={() => setEditing(null)}
          onSave={(payload) => update.mutate({ siteCode: editing.sitecode, ...payload }, { onSuccess: () => setEditing(null) })}
        />
      )}

      <section>
        <h5 className="text-3xl font-bold">Cabang</h5>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">
          Slug, kota, dan alamat dipakai di halaman listing kamar (/hotel/...), FAQ, dan data Google.
        </p>
      </section>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Cabang</th>
                <th className="px-6 py-3">Halaman</th>
                <th className="px-6 py-3">Kota</th>
                <th className="px-6 py-3">Alamat</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data.map((site) => (
                <tr key={site.id} className="hover:bg-gray-50 align-top">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{site.nama}</p>
                    <p className="text-xs text-gray-500">
                      {site.sitecode} · {site.lokasi}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {site.slug ? `/hotel/${site.slug}` : <span className="text-gray-400">—</span>}
                    {site.aliases.length > 0 && <p className="text-xs text-gray-400">alias: {site.aliases.join(', ')}</p>}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{site.city ?? <span className="text-gray-400">—</span>}</td>
                  <td className="px-6 py-4 text-gray-700 max-w-xs">
                    {site.address ?? <span className="text-amber-600 text-xs">Belum diisi</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setEditing(site)} className="text-blue-600 hover:underline">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
