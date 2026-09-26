'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export interface ListingFiltersLabels {
  checkin: string
  checkout: string
  checkAvailability: string
  clearDates: string
  sortBy: string
  sortPriceAsc: string
  sortPriceDesc: string
  sortNumber: string
}

// Filter cuma mengubah query string — path (halaman yang diindex) tidak berubah.
// Label dikirim dari server (bahasa cookie) supaya HTML SSR & hasil hidrasi sama.
export default function ListingFilters({ labels }: { labels: ListingFiltersLabels }) {
  const sortOptions = [
    { value: 'price_asc', label: labels.sortPriceAsc },
    { value: 'price_desc', label: labels.sortPriceDesc },
    { value: 'number', label: labels.sortNumber },
  ]

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [checkin, setCheckin] = useState(searchParams.get('checkin') ?? '')
  const [checkout, setCheckout] = useState(searchParams.get('checkout') ?? '')
  const sort = searchParams.get('sort') ?? 'price_asc'

  const push = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(patch)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    params.delete('page')
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const canApplyDates = !!checkin && !!checkout && checkout > checkin
  const hasDates = searchParams.has('checkin')

  return (
    <div className="bg-white border border-[#DCE6F2] rounded-2xl p-4 flex flex-col md:flex-row md:items-end gap-3">
      <label className="flex flex-col gap-1 text-[10px] font-semibold tracking-widest uppercase text-gray-400">
        {labels.checkin}
        <input
          type="date"
          value={checkin}
          onChange={(e) => setCheckin(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 font-normal normal-case tracking-normal"
        />
      </label>
      <label className="flex flex-col gap-1 text-[10px] font-semibold tracking-widest uppercase text-gray-400">
        {labels.checkout}
        <input
          type="date"
          value={checkout}
          min={checkin || undefined}
          onChange={(e) => setCheckout(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 font-normal normal-case tracking-normal"
        />
      </label>
      <button
        type="button"
        disabled={!canApplyDates}
        onClick={() => push({ checkin, checkout })}
        className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#05111F] text-white disabled:opacity-40"
      >
        {labels.checkAvailability}
      </button>
      {hasDates && (
        <button
          type="button"
          onClick={() => {
            setCheckin('')
            setCheckout('')
            push({ checkin: null, checkout: null })
          }}
          className="text-xs text-gray-500 underline"
        >
          {labels.clearDates}
        </button>
      )}

      <label className="md:ml-auto flex flex-col gap-1 text-[10px] font-semibold tracking-widest uppercase text-gray-400">
        {labels.sortBy}
        <select
          value={sort}
          onChange={(e) => push({ sort: e.target.value === 'price_asc' ? null : e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 font-normal normal-case tracking-normal"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>
    </div>
  )
}
