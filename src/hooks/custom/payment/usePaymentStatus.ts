import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

export function usePaymentStatus(bookingCode: string) {
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_API_BASE_URL}/booking`, {
      transports: ['websocket'],
    })

    socket.on(`payment:${bookingCode}`, (data: { status: string }) => {
      setStatus(data.status)
    })

    return () => {
      socket.disconnect()
    }
  }, [bookingCode])

  return { status }
}