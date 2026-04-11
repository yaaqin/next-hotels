'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

/**
 * Wrapper aman untuk useSession yang nunggu:
 * 1. React hydration selesai (isHydrated)
 * 2. NextAuth session resolve (status !== 'loading')
 *
 * Selama salah satu belum ready, isReady = false dan session = null
 * Ini mencegah flash "belum login" padahal user udah login
 */
export function useSafeSession() {
  const { data: session, status, update } = useSession()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const isReady = isHydrated && status !== 'loading'
  const isAuthenticated = isReady && status === 'authenticated'
  const isUnauthenticated = isReady && status === 'unauthenticated'

  return {
    session,
    status,
    update,
    isReady,           // true kalau hydration + session udah selesai
    isAuthenticated,   // true kalau udah login & ready
    isUnauthenticated, // true kalau confirmed belum login (bukan lagi loading)
    isLoading: !isReady,
  }
}