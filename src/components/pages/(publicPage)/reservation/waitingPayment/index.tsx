'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePaymentStatus } from '@/src/hooks/custom/payment/usePaymentStatus'

export default function WaitingPaymentPage({ bookingCode }: { bookingCode: string }) {
  const router = useRouter()
  const { status } = usePaymentStatus(bookingCode)

  useEffect(() => {
    if (status === 'PAID') {
      router.push(`/booking/success/${bookingCode}`)
    } else if (status === 'EXPIRED') {
      router.push(`/booking/expired/${bookingCode}`)
    }
  }, [status])

  return (
    <div>
      <p>Menunggu pembayaran...</p>
      {status && <p>Status: {status}</p>}
    </div>
  )
}