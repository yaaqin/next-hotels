'use client'
import { Avatar, IconButton, Skeleton } from '@/src/components/organisms/configPanel/ui'
import { isSystemRole } from '@/src/constans/config'
import { canAccessNewsroom } from '@/src/constans/newsroom'
import { useMe } from '@/src/hooks/query/auth/me'
import { logout } from '@/src/libs/auth'
import { ArrowLeft, ExternalLink, LayoutDashboard, LogOut, Newspaper } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

// Kerangka /newsroom: ARTICLE_ADMIN + role sistem. BE tetap penjaga utama (ArticleRoleGuard);
// cek di sini cuma supaya admin lain langsung dilempar ke /dashboard, bukan lihat error 403.
export default function NewsroomShell({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { data: me, isLoading, error } = useMe()

  const roleName = me?.data?.role?.name
  const allowed = canAccessNewsroom(roleName)

  useEffect(() => {
    if (isLoading) return
    if (error || !me) router.replace('/login')
    else if (!allowed) router.replace('/dashboard')
  }, [isLoading, error, me, allowed, router])

  return (
    <div className="config-theme min-h-screen bg-[var(--cp-bg)] p-0 text-[var(--cp-text)] sm:p-4">
      <Toaster
        toastOptions={{
          style: { background: '#1e1f23', color: '#f4f4f2', borderRadius: 999, fontSize: 13 },
        }}
      />
      <div className="mx-auto min-h-screen max-w-[1440px] bg-[var(--cp-frame)] px-4 py-5 sm:min-h-[calc(100vh-2rem)] sm:rounded-[36px] sm:px-8 sm:py-7">
        <header className="flex flex-wrap items-center gap-3">
          <Link href="/newsroom" className="flex shrink-0 items-center gap-2 pr-2">
            <Newspaper size={22} className="text-[var(--cp-accent)]" />
            <span className="text-sm font-semibold tracking-tight">MBS newsroom</span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <a
              href="/news"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--cp-line)] px-4 text-xs hover:bg-[var(--cp-card-2)]"
            >
              <ExternalLink size={15} />
              <span className="hidden sm:inline">Lihat /news</span>
            </a>
            {isSystemRole(roleName) && (
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--cp-line)] px-4 text-xs hover:bg-[var(--cp-card-2)]"
              >
                <LayoutDashboard size={15} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}
            <IconButton label="Logout" onClick={logout}>
              <LogOut size={15} />
            </IconButton>
            {me?.data && (
              <div className="flex items-center gap-2 pl-1">
                <Avatar name={me.data.username} size={40} />
                <div className="hidden leading-tight xl:block">
                  <p className="text-xs font-medium">{me.data.username}</p>
                  <p className="text-[11px] text-[var(--cp-muted)]">{roleName}</p>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="mt-6 sm:mt-8">
          {isLoading || !allowed ? (
            <div className="space-y-4">
              <Skeleton className="h-14 w-64" />
              <Skeleton className="h-80 w-full" />
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  )
}

export function NewsroomHeader({
  title,
  subtitle,
  back,
  actions,
}: {
  title: string
  subtitle?: ReactNode
  back?: boolean
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="flex min-w-0 items-center gap-4">
        {back && (
          <Link
            href="/newsroom"
            aria-label="Kembali ke daftar artikel"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--cp-line)] hover:bg-[var(--cp-card-2)]"
          >
            <ArrowLeft size={16} />
          </Link>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-3xl font-light tracking-tight sm:text-4xl">{title}</h1>
          {subtitle && <div className="mt-1 text-sm text-[var(--cp-muted)]">{subtitle}</div>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}
