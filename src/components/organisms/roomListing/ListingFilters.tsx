'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { addDays, format, parse } from 'date-fns'
import { DatePicker } from '@/src/components/molecules/inputs/datePicker'
import { Selects } from '@/src/components/molecules/inputs/selects'

// Query string pakai format yyyy-MM-dd; DatePicker pakai Date (waktu lokal)
const toDate = (value: string | null) => (value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined)
const toParam = (date: Date) => format(date, 'yyyy-MM-dd')

export interface ListingFiltersLabels {
  checkin: string
  checkout: string
  checkAvailability: string
  clearDates: string
  sortBy: string
  sortPriceAsc: string
  sortPriceDesc: string
  sortNumber: string
  selectDate: string
}

// Filter cuma mengubah query string — path (halaman yang diindex) tidak berubah.
// Label dikirim dari server (bahasa cookie) supaya HTML SSR & hasil hidrasi sama.
export default function ListingFilters({ labels }: { labels: ListingFiltersLabels }) {
  const sortOptions = [
    { id: 'price_asc', value: 'price_asc', label: labels.sortPriceAsc },
    { id: 'price_desc', value: 'price_desc', label: labels.sortPriceDesc },
    { id: 'number', value: 'number', label: labels.sortNumber },
  ]

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [checkin, setCheckin] = useState<Date | undefined>(toDate(searchParams.get('checkin')))
  const [checkout, setCheckout] = useState<Date | undefined>(toDate(searchParams.get('checkout')))

  const handleCheckin = (date: Date | undefined) => {
    setCheckin(date)
    // Check-out harus setelah check-in
    if (date && checkout && checkout <= date) setCheckout(undefined)
  }
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
      <DatePicker
        className="md:w-60"
        label={labels.checkin}
        value={checkin}
        onChange={handleCheckin}
        placeholder={labels.selectDate}
      />
      <DatePicker
        className="md:w-60"
        label={labels.checkout}
        value={checkout}
        onChange={setCheckout}
        minDate={checkin ? addDays(checkin, 1) : undefined}
        placeholder={labels.selectDate}
      />
      <button
        type="button"
        disabled={!canApplyDates}
        onClick={() => push({ checkin: toParam(checkin!), checkout: toParam(checkout!) })}
        className="px-5 py-3 rounded-xl text-xs font-semibold tracking-wide text-white bg-[#0A1828] hover:bg-[#163356] disabled:opacity-40 transition-colors"
      >
        {labels.checkAvailability}
      </button>
      {hasDates && (
        <button
          type="button"
          onClick={() => {
            setCheckin(undefined)
            setCheckout(undefined)
            push({ checkin: null, checkout: null })
          }}
          className="text-xs text-gray-500 underline"
        >
          {labels.clearDates}
        </button>
      )}

      <Selects
        variant="public"
        containerClassName="md:ml-auto md:w-52"
        label={labels.sortBy}
        value={sort}
        onChange={(value) => push({ sort: value === 'price_asc' ? null : value })}
        options={sortOptions}
        showPlaceholder={false}
      />
    </div>
  )
}
