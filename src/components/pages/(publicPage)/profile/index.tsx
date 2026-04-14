'use client'

import { signOut, useSession } from 'next-auth/react'
import { UserIcon } from 'hugeicons-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useUserProfile } from '@/src/hooks/query/userProfile'
import { GoogleLoginGate } from '../recentActivity'
import Images from '@/src/components/atoms/images'
import CreditCard from '@/src/components/organisms/profile/credit'

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] tracking-[0.18em] uppercase text-gray-400 mb-1">{children}</p>
}

function Field({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <p className={`text-sm font-medium ${muted ? 'text-gray-400 font-normal' : 'text-gray-900'}`}>
      {children}
    </p>
  )
}

function Divider() {
  return <div className="border-t border-dashed border-gray-200 my-5" />
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('T')[0].split('-')
  return `${d} · ${m} · ${y}`
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

function getInitials(name?: string | null) {
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

export default function ProfileUserPage() {
  const { data: session, status: authStatus } = useSession()
  const { data, isLoading } = useUserProfile()
  const { t } = useTranslation()
  const router = useRouter()

  const user = data?.data

  if (authStatus === 'unauthenticated' || !session) return <GoogleLoginGate />

  return (
    <div className="min-h-screen bg-[#f5f4f0] py-10 px-4">
      <div className="w-full mx-auto space-y-4">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            {t("text.profile.title")}
          </h1>
          <p className="text-sm text-gray-400 tracking-widest uppercase mt-1">
            {t("text.profile.subtitle")}
          </p>
        </div>

        {/* Info Akun */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <UserIcon size={16} className="text-blue-400" />
            <span className="text-xs tracking-widest uppercase text-gray-400">
              {t("text.profile.accountInfo")}
            </span>
          </div>

          {/* Avatar row */}
          <div className="flex items-center gap-4 mb-5">
            {session?.user?.image ? (
              <Images
                src={session.user.image}
                alt="avatar"
                height={45}
                width={45}
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-base font-medium text-blue-700">
                {getInitials(user?.name)}
              </div>
            )}
            <div>
              <p className="text-base font-medium text-gray-900">{user?.name ?? '—'}</p>
              <p className="text-sm text-gray-400">{user?.email ?? '—'}</p>
            </div>
          </div>

          <Divider />

          <div className="grid grid-cols-2 gap-5">
            <div>
              <Label>{t("text.profile.fullName")}</Label>
              <Field>{user?.name ?? '—'}</Field>
            </div>
            <div>
              <Label>{t("text.profile.email")}</Label>
              <Field>{user?.email ?? '—'}</Field>
            </div>
            <div>
              <Label>{t("text.profile.phone")}</Label>
              <Field muted={!user?.phone}>
                {user?.phone ?? t("text.profile.phoneEmpty")}
              </Field>
            </div>
            <div>
              <Label>{t("text.profile.joinedSince")}</Label>
              <Field>{user?.createdAt ? formatDate(user.createdAt) : '—'}</Field>
            </div>
          </div>
        </div>

        {/* Credit Card */}
        <CreditCard
          user={user}
          isLoading={isLoading}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          router={router}
        />

        {/* Logout */}
        <div className="bg-white rounded-2xl px-6 py-4 shadow-sm">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full py-3.5 rounded-xl text-sm font-medium tracking-widest uppercase text-red-500 border border-gray-200 hover:bg-red-50 transition-colors duration-200"
          >
            {t("text.profile.logout")}
          </button>
        </div>

      </div>
    </div>
  )
}