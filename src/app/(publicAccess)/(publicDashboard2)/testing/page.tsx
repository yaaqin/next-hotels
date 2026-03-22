'use client'
import LoginGoogleButton from '@/src/components/atoms/glogins'
import UserSession from '@/src/components/pages/(publicPage)/testLogin'
import { useSession } from 'next-auth/react'

export default function Index() {
  const { data: session, status } = useSession()
  console.log('status:', status)
  console.log('session:', session)

  return (
    <div className="flex flex-col gap-4 p-10">
      <LoginGoogleButton />

      {/* Debug session */}
      <pre className="text-xs bg-gray-100 p-4 rounded-xl overflow-auto">
        status: {status}{"\n"}
        {JSON.stringify(session, null, 2)} 
      </pre>

      <UserSession/>
    </div>
  )
}