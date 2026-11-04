import { Suspense } from 'react'
import ChatPage from '@/src/components/pages/(publicPage)/chat'

export const metadata = {
  title: 'Chat',
  robots: { index: false, follow: false },
}

// Suspense: ChatPage membaca ?c= lewat useSearchParams
export default function page() {
  return (
    <Suspense fallback={null}>
      <ChatPage />
    </Suspense>
  )
}
