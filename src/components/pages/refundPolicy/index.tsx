'use client'

import { useState } from 'react'
import Loading from '../../organisms/loading'
import { RefundPolicyFormModal } from '../../organisms/refundPolicy/RefundPolicyFormModal'
import { useRefundPolicyList } from '@/src/hooks/query/refundPolicy/list'
import { useCreateRefundPolicy, useDeleteRefundPolicy, useUpdateRefundPolicy } from '@/src/hooks/mutation/refundPolicy'
import { refundPolicyItem } from '@/src/models/refundPolicy/list'

function rangeLabel(p: Pick<refundPolicyItem, 'minDays' | 'maxDays'>) {
  if (p.maxDays === null) return `H-${p.minDays} atau lebih awal`
  if (p.minDays === 0 && p.maxDays === 0) return 'Hari H'
  if (p.minDays === p.maxDays) return `H-${p.minDays}`
  return `H-${p.maxDays} s/d H-${p.minDays}`
}

export default function RefundPolicyPage() {
  const { data, isLoading } = useRefundPolicyList()
  const create = useCreateRefundPolicy()
  const update = useUpdateRefundPolicy()
  const remove = useDeleteRefundPolicy()
  // undefined = modal tertutup, null = buat baru
  const [editing, setEditing] = useState<refundPolicyItem | null | undefined>(undefined)

  const policies = data?.data ?? []

  return (
    <div className="space-y-4">
      {editing !== undefined && (
        <RefundPolicyFormModal
          policy={editing}
          isSaving={create.isPending || update.isPending}
          onClose={() => setEditing(undefined)}
          onSave={(payload) => {
            const done = { onSuccess: () => setEditing(undefined) }
            if (editing) update.mutate({ id: editing.id, ...payload }, done)
            else create.mutate(payload, done)
          }}
        />
      )}

      <section className="flex items-start justify-between gap-4">
        <div>
          <h5 className="text-3xl font-bold">Refund Policy</h5>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Besar refund saat tamu cancel booking, berdasarkan jarak hari ke check-in. Berlaku untuk semua cabang dan
            tampil di FAQ halaman listing kamar. Rentang hari antar policy tidak boleh tumpang tindih.
          </p>
        </div>
        <button
          onClick={() => setEditing(null)}
          className="shrink-0 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          Tambah policy
        </button>
      </section>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Nama</th>
                <th className="px-6 py-3">Berlaku</th>
                <th className="px-6 py-3">Refund</th>
                <th className="px-6 py-3">Jenis</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {policies.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    Belum ada policy refund.
                  </td>
                </tr>
              )}
              {policies.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 text-gray-700">{rangeLabel(p)}</td>
                  <td className="px-6 py-4 text-emerald-700 font-medium">{p.refundPercent}%</td>
                  <td className="px-6 py-4 text-gray-700">
                    {[p.allowCredit && 'Credit', p.allowCash && 'Cash'].filter(Boolean).join(' · ')}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => update.mutate({ id: p.id, isActive: !p.isActive })}
                      disabled={update.isPending}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium disabled:opacity-50 ${
                        p.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {p.isActive ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap space-x-3">
                    <button onClick={() => setEditing(p)} className="text-blue-600 hover:underline">
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus policy "${p.name}"? Policy yang sudah pernah dipakai tidak bisa dihapus, nonaktifkan saja.`)) {
                          remove.mutate(p.id)
                        }
                      }}
                      disabled={remove.isPending}
                      className="text-gray-500 hover:underline disabled:opacity-50"
                    >
                      Hapus
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
