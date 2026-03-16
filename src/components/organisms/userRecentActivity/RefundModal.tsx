'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RefundType } from '@/src/services/userRecentActivity/refund'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

interface RefundModalProps {
  bookingCode: string | null
  totalAmount: number
  allowCredit?: boolean
  allowCash?: boolean
  onClose: () => void
  onConfirm: (bookingCode: string, refundType: RefundType, reason: string) => void
  isConfirming: boolean
}

export function RefundModal({
  bookingCode,
  totalAmount,
  allowCredit = true,
  allowCash = true,
  onClose,
  onConfirm,
  isConfirming,
}: RefundModalProps) {
  const [refundType, setRefundType] = useState<RefundType>('CREDIT')
  const [reason, setReason] = useState('')

  const isOpen = !!bookingCode

  const handleConfirm = () => {
    if (!bookingCode) return
    onConfirm(bookingCode, refundType, reason)
  }

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
                  <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                  <p className="text-xs tracking-widest uppercase text-gray-400">
                    Pengajuan Refund
                  </p>
                </div>
                <p className="text-base font-semibold text-gray-900">
                  Pilih Metode Refund
                </p>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4">

                {/* Total */}
                <div className="bg-gray-50 rounded-xl px-4 py-3 flex justify-between items-center">
                  <p className="text-xs text-gray-400 tracking-wide uppercase">Total Refund</p>
                  <p className="text-base font-semibold text-gray-900">
                    {formatCurrency(totalAmount)}
                  </p>
                </div>

                {/* Refund type selector */}
                <div>
                  <p className="text-xs tracking-widest uppercase text-gray-400 mb-2">
                    Metode Penerimaan
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {allowCredit && (
                      <button
                        onClick={() => setRefundType('CREDIT')}
                        className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-150 text-left
                          ${refundType === 'CREDIT'
                            ? 'border-blue-300 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                      >
                        <p className="font-semibold text-xs tracking-wide uppercase mb-0.5">
                          Credit
                        </p>
                        <p className="text-[10px] text-current opacity-60 leading-relaxed">
                          Masuk ke saldo kredit akun
                        </p>
                      </button>
                    )}
                    {allowCash && (
                      <button
                        onClick={() => setRefundType('CASH')}
                        className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-150 text-left
                          ${refundType === 'CASH'
                            ? 'border-green-300 bg-green-50 text-green-700'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                      >
                        <p className="font-semibold text-xs tracking-wide uppercase mb-0.5">
                          Cash
                        </p>
                        <p className="text-[10px] text-current opacity-60 leading-relaxed">
                          Transfer ke rekening bank
                        </p>
                      </button>
                    )}
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <p className="text-xs tracking-widest uppercase text-gray-400 mb-2">
                    Alasan <span className="normal-case tracking-normal">(opsional)</span>
                  </p>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan alasan pembatalan..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={isConfirming}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition placeholder:text-gray-300 disabled:opacity-50"
                  />
                </div>

                <p className="text-[11px] text-gray-400 leading-relaxed">
                  {refundType === 'CREDIT'
                    ? 'Kredit akan langsung masuk ke akun dan dapat digunakan untuk booking berikutnya.'
                    : 'Proses transfer membutuhkan 4 hari kerja setelah pengajuan disetujui.'}
                </p>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isConfirming}
                  className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isConfirming}
                  className="flex-1 py-3 rounded-xl text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition disabled:opacity-70 shadow-lg shadow-orange-100"
                >
                  {isConfirming ? 'Memproses...' : 'Ajukan Refund'}
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}