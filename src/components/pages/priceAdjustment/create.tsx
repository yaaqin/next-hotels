'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import Loading from '../../organisms/loading'
import SiteSelect, { useNeedsSite } from '../../organisms/priceAdjustment/SiteSelect'
import { DatePicker } from '../../molecules/inputs/datePicker'
import { Selects } from '../../molecules/inputs/selects'
import { format } from 'date-fns'
import { ADJUSTMENT_LABEL, formatRp } from '../../organisms/priceAdjustment/helpers'
import { usePriceAdjustmentOptions, usePriceCalendar } from '@/src/hooks/query/priceAdjustment'
import { useCreatePriceAdjustment } from '@/src/hooks/mutation/priceAdjustment'
import { AdjustmentType } from '@/src/models/priceAdjustment'

interface ItemForm {
  roomTypeId: string
  allRooms: boolean
  roomIds: string[]
  adjustment: AdjustmentType
  value: string
}

const emptyItem = (): ItemForm => ({ roomTypeId: '', allRooms: true, roomIds: [], adjustment: 'PERCENTAGE', value: '' })
// Sama dengan batas endpoint kalender
const MAX_PREVIEW_DAYS = 62

function applyChange(price: number, adjustment: AdjustmentType, value: number) {
  if (adjustment === 'FIXED_PRICE') return value
  if (adjustment === 'PERCENTAGE') return Math.max(0, Math.round(price * (1 + value / 100)))
  return Math.max(0, price + value)
}

const inputClass = 'w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white'
// Selects disamakan dengan inputClass supaya tinggi & sudutnya sejajar dengan input angka
const selectClass = 'pl-3 text-sm rounded-md'

// Form menyimpan tanggal sebagai "yyyy-MM-dd"; DatePicker pakai Date (zona lokal)
const toDate = (value: string) => {
  if (!value) return undefined
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}
const toDateString = (date: Date | undefined) => (date ? format(date, 'yyyy-MM-dd') : '')

export default function CreatePriceAdjustmentPage() {
  const [siteCode, setSiteCode] = useState<string>()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [items, setItems] = useState<ItemForm[]>([emptyItem()])

  const { needsSite, isLoading: loadingScope } = useNeedsSite(siteCode)
  const { data: options, isLoading: loadingOptions } = usePriceAdjustmentOptions(siteCode, !loadingScope && !needsSite)
  const roomTypes = options?.data.roomTypes ?? []
  const create = useCreatePriceAdjustment()

  const rangeDays = startDate && endDate
    ? Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86_400_000) + 1
    : 0
  const canPreview = rangeDays > 0 && rangeDays <= MAX_PREVIEW_DAYS && !needsSite
  const { data: calendar, isFetching: checking } = usePriceCalendar(
    { siteCode, start: startDate, end: endDate },
    canPreview,
  )

  const selectedTypeIds = [...new Set(items.map((i) => i.roomTypeId).filter(Boolean))]

  // Tanggal tanpa proposal per tipe yang dipilih
  const uncovered = useMemo(() => {
    if (!calendar) return []
    return selectedTypeIds
      .map((typeId) => ({
        typeId,
        dates: calendar.data.days
          .filter((d) => !d.types.find((t) => t.roomTypeId === typeId)?.hasProposal)
          .map((d) => d.date),
      }))
      .filter((u) => u.dates.length > 0)
  }, [calendar, selectedTypeIds.join(',')])

  // Contoh harga: malam pertama yang punya proposal
  const sampleFor = (item: ItemForm) => {
    if (!calendar || !item.roomTypeId || item.value === '') return null
    for (const day of calendar.data.days) {
      const cell = day.types.find((t) => t.roomTypeId === item.roomTypeId)
      if (cell?.hasProposal) {
        return { date: day.date, from: cell.proposalPrice, to: applyChange(cell.proposalPrice, item.adjustment, Number(item.value)) }
      }
    }
    return null
  }

  const update = (idx: number, patch: Partial<ItemForm>) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)))

  const itemsValid = items.every(
    (i) => i.roomTypeId && i.value !== '' && !isNaN(Number(i.value)) && (i.allRooms || i.roomIds.length > 0),
  )
  const canSubmit =
    !needsSite && title.trim() && startDate && endDate && rangeDays > 0 && itemsValid && uncovered.length === 0 && !create.isPending

  const submit = () => {
    if (!canSubmit) return
    create.mutate({
      site_code: siteCode,
      title: title.trim(),
      description: description.trim() || undefined,
      start_date: startDate,
      end_date: endDate,
      items: items.map((i) => ({
        room_type_id: i.roomTypeId,
        room_ids: i.allRooms ? undefined : i.roomIds,
        adjustment: i.adjustment,
        value: Number(i.value),
      })),
    })
  }

  const typeName = (id: string) => roomTypes.find((t) => t.id === id)?.name ?? id

  return (
    <div className="space-y-5 max-w-4xl">
      <section>
        <Link href="/dashboard/price-adjustment" className="text-xs text-gray-400 hover:underline">← Price Adjustment</Link>
        <h5 className="text-2xl font-bold mt-1">Buat Price Adjustment</h5>
        <p className="text-sm text-gray-500 mt-1">
          Perubahan dihitung dari harga proposal di tiap tanggal (setelah rule weekend / tanggal khusus). Setelah dibuat,
          adjustment perlu di-approve OWNER / SUPERADMIN.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-4 bg-white rounded-xl border border-gray-200 p-4">
        <SiteSelect value={siteCode} onChange={(code) => { setSiteCode(code); setItems([emptyItem()]) }} />
        <div className="md:col-span-2">
          <label className="text-xs text-gray-500">Nama</label>
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="mis. Kenaikan harga event minggu depan" />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-gray-500">Keterangan (opsional)</label>
          <input className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-500">Mulai</label>
          <DatePicker
            variant="default"
            className="mt-1"
            placeholder="Pilih tanggal mulai"
            displayFormat="dd MMM yyyy"
            value={toDate(startDate)}
            onChange={(date) => {
              const next = toDateString(date)
              setStartDate(next)
              // Tanggal selesai tidak boleh sebelum tanggal mulai
              if (endDate && next && endDate < next) setEndDate('')
            }}
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Sampai (termasuk)</label>
          <DatePicker
            variant="default"
            className="mt-1"
            placeholder="Pilih tanggal selesai"
            displayFormat="dd MMM yyyy"
            value={toDate(endDate)}
            minDate={toDate(startDate)}
            onChange={(date) => setEndDate(toDateString(date))}
          />
        </div>
      </div>

      {needsSite ? (
        <p className="text-sm text-gray-500">Pilih cabang dulu.</p>
      ) : loadingOptions ? (
        <Loading />
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => {
            const type = roomTypes.find((t) => t.id === item.roomTypeId)
            const sample = sampleFor(item)
            return (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">Perubahan #{idx + 1}</p>
                  {items.length > 1 && (
                    <button onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))} className="text-xs text-gray-400 hover:text-red-600">
                      Hapus
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Tipe kamar</label>
                    <Selects
                      label=""
                      value={item.roomTypeId}
                      onChange={(roomTypeId) => update(idx, { roomTypeId, roomIds: [] })}
                      placeholder="Pilih tipe"
                      options={roomTypes.map((t) => ({ id: t.id, value: t.id, label: t.name ?? t.id }))}
                      selectClassName={selectClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Jenis perubahan</label>
                    <Selects
                      label=""
                      value={item.adjustment}
                      onChange={(adjustment) => update(idx, { adjustment: adjustment as AdjustmentType })}
                      options={(Object.keys(ADJUSTMENT_LABEL) as AdjustmentType[]).map((a) => ({
                        id: a,
                        value: a,
                        label: ADJUSTMENT_LABEL[a],
                      }))}
                      showPlaceholder={false}
                      selectClassName={selectClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">
                      {item.adjustment === 'PERCENTAGE' ? 'Persen (minus = turun)' : item.adjustment === 'FIXED_AMOUNT' ? 'Nominal Rp (minus = turun)' : 'Harga per malam (Rp)'}
                    </label>
                    <input type="number" className={inputClass} value={item.value} onChange={(e) => update(idx, { value: e.target.value })} />
                  </div>
                </div>

                {type && (
                  <div className="space-y-2">
                    <div className="flex gap-4 text-sm">
                      <label className="flex items-center gap-2">
                        <input type="radio" checked={item.allRooms} onChange={() => update(idx, { allRooms: true, roomIds: [] })} />
                        Semua kamar ({type.rooms.length})
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" checked={!item.allRooms} onChange={() => update(idx, { allRooms: false })} />
                        Pilih kamar
                      </label>
                    </div>
                    {!item.allRooms && (
                      <div className="flex flex-wrap gap-2">
                        {type.rooms.map((room) => {
                          const on = item.roomIds.includes(room.id)
                          return (
                            <button
                              key={room.id}
                              type="button"
                              onClick={() =>
                                update(idx, { roomIds: on ? item.roomIds.filter((r) => r !== room.id) : [...item.roomIds, room.id] })
                              }
                              className={`px-2.5 py-1 rounded-md text-xs font-mono border ${
                                on ? 'bg-violet-600 text-white border-violet-600' : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              {room.number}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {sample && (
                  <p className="text-xs text-gray-500">
                    Contoh {sample.date}: harga proposal {formatRp(sample.from)} →{' '}
                    <span className={sample.to > sample.from ? 'text-rose-600 font-semibold' : 'text-emerald-600 font-semibold'}>
                      {formatRp(sample.to)}
                    </span>
                  </p>
                )}
              </div>
            )
          })}

          <button onClick={() => setItems((prev) => [...prev, emptyItem()])} className="text-sm text-blue-600 hover:underline">
            + Tambah perubahan
          </button>
        </div>
      )}

      {rangeDays > MAX_PREVIEW_DAYS && (
        <p className="text-xs text-gray-500">
          Rentang lebih dari {MAX_PREVIEW_DAYS} hari: pengecekan proposal dilakukan saat simpan.
        </p>
      )}
      {checking && <p className="text-xs text-gray-400">Mengecek price proposal...</p>}
      {uncovered.length > 0 && (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">
          <p className="font-semibold mb-1">Tanggal ini belum punya price proposal APPROVED, harga tidak bisa diubah:</p>
          {uncovered.map((u) => (
            <p key={u.typeId} className="text-xs">{typeName(u.typeId)}: {u.dates.join(', ')}</p>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={submit}
          disabled={!canSubmit}
          className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
        >
          {create.isPending ? 'Menyimpan...' : 'Simpan sebagai draft'}
        </button>
      </div>
    </div>
  )
}
