'use client'
import { CONFIG_TABS, isSystemRole } from '@/src/constans/config'
import { useMe } from '@/src/hooks/query/auth/me'
import { logout } from '@/src/libs/auth'
import { ArrowLeft, LayoutDashboard, LogOut, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Avatar, IconButton, Skeleton, cx } from './ui'

// Kerangka /config-panel: cuma role sistem (DEV, SUPERADMIN) yang boleh masuk.
// BE tetap jadi penjaga utama (SystemRoleGuard) — cek di sini cuma supaya admin lain
// langsung dilempar ke /dashboard, bukan lihat halaman kosong penuh error 403.
export default function ConfigShell({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: me, isLoading, error } = useMe()

  const roleName = me?.data?.role?.name
  const allowed = isSystemRole(roleName)

  useEffect(() => {
    if (isLoading) return
    if (error || !me) router.replace('/login')
    else if (!allowed) router.replace('/dashboard')
  }, [isLoading, error, me, allowed, router])

  const activeTab =
    [...CONFIG_TABS]
      .sort((a, b) => b.href.length - a.href.length)
      .find((t) => pathname === t.href || pathname.startsWith(`${t.href}/`))?.href ??
    '/config-panel'

  return (
    <div className="config-theme min-h-screen bg-[var(--cp-bg)] p-0 text-[var(--cp-text)] sm:p-4">
      <Toaster
        toastOptions={{
          style: { background: '#1e1f23', color: '#f4f4f2', borderRadius: 999, fontSize: 13 },
        }}
      />
      <div className="mx-auto min-h-screen max-w-[1440px] bg-[var(--cp-frame)] px-4 py-5 sm:min-h-[calc(100vh-2rem)] sm:rounded-[36px] sm:px-8 sm:py-7">
        <header className="flex flex-wrap items-center gap-3 lg:flex-nowrap">
          <Link href="/config-panel" className="flex shrink-0 items-center gap-2 pr-2">
            <ShieldCheck size={22} className="text-[var(--cp-accent)]" />
            <span className="text-sm font-semibold tracking-tight">MBS config</span>
          </Link>

          <nav className="order-last w-full lg:order-none lg:w-auto">
            <div className="hide-scrollbar flex gap-1 overflow-x-auto rounded-full bg-white p-1">
              {CONFIG_TABS.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className={cx(
                    'shrink-0 rounded-full px-4 py-2 text-xs font-medium transition',
                    activeTab === t.href
                      ? 'bg-[var(--cp-accent)] text-[var(--cp-accent-ink)]'
                      : 'text-[var(--cp-ink-muted)] hover:text-[var(--cp-ink)]',
                  )}
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/dashboard"
              title="Buka dashboard monitoring"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--cp-line)] px-4 text-xs hover:bg-[var(--cp-card-2)]"
            >
              <LayoutDashboard size={15} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
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
              <Skeleton className="h-48 w-full" />
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

export function PageHeader({
  title,
  subtitle,
  back = true,
  actions,
}: {
  title: string
  subtitle?: string
  back?: boolean
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="flex items-center gap-4">
        {back && (
          <Link
            href="/config-panel"
            aria-label="Kembali ke overview"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--cp-line)] hover:bg-[var(--cp-card-2)]"
          >
            <ArrowLeft size={16} />
          </Link>
        )}
        <div>
          <h1 className="text-4xl font-light tracking-tight sm:text-5xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-[var(--cp-muted)]">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}
