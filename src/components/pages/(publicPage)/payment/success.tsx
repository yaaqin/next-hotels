'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PaymentSuccessPage() {
  const params = useSearchParams()
  const router = useRouter()
  const bookingCode = params.get('bookingCode')
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (countdown === 0) {
      router.push(`/reservation/${bookingCode}`)
      return
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  return (
    <div className="min-h-screen bg-[#f5f4f0] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-10 shadow-sm max-w-sm w-full text-center space-y-4">
        {/* Checkmark */}
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div>
          <h1 className="text-xl font-semibold text-gray-900">Pembayaran Berhasil</h1>
          <p className="text-sm text-gray-400 mt-1">Transaksi SGT dikonfirmasi on-chain</p>
        </div>

        <div className="bg-gray-50 rounded-xl px-4 py-3">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Booking Code</p>
          <p className="text-base font-bold text-gray-900 font-mono">{bookingCode}</p>
        </div>

        <p className="text-xs text-gray-300">
          Redirect ke detail booking dalam {countdown} detik...
        </p>

        <button
          onClick={() => router.push(`/reservation/${bookingCode}`)}
          className="w-full py-3 rounded-xl bg-blue-500 text-white text-sm tracking-widest uppercase font-medium hover:bg-blue-600 transition"
        >
          Lihat Detail Booking
        </button>
      </div>
    </div>
  )
}