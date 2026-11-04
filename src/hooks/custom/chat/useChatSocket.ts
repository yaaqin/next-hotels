import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { getSession } from 'next-auth/react'
import { API_HOST } from '@/src/libs/apiUrl'
import type { ChatMessageEvent, ChatReadEvent } from '@/src/models/chat'

type Handlers = {
  onMessage: (e: ChatMessageEvent) => void
  onRead: (e: ChatReadEvent) => void
  // Setelah reconnect: ambil ulang data yang mungkin terlewat selama putus
  onReconnect: () => void
}

// Socket namespace /chat. Token diambil dari NextAuth tiap (re)connect, jadi token yang
// sudah diperbarui otomatis terpakai. Server memutus socket kalau token invalid/expired
// → coba lagi beberapa detik kemudian dengan token baru.
export function useChatSocket(enabled: boolean, handlers: Handlers) {
  const handlersRef = useRef(handlers)
  handlersRef.current = handlers
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!enabled) return

    let retryTimer: ReturnType<typeof setTimeout> | null = null
    let hasConnectedOnce = false

    const socket: Socket = io(`${API_HOST}/chat`, {
      transports: ['websocket'],
      auth: (cb) => {
        getSession()
          .then((s) => cb({ token: s?.accessToken ?? '' }))
          .catch(() => cb({ token: '' }))
      },
    })

    socket.on('connect', () => {
      setConnected(true)
      if (hasConnectedOnce) handlersRef.current.onReconnect()
      hasConnectedOnce = true
    })
    socket.on('disconnect', (reason) => {
      setConnected(false)
      // Diputus server (token ditolak) tidak di-reconnect otomatis oleh socket.io
      if (reason === 'io server disconnect') {
        retryTimer = setTimeout(() => socket.connect(), 5000)
      }
    })
    socket.on('chat:message', (e: ChatMessageEvent) => handlersRef.current.onMessage(e))
    socket.on('chat:read', (e: ChatReadEvent) => handlersRef.current.onRead(e))

    return () => {
      if (retryTimer) clearTimeout(retryTimer)
      socket.disconnect()
    }
  }, [enabled])

  return { connected }
}
