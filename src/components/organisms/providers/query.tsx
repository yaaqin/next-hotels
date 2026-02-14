'use client'
import { queryClient } from '@/src/libs/react-query'
import { QueryClientProvider } from '@tanstack/react-query'

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
