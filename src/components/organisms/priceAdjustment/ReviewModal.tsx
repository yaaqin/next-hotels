'use client'

import { useState } from 'react'

interface ReviewModalProps {
  action: 'approve' | 'reject'
  title: string
  isPending: boolean
  onConfirm: (note?: string) => void
  onClose: () => void
}

// Konfirmasi approve / reject price adjustment — gantiin confirm() & prompt() bawaan browser
export function ReviewModal({ action, title, isPending, onConfirm, onClose }: ReviewModalProps) {
  const [note, setNote] = useState('')
  const isApprove = action === 'approve'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={isPending ? undefined : onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-dashed border-gray-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full inline-block ${isApprove ? 'bg-green-500' : 'bg-red-400'}`} />
              <p className="text-xs tracking-widest uppercase text-gray-400">Price Adjustment</p>
            </div>
            <p className="text-base font-semibold text-gray-900">
              {isApprove ? 'Approve adjustment ini?' : 'Reject adjustment ini?'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{title}</p>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-gray-400 hover:text-gray-600 transition text-lg leading-none disabled:opacity-50"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5">
          {isApprove ? (
            <p className="text-sm text-gray-600 leading-relaxed">
              Harga baru langsung dipakai untuk booking berikutnya. Booking yang sudah dibuat tidak berubah.
            </p>
          ) : (
            <div>
              <label className="text-xs text-gray-500">Alasan reject (opsional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                autoFocus
                placeholder="mis. Persentase kenaikan terlalu besar"
                className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          )}
        </div>

        <div className="px-6 pb-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-md disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(isApprove ? undefined : note.trim() || undefined)}
            disabled={isPending}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md disabled:opacity-50 ${
              isApprove ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isPending ? 'Memproses...' : isApprove ? 'Approve' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  )
}
