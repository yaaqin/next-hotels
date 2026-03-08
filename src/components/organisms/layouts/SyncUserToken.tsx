'use client'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { setCookie, deleteCookie } from 'cookies-next'

// SyncUserToken.tsx
export default function SyncUserToken() {
  const { data: session, status } = useSession()

  useEffect(() => {
    console.log('🔵 backendToken:', session?.backendToken)

    if (status === 'authenticated' && session?.backendToken) {
      setCookie('userToken', session.backendToken, {
        maxAge: 60 * 60 * 24,
        path: '/',
      })
      console.log('✅ userToken cookie set')
    }
    if (status === 'unauthenticated') {
      deleteCookie('userToken')
    }
  }, [session, status])

  return null
}