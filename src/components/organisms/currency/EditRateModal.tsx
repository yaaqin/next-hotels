'use client'

import { useState } from 'react'
import { currencyAdminItem } from '@/src/models/currency/list'
import { formatMoney, formatRate } from '@/src/utils/money'

interface EditRateModalProps {
  currency: currencyAdminItem
  isSaving: boolean
  onSave: (idrPerUnit: number) => void
  onClose: () => void
}

// Contoh harga kamar untuk pratinjau konversi
const SAMPLE_IDR = 892_500

export function EditRateModal({ currency, isSaving, onSave, onClose }: EditRateModalProps) {
  const [value, setValue] = useState(currency.rate ? String(Number(currency.rate.idrPerUnit.toFixed(2))) : '')
  const idrPerUnit = Number(value)
  const isValid = Number.isFinite(idrPerUnit) && idrPerUnit > 0

  const preview = isValid
    ? formatMoney(SAMPLE_IDR / idrPerUnit, currency.code, 'en-US', currency.decimals)
    : '—'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10">
        <div className="px-6 pt-6 pb-4 border-b border-dashed border-gray-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <p className="text-xs tracking-widest uppercase text-gray-400">Manual rate</p>
            </div>
            <p className="text-base font-semibold text-gray-900">
              {currency.code} ({currency.symbol})
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition text-lg leading-none">
            ✕
          </button>
        </div>

        <form
          className="px-6 py-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (isValid) onSave(idrPerUnit)
          }}
        >
          <label className="block">
            <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              1 {currency.code} = … IDR
            </span>
            <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
              <span className="pl-3 text-sm text-gray-400">Rp</span>
              <input
                autoFocus
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-2 py-2 text-sm outline-none bg-transparent"
              />
            </div>
          </label>

          {currency.rate && (
            <p className="text-xs text-gray-500">
              Kurs sekarang: {formatRate(currency.code, currency.rate.idrPerUnit)} ({currency.rate.source})
            </p>
          )}

          <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm flex justify-between">
            <span className="text-gray-500">{formatMoney(SAMPLE_IDR, 'IDR', 'id-ID')}</span>
            <span className="font-semibold text-gray-900">≈ {preview}</span>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed">
            Kurs manual dikunci: update otomatis harian tidak akan menimpanya sampai dikembalikan ke otomatis.
            Pembayaran tetap ditagih dalam IDR — kurs ini hanya untuk tampilan harga ke user.
          </p>

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
              {isSaving ? 'Menyimpan...' : 'Kunci kurs manual'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
