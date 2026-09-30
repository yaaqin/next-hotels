'use client'

import { useState } from 'react'
import { reschedulePolicyItem, reschedulePolicyPayload } from '@/src/models/reschedulePolicy/list'

interface PolicyFormModalProps {
  policy: reschedulePolicyItem | null // null = buat baru
  isSaving: boolean
  onSave: (payload: reschedulePolicyPayload) => void
  onClose: () => void
}

// Contoh total booking lama untuk pratinjau potongan
const SAMPLE_IDR = 1_000_000

const inputClass =
  'w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500'

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{children}</span>
}

export function PolicyFormModal({ policy, isSaving, onSave, onClose }: PolicyFormModalProps) {
  const [name, setName] = useState(policy?.name ?? '')
  const [minDays, setMinDays] = useState(policy ? String(policy.minDays) : '')
  const [maxDays, setMaxDays] = useState(policy?.maxDays != null ? String(policy.maxDays) : '')
  // Admin mikirnya "potongan berapa persen", BE nyimpan % yang dipertahankan
  const [penalty, setPenalty] = useState(policy ? String(policy.penaltyPercent) : '')
  const [isActive, setIsActive] = useState(policy?.isActive ?? true)

  const min = Number(minDays)
  const max = maxDays === '' ? null : Number(maxDays)
  const penaltyPct = Number(penalty)

  const errors: string[] = []
  if (!name.trim()) errors.push('Nama wajib diisi')
  if (minDays === '' || !Number.isInteger(min) || min < 0) errors.push('Mulai H- harus bilangan bulat ≥ 0')
  if (max !== null && (!Number.isInteger(max) || max < min)) errors.push('Sampai H- tidak boleh lebih kecil dari mulai H-')
  if (penalty === '' || !Number.isInteger(penaltyPct) || penaltyPct < 0 || penaltyPct > 100) {
    errors.push('Potongan harus 0–100%')
  }
  const isValid = errors.length === 0

  const rangeLabel =
    minDays === ''
      ? '—'
      : max === null
        ? `H-${min} atau lebih awal`
        : min === 0 && max === 0
          ? 'Hari H saja (termasuk booking CONFIRMED)'
          : min === max
            ? `Tepat H-${min}`
            : `H-${max} s/d H-${min}`

  const fmt = (v: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10">
        <div className="px-6 pt-6 pb-4 border-b border-dashed border-gray-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
              <p className="text-xs tracking-widest uppercase text-gray-400">Reschedule policy</p>
            </div>
            <p className="text-base font-semibold text-gray-900">{policy ? 'Edit policy' : 'Policy baru'}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition text-lg leading-none">
            ✕
          </button>
        </div>

        <form
          className="px-6 py-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (!isValid) return
            onSave({
              name: name.trim(),
              minDays: min,
              maxDays: max,
              reschedulePercent: 100 - penaltyPct,
              isActive,
            })
          }}
        >
          <label className="block">
            <FieldLabel>Nama</FieldLabel>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </label>

          <div>
            <div className="flex items-center justify-between mb-1">
              <FieldLabel>Berlaku saat reschedule di</FieldLabel>
              <button
                type="button"
                onClick={() => {
                  setMinDays('0')
                  setMaxDays('0')
                }}
                className="text-[11px] text-blue-600 hover:underline"
              >
                Isi: hari H
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-[11px] text-gray-400 mb-1">Mulai H- (paling dekat)</span>
                <input
                  type="number"
                  min="0"
                  value={minDays}
                  onChange={(e) => setMinDays(e.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="block text-[11px] text-gray-400 mb-1">Sampai H- (kosong = tanpa batas)</span>
                <input
                  type="number"
                  min="0"
                  value={maxDays}
                  onChange={(e) => setMaxDays(e.target.value)}
                  className={inputClass}
                />
              </label>
            </div>
            <p className="text-[11px] text-gray-500 mt-1.5">{rangeLabel}</p>
          </div>

          <label className="block">
            <FieldLabel>Potongan</FieldLabel>
            <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type="number"
                min="0"
                max="100"
                value={penalty}
                onChange={(e) => setPenalty(e.target.value)}
                className="w-full px-3 py-2 text-sm outline-none bg-transparent"
              />
              <span className="pr-3 text-sm text-gray-400">%</span>
            </div>
          </label>

          {isValid && (
            <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Booking lama {fmt(SAMPLE_IDR)}</span>
                <span className="text-red-500">- {fmt(Math.round((SAMPLE_IDR * penaltyPct) / 100))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Nilai yang dipakai ke booking baru</span>
                <span className="font-semibold text-gray-900">
                  {fmt(SAMPLE_IDR - Math.round((SAMPLE_IDR * penaltyPct) / 100))}
                </span>
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Aktif
          </label>

          {!isValid && (name || minDays || penalty) && (
            <ul className="text-[11px] text-red-500 list-disc pl-4 space-y-0.5">
              {errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-md text-sm text-gray-600 border border-gray-300 hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!isValid || isSaving}
              className="flex-[2] py-2.5 rounded-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
