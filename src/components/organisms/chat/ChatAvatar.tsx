'use client'

import type { ChatUser } from '@/src/models/chat'

const SIZES = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm' } as const

export function ChatAvatar({ user, size = 'md' }: { user: ChatUser | null; size?: keyof typeof SIZES }) {
  const label = user?.username ?? user?.name ?? '?'
  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={label}
        referrerPolicy="no-referrer"
        className={`${SIZES[size]} rounded-full object-cover shrink-0 bg-gray-100`}
      />
    )
  }
  return (
    <div className={`${SIZES[size]} rounded-full bg-blue-100 text-blue-600 font-semibold flex items-center justify-center shrink-0 uppercase`}>
      {label.charAt(0)}
    </div>
  )
}
