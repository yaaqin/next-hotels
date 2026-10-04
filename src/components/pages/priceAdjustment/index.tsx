'use client'

import Link from 'next/link'
import { useState } from 'react'
import Loading from '../../organisms/loading'
import { usePriceAdjustmentList } from '@/src/hooks/query/priceAdjustment'
import PriceCompareCalendar from '../../organisms/priceAdjustment/PriceCompareCalendar'
import SiteSelect, { useNeedsSite } from '../../organisms/priceAdjustment/SiteSelect'
import { Selects } from '../../molecules/inputs/selects'
import { STATUS_STYLE, formatDate, groupItems } from '../../organisms/priceAdjustment/helpers'

const STATUSES = ['', 'DRAFT', 'APPROVED', 'REJECTED']

export default function PriceAdjustmentPage() {
  const [tab, setTab] = useState<'list' | 'calendar'>('list')
  const [status, setStatus] = useState('')
  const [siteCode, setSiteCode] = useState<string>()
  const { data, isLoading } = usePriceAdjustmentList(status || undefined)
  const { needsSite } = useNeedsSite(siteCode)

  const list = (data?.data ?? []).filter((adj) => !siteCode || adj.siteCode === siteCode)

  return (
    <div className="space-y-4">
      <section className="flex items-start justify-between gap-4">
        <div>
          <h5 className="text-3xl font-bold">Price Adjustment</h5>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Naik / turunkan harga di atas price proposal yang sudah APPROVED, per tipe atau per kamar. Hanya bisa di
            tanggal yang sudah ada proposalnya. Booking yang sudah dibuat (termasuk yang sudah dapat VA) tetap memakai
            harga lama. Kalau ada dua adjustment di tanggal & kamar yang sama, yang di-approve paling akhir yang berlaku.
          </p>
        </div>
        <Link
          href="/dashboard/price-adjustment/create"
          className="shrink-0 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          Buat adjustment
        </Link>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
          {(['list', 'calendar'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 ${tab === t ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              {t === 'list' ? 'Daftar' : 'Kalender harga'}
            </button>
          ))}
        </div>
        <SiteSelect value={siteCode} onChange={setSiteCode} />
        {tab === 'list' && (
          <Selects
            label=""
            value={status}
            onChange={setStatus}
            options={STATUSES.map((s) => ({ id: s || 'all', value: s, label: s || 'Semua status' }))}
            showPlaceholder={false}
            selectClassName="text-sm"
          />
        )}
      </div>

      {tab === 'calendar' ? (
        needsSite ? (
          <p className="text-sm text-gray-500">Pilih cabang dulu untuk melihat kalender harga.</p>
        ) : (
          <PriceCompareCalendar siteCode={siteCode} />
        )
      ) : isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Nama</th>
                <th className="px-6 py-3">Cabang</th>
                <th className="px-6 py-3">Periode</th>
                <th className="px-6 py-3">Perubahan</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {list.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">Belum ada price adjustment.</td>
                </tr>
              )}
              {list.map((adj) => (
                <tr key={adj.id} className="hover:bg-gray-50 align-top">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{adj.title}</p>
                    <p className="text-xs text-gray-400">oleh {adj.creator.username}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{adj.siteCode}</td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                    {formatDate(adj.startDate)} — {formatDate(adj.endDate)}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {groupItems(adj.items).map((g, i) => (
                      <p key={i} className="text-xs">
                        <span className="font-medium">{g.label}</span> ({g.target}) · {g.change}
                      </p>
                    ))}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[adj.status]}`}>
                      {adj.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/dashboard/price-adjustment/${adj.id}`} className="text-blue-600 hover:underline">
                      Detail
                    </Link>
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
