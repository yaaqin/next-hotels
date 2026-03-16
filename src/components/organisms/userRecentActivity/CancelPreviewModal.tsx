'use client'

import { CancelPreviewData } from '@/src/services/userRecentActivity/cancelPreview'
import { AnimatePresence, motion } from 'framer-motion'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

interface CancelPreviewModalProps {
  data: CancelPreviewData | null
  isLoading: boolean
  onClose: () => void
  onConfirm: (previewToken: string) => void
  isConfirming: boolean
}

export function CancelPreviewModal({
  data,
  isLoading,
  onClose,
  onConfirm,
  isConfirming,
}: CancelPreviewModalProps) {
  const isOpen = isLoading || !!data

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isConfirming ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl">

              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-dashed border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                  <p className="text-xs tracking-widest uppercase text-gray-400">
                    Konfirmasi Pembatalan
                  </p>
                </div>
                <p className="text-base font-semibold text-gray-900">
                  Batalkan Booking?
                </p>
              </div>

              {/* Body */}
              {isLoading ? (
                <div className="px-6 py-10 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-400 rounded-full animate-spin" />
                </div>
              ) : data ? (
                <div className="px-6 py-5 space-y-4">

                  {/* Booking info */}
                  <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-1">
                    <p className="text-xs text-gray-400 tracking-wide uppercase mb-2">
                      Detail Booking
                    </p>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Hotel</span>
                      <span className="font-medium text-gray-700">{data.siteName}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Check-in</span>
                      <span className="font-medium text-gray-700">{formatDate(data.checkInDate)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">H sebelum check-in</span>
                      <span className="font-medium text-gray-700">{data.daysBeforeCheckIn} hari</span>
                    </div>
                  </div>

                  {/* Policy */}
                  <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                    <p className="text-xs text-amber-600 tracking-wide uppercase mb-2 font-medium">
                      Kebijakan Refund · {data.policy.name}
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-amber-700/70">Total pembayaran</span>
                        <span className="font-medium text-amber-800">{formatCurrency(data.originalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-amber-700/70">Refund ({data.refundPercent}%)</span>
                        <span className="font-medium text-green-700">{formatCurrency(data.refundAmount)}</span>
                      </div>
                      <div className="border-t border-amber-100 mt-2 pt-2 flex justify-between text-xs">
                        <span className="text-red-500/80 font-medium">Potongan penalty</span>
                        <span className="font-semibold text-red-500">− {formatCurrency(data.penaltyAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Refund method info */}
                  <div className="flex gap-2">
                    {data.allowCredit && (
                      <span className="flex-1 text-center text-[10px] font-medium px-2 py-1.5 rounded-lg bg-blue-50 text-blue-600 tracking-wide uppercase">
                        Credit tersedia
                      </span>
                    )}
                    {data.allowCash && (
                      <span className="flex-1 text-center text-[10px] font-medium px-2 py-1.5 rounded-lg bg-green-50 text-green-700 tracking-wide uppercase">
                        Cash tersedia
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Dengan mengkonfirmasi, booking akan dibatalkan dan refund akan diproses sesuai kebijakan di atas.
                  </p>
                </div>
              ) : null}

              {/* Actions */}
              {!isLoading && data && (
                <div className="px-6 pb-6 flex gap-3">
                  <button
                    onClick={onClose}
                    disabled={isConfirming}
                    className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => onConfirm(data.previewToken)}
                    disabled={isConfirming}
                    className="flex-1 py-3 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-70 shadow-lg shadow-red-100"
                  >
                    {isConfirming ? 'Memproses...' : 'Ya, Batalkan'}
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}