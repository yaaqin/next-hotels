'use client'

import { useState } from 'react'
import Loading from '../../organisms/loading'
import { PolicyFormModal } from '../../organisms/reschedulePolicy/PolicyFormModal'
import { useReschedulePolicyList } from '@/src/hooks/query/reschedulePolicy/list'
import {
  useCreateReschedulePolicy,
  useDeleteReschedulePolicy,
  useUpdateReschedulePolicy,
} from '@/src/hooks/mutation/reschedulePolicy'
import { reschedulePolicyItem } from '@/src/models/reschedulePolicy/list'

function rangeLabel(p: Pick<reschedulePolicyItem, 'minDays' | 'maxDays'>) {
  if (p.maxDays === null) return `H-${p.minDays} atau lebih awal`
  if (p.minDays === 0 && p.maxDays === 0) return 'Hari H'
  if (p.minDays === p.maxDays) return `H-${p.minDays}`
  return `H-${p.maxDays} s/d H-${p.minDays}`
}

export default function ReschedulePolicyPage() {
  const { data, isLoading } = useReschedulePolicyList()
  const create = useCreateReschedulePolicy()
  const update = useUpdateReschedulePolicy()
  const remove = useDeleteReschedulePolicy()
  // undefined = modal tertutup, null = buat baru
  const [editing, setEditing] = useState<reschedulePolicyItem | null | undefined>(undefined)

  const policies = data?.data ?? []
  const active = policies.filter((p) => p.isActive)
  const coversDayH = active.some((p) => p.minDays === 0)

  return (
    <div className="space-y-4">
      {editing !== undefined && (
        <PolicyFormModal
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
          <h5 className="text-3xl font-bold">Reschedule Policy</h5>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Potongan saat tamu reschedule, berdasarkan jarak hari ke check-in. Berlaku untuk semua cabang.
            Booking yang sudah CONFIRMED (dikonfirmasi resepsionis di hari H) selalu memakai policy hari H.
            Kalau tidak ada policy aktif untuk suatu H-, tamu tidak bisa reschedule di hari itu.
          </p>
        </div>
        <button
          onClick={() => setEditing(null)}
          className="shrink-0 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          Tambah policy
        </button>
      </section>

      {!isLoading && !coversDayH && (
        <div className="px-4 py-3 rounded-lg bg-amber-50 border border-amber-100 text-sm text-amber-700">
          Belum ada policy aktif untuk hari H. Booking CONFIRMED dan booking yang check-in hari ini tidak bisa
          di-reschedule. Tambah policy dengan rentang hari H (Mulai H-0, Sampai H-0) kalau mau dibuka.
        </div>
      )}

      <p className="text-xs text-gray-400">Hanya admin sistem (DEV / SUPERADMIN) yang bisa menambah atau mengubah policy.</p>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Nama</th>
                <th className="px-6 py-3">Berlaku</th>
                <th className="px-6 py-3">Potongan</th>
                <th className="px-6 py-3">Dipertahankan</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {policies.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    Belum ada policy. Selama kosong, semua reschedule ditolak.
                  </td>
                </tr>
              )}
              {policies.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {rangeLabel(p)}
                    {p.minDays === 0 && (
                      <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700">
                        termasuk CONFIRMED
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-red-600 font-medium">{p.penaltyPercent}%</td>
                  <td className="px-6 py-4 text-gray-700">{p.reschedulePercent}%</td>
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
