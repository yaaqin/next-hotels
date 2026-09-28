'use client'
import { PageHeader } from '@/src/components/organisms/configPanel/shell'
import {
  Avatar,
  AvatarStack,
  Button,
  Card,
  Chip,
  Empty,
  ListRow,
  Metric,
  Paper,
  Skeleton,
  cx,
} from '@/src/components/organisms/configPanel/ui'
import {
  useConfigAccess,
  useConfigAdmins,
  useConfigMenus,
  useConfigRoles,
} from '@/src/hooks/query/config'
import { ArrowUpRight, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import AdminDetail from './adminDetail'
import { RoleScope, SCOPE_LABEL, countAccessByRole, formatDate, roleScope } from './helpers'

const SCOPES: RoleScope[] = ['system', 'global', 'site']

export default function ConfigOverviewPage() {
  const router = useRouter()
  const { data: admins, isLoading: loadingAdmins } = useConfigAdmins()
  const { data: roles } = useConfigRoles()
  const { data: menus } = useConfigMenus()
  const { data: access } = useConfigAccess()

  const adminList = useMemo(() => admins?.data ?? [], [admins])
  const roleList = roles?.data ?? []
  const menuList = menus?.data ?? []
  const accessByRole = useMemo(() => countAccessByRole(access?.data), [access])

  const [selectedId, setSelectedId] = useState<string>()
  const recent = adminList.slice(0, 6)
  const selected = adminList.find((a) => a.id === selectedId) ?? recent[0]

  const activeCount = adminList.filter((a) => a.isActive).length
  const byScope = SCOPES.map((scope) => {
    const members = adminList.filter((a) => roleScope(a.role.name) === scope)
    return { scope, members }
  })

  const rolesByLevel = [...roleList].sort((a, b) => b.level - a.level)

  return (
    <>
      <PageHeader
        title="Configuration"
        subtitle="Role, admin, menu, dan hak akses seluruh hotel"
        back={false}
        actions={
          <Button onClick={() => router.push('/config-panel/admins?new=1')}>
            <UserPlus size={14} />
            Tambah admin
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <Card>
          <div className="grid grid-cols-3 gap-4">
            <Metric label="Total admin" value={loadingAdmins ? '–' : adminList.length} />
            <Metric label="Admin aktif" value={loadingAdmins ? '–' : activeCount} />
            <Metric label="Role terdaftar" value={roleList.length || '–'} suffix="role" />
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-3">
            {byScope.map(({ scope, members }) => (
              <div key={scope}>
                <div className="mb-2 flex items-center justify-between text-xs text-[var(--cp-muted)]">
                  <span>{SCOPE_LABEL[scope]}</span>
                  <span className="tabular-nums">{members.length}</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--cp-card-2)]">
                  <div
                    className="h-2 rounded-full bg-[var(--cp-accent)] transition-all"
                    style={{
                      width: `${adminList.length ? (members.length / adminList.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <div className="mt-4 min-h-[34px]">
                  {members.length > 0 ? (
                    <AvatarStack names={members.map((m) => m.username)} />
                  ) : (
                    <span className="text-xs text-[var(--cp-muted)]">Belum ada</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-[var(--cp-muted)]">Menu aktif di dashboard</p>
              <p className="mt-2 text-4xl font-light tabular-nums">
                {menuList.length || '–'}
                <span className="ml-2 align-middle">
                  <Chip>{menuList.filter((m) => m.level === 1).length} sidebar</Chip>
                </span>
              </p>
            </div>
            <Link
              href="/config-panel/menus"
              aria-label="Lihat menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--cp-line)] hover:bg-[var(--cp-card-2)]"
            >
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="mt-5 flex flex-1 items-end gap-2">
            <div className="hide-scrollbar flex flex-1 gap-2 overflow-x-auto">
              {rolesByLevel.slice(0, 4).map((r, i) => (
                <Link
                  key={r.id}
                  href={`/config-panel/access-control?role=${r.id}`}
                  className={cx(
                    'flex min-w-[92px] flex-1 flex-col justify-between rounded-t-[20px] rounded-b-[14px] p-3 transition',
                    i === 1
                      ? 'h-32 bg-[var(--cp-accent)] text-[var(--cp-accent-ink)]'
                      : 'h-28 bg-[var(--cp-card-2)] hover:brightness-110',
                  )}
                >
                  <span className="truncate text-[11px] font-semibold">{r.name}</span>
                  <span className="text-[11px] opacity-70">
                    {accessByRole.get(r.id) ?? 0}/{menuList.length} menu
                  </span>
                </Link>
              ))}
            </div>
            <Button
              variant="light"
              className="h-auto shrink-0 self-end py-3"
              onClick={() => router.push('/config-panel/access-control')}
            >
              Atur akses
            </Button>
          </div>
        </Card>
      </div>

      <Paper
        title="Admin terbaru"
        className="mt-6"
        action={
          <Link href="/config-panel/admins" className="text-xs text-[var(--cp-ink-muted)] hover:text-[var(--cp-ink)]">
            Lihat semua →
          </Link>
        }
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          <div className="space-y-1">
            {loadingAdmins &&
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 bg-black/5" />)}
            {!loadingAdmins && recent.length === 0 && <Empty>Belum ada admin</Empty>}
            {recent.map((a) => (
              <ListRow
                key={a.id}
                active={a.id === selected?.id}
                onClick={() => setSelectedId(a.id)}
                avatar={<Avatar name={a.username} size={40} />}
                title={a.username}
                subtitle={formatDate(a.createdAt)}
                badge={<Chip tone={a.id === selected?.id ? 'light' : 'outline'}>{a.role.name}</Chip>}
                trailing={a.sitecode ?? 'Global'}
              />
            ))}
          </div>
          <AdminDetail
            admin={selected}
            admins={adminList}
            menuCount={selected ? accessByRole.get(selected.role.id) : undefined}
            totalMenus={menuList.length}
          />
        </div>
      </Paper>
    </>
  )
}
