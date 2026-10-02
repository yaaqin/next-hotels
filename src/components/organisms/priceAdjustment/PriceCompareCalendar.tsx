'use client'

import { useMemo, useState } from 'react'
import Loading from '../loading'
import { usePriceCalendar } from '@/src/hooks/query/priceAdjustment'
import { calendarTypeCell } from '@/src/models/priceAdjustment'

const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]
const DAYS_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

const pad = (n: number) => String(n).padStart(2, '0')
const toKey = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`
const formatRp = (v: number) => 'Rp ' + v.toLocaleString('id-ID')

function deltaLabel(from: number, to: number) {
  if (from === to || from === 0) return null
  const pct = Math.round(((to - from) / from) * 100)
  return `${pct > 0 ? '+' : ''}${pct}%`
}

interface Props {
  // Kosong untuk akun cabang (BE pakai cabangnya sendiri)
  siteCode?: string
  // Preview adjustment DRAFT seolah sudah di-approve
  adjustmentId?: string
  // Rentang yang disorot (periode adjustment)
  highlight?: { start: string; end: string }
  // Tipe yang ditampilkan duluan
  initialRoomTypeId?: string
  initialMonth?: string
}

export default function PriceCompareCalendar({ siteCode, adjustmentId, highlight, initialRoomTypeId, initialMonth }: Props) {
  const init = initialMonth ? new Date(initialMonth) : new Date()
  const [year, setYear] = useState(init.getFullYear())
  const [month, setMonth] = useState(init.getMonth())
  const [compare, setCompare] = useState(true)
  const [roomTypeId, setRoomTypeId] = useState<string | undefined>(initialRoomTypeId)
  const [selected, setSelected] = useState<string | null>(null)

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const { data, isLoading } = usePriceCalendar({
    siteCode,
    adjustmentId,
    start: toKey(year, month, 1),
    end: toKey(year, month, daysInMonth),
  })

  const calendar = data?.data
  const roomTypes = calendar?.roomTypes ?? []
  const activeTypeId = roomTypeId && roomTypes.some((t) => t.id === roomTypeId) ? roomTypeId : roomTypes[0]?.id

  const cellByDate = useMemo(() => {
    const map = new Map<string, calendarTypeCell>()
    for (const day of calendar?.days ?? []) {
      const cell = day.types.find((t) => t.roomTypeId === activeTypeId)
      if (cell) map.set(day.date, cell)
    }
    return map
  }, [calendar, activeTypeId])

  const move = (step: number) => {
    const next = new Date(year, month + step, 1)
    setYear(next.getFullYear())
    setMonth(next.getMonth())
    setSelected(null)
  }

  const firstDay = new Date(year, month, 1).getDay()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const selectedCell = selected ? cellByDate.get(selected) : undefined
  const inHighlight = (key: string) => !!highlight && key >= highlight.start && key <= highlight.end

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button onClick={() => move(-1)} className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500">‹</button>
          <span className="text-sm font-semibold text-gray-700 w-36 text-center">{MONTHS_ID[month]} {year}</span>
          <button onClick={() => move(1)} className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500">›</button>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <span>Bandingkan dengan proposal</span>
          <button
            type="button"
            role="switch"
            aria-checked={compare}
            onClick={() => setCompare((v) => !v)}
            className={`relative w-10 h-6 rounded-full transition-colors ${compare ? 'bg-blue-600' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${compare ? 'translate-x-4' : ''}`} />
          </button>
        </label>
      </div>

      {/* Tipe kamar */}
      <div className="flex flex-wrap gap-2">
        {roomTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => { setRoomTypeId(type.id); setSelected(null) }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              type.id === activeTypeId ? 'bg-gray-800 text-white border-gray-800' : 'text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {type.name ?? type.id}
          </button>
        ))}
      </div>

      {adjustmentId && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          Harga di kalender ini sudah memperhitungkan adjustment ini seolah sudah di-approve.
        </p>
      )}

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1">
            {DAYS_ID.map((d) => (
              <div key={d} className="text-center text-[10px] font-medium text-gray-400 py-1">{d}</div>
            ))}
            {cells.map((day, idx) => {
              if (!day) return <div key={`e-${idx}`} />
              const key = toKey(year, month, day)
              const cell = cellByDate.get(key)
              const isSelected = selected === key
              const highlighted = inHighlight(key)

              if (!cell || !cell.hasProposal) {
                return (
                  <div
                    key={key}
                    className={`min-h-[72px] rounded-lg p-1.5 bg-gray-50 text-gray-300 ${highlighted ? 'ring-2 ring-amber-300' : ''}`}
                    title="Belum ada price proposal — harga tidak bisa diubah"
                  >
                    <span className="text-xs">{day}</span>
                    <p className="text-[9px] leading-tight mt-1">Tanpa proposal</p>
                  </div>
                )
              }

              const adjusted = cell.price !== cell.proposalPrice
              const belowBase = cell.price < cell.basePrice
              const delta = deltaLabel(cell.proposalPrice, cell.price)

              return (
                <button
                  key={key}
                  onClick={() => setSelected(isSelected ? null : key)}
                  className={[
                    'min-h-[72px] rounded-lg p-1.5 text-left transition-all border',
                    isSelected ? 'border-gray-800 shadow-md' : 'border-transparent hover:border-gray-200',
                    adjusted ? (cell.price > cell.proposalPrice ? 'bg-rose-50' : 'bg-emerald-50') : 'bg-white',
                    highlighted ? 'ring-2 ring-amber-300' : '',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600">{day}</span>
                    {cell.roomOverrides.length > 0 && (
                      <span className="text-[9px] px-1 rounded bg-violet-100 text-violet-700" title="Ada kamar dengan harga berbeda">
                        {cell.roomOverrides.length} kmr
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-bold text-gray-800 mt-1 leading-tight">{formatRp(cell.price)}</p>
                  {compare ? (
                    adjusted && (
                      <p className="text-[10px] text-gray-400 leading-tight">
                        <span className="line-through">{formatRp(cell.proposalPrice)}</span>{' '}
                        <span className={cell.price > cell.proposalPrice ? 'text-rose-600' : 'text-emerald-600'}>{delta}</span>
                      </p>
                    )
                  ) : (
                    belowBase && (
                      <p className="text-[10px] text-gray-400 line-through leading-tight">{formatRp(cell.basePrice)}</p>
                    )
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-50 border border-rose-100" /> Naik dari proposal</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-50 border border-emerald-100" /> Turun dari proposal</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-50 border border-gray-100" /> Belum ada proposal</span>
            <span className="flex items-center gap-1"><span className="px-1 rounded bg-violet-100 text-violet-700 text-[9px]">kmr</span> Kamar dengan harga khusus</span>
            {highlight && <span className="flex items-center gap-1"><span className="w-3 h-3 rounded ring-2 ring-amber-300" /> Periode adjustment</span>}
            <span>{compare ? 'Coret = harga proposal' : 'Coret = base price (harga di bawah base price)'}</span>
          </div>

          {/* Detail tanggal */}
          {selected && selectedCell?.hasProposal && (
            <div className="rounded-xl border border-gray-200 p-4 bg-gray-50 space-y-3">
              <p className="text-sm font-semibold text-gray-700">
                {Number(selected.slice(8))} {MONTHS_ID[Number(selected.slice(5, 7)) - 1]} {selected.slice(0, 4)}
              </p>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400">Base price</p>
                  <p className="font-semibold text-gray-700">{formatRp(selectedCell.basePrice)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400">Proposal (setelah rule)</p>
                  <p className="font-semibold text-gray-700">{formatRp(selectedCell.proposalPrice)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400">Harga tamu (semua kamar)</p>
                  <p className="font-bold text-gray-900">{formatRp(selectedCell.price)}</p>
                </div>
              </div>
              {selectedCell.roomOverrides.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Kamar dengan harga khusus</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCell.roomOverrides.map((r) => (
                      <span key={r.roomId} className="px-2 py-1 rounded-md bg-white border border-violet-100 text-xs">
                        <span className="font-mono text-gray-500">{r.number}</span>{' '}
                        <span className="font-semibold text-violet-700">{formatRp(r.price)}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
