'use client'

import { useState } from 'react'
import Loading from '../../organisms/loading'
import { FaqFormModal } from '../../organisms/listingFaq/FaqFormModal'
import { useListingFaqList } from '@/src/hooks/query/listingFaq/list'
import {
  useCreateListingFaq,
  useDeleteListingFaq,
  useReorderListingFaq,
  useSetAutoFaq,
  useUpdateListingFaq,
} from '@/src/hooks/mutation/listingFaq'
import { listingFaqCustomItem, listingFaqItem } from '@/src/models/listingFaq'

const LANG_BADGE: Record<string, string> = { idn: 'ID', eng: 'EN', jpn: 'JP', chn: 'CN' }

function scopeLabel(faq: listingFaqCustomItem) {
  const site = faq.siteName ?? 'Semua cabang'
  const type = faq.roomTypeName ?? 'semua tipe'
  return `${site} · ${type}`
}

// FAQ di halaman listing kamar (/hotel/...): FAQ otomatis (dirakit dari data) dan FAQ buatan admin
// tampil dalam satu urutan sesuai daftar ini.
export default function ListingFaqPage() {
  const { data, isLoading } = useListingFaqList()
  const create = useCreateListingFaq()
  const update = useUpdateListingFaq()
  const remove = useDeleteListingFaq()
  const setAuto = useSetAutoFaq()
  const reorder = useReorderListingFaq()
  // undefined = modal tertutup, null = buat baru
  const [editing, setEditing] = useState<listingFaqCustomItem | null | undefined>(undefined)

  const items = data?.data ?? []

  const move = (index: number, delta: number) => {
    const next = [...items]
    const [item] = next.splice(index, 1)
    next.splice(index + delta, 0, item)
    reorder.mutate(next.map((i: listingFaqItem) => ({ kind: i.kind, id: i.id })))
  }

  return (
    <div className="space-y-4">
      {editing !== undefined && (
        <FaqFormModal
          faq={editing}
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
          <h5 className="text-3xl font-bold">FAQ Listing Kamar</h5>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Pertanyaan di bagian bawah halaman listing kamar (/hotel, /hotel/merak, /hotel/merak/deluxe, ...).
            FAQ <b>otomatis</b> dirakit dari data (harga, fasilitas, policy, metode bayar) dan ikut berubah sendiri;
            di sini cukup atur tampil & urutannya. FAQ <b>buatan sendiri</b> untuk hal yang tidak tercatat di
            sistem, mis. jam check-in, sarapan, parkir.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          <a href="/hotel" target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
            Lihat halaman
          </a>
          <button
            onClick={() => setEditing(null)}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Tambah FAQ
          </button>
        </div>
      </section>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3 w-20">Urutan</th>
                <th className="px-4 py-3">Pertanyaan</th>
                <th className="px-4 py-3">Jenis / cakupan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`bg-white divide-y divide-gray-200 ${reorder.isPending ? 'opacity-60' : ''}`}>
              {items.map((item, i) => {
                const visible = item.kind === 'auto' ? !item.isHidden : item.isActive
                const idn = item.kind === 'custom' ? item.translations.find((t) => t.lang === 'idn') : null
                return (
                  <tr key={`${item.kind}-${item.id}`} className={`hover:bg-gray-50 ${visible ? '' : 'text-gray-400'}`}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          aria-label="Naikkan"
                          disabled={i === 0 || reorder.isPending}
                          onClick={() => move(i, -1)}
                          className="w-7 h-7 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          aria-label="Turunkan"
                          disabled={i === items.length - 1 || reorder.isPending}
                          onClick={() => move(i, 1)}
                          className="w-7 h-7 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {item.kind === 'auto' ? (
                        <span className={visible ? 'font-medium text-gray-900' : ''}>{item.label}</span>
                      ) : (
                        <div>
                          <p className={visible ? 'font-medium text-gray-900' : ''}>{idn?.question}</p>
                          <p className="text-xs text-gray-500 line-clamp-1 max-w-xl">{idn?.answer}</p>
                          <div className="flex gap-1 mt-1">
                            {item.translations.map((t) => (
                              <span key={t.lang} className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] text-gray-500">
                                {LANG_BADGE[t.lang] ?? t.lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {item.kind === 'auto' ? (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700">
                          Otomatis · semua halaman
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-violet-50 text-violet-700">
                          {scopeLabel(item)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          item.kind === 'auto'
                            ? setAuto.mutate({ key: item.id, isHidden: !item.isHidden })
                            : update.mutate({ id: item.id, isActive: !item.isActive })
                        }
                        disabled={setAuto.isPending || update.isPending}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium disabled:opacity-50 ${
                          visible ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {visible ? 'Tampil' : 'Disembunyikan'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-3">
                      {item.kind === 'custom' ? (
                        <>
                          <button onClick={() => setEditing(item)} className="text-blue-600 hover:underline">
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus FAQ "${idn?.question}"?`)) remove.mutate(item.id)
                            }}
                            disabled={remove.isPending}
                            className="text-gray-500 hover:underline disabled:opacity-50"
                          >
                            Hapus
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">Isi dari data</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
