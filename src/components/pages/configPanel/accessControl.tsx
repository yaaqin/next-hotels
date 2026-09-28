'use client'
import { PageHeader } from '@/src/components/organisms/configPanel/shell'
import {
  Button,
  Card,
  Chip,
  Empty,
  SegmentTabs,
  Skeleton,
  Toggle,
  cx,
} from '@/src/components/organisms/configPanel/ui'
import {
  useBulkUpdateAccess,
  useConfigAccess,
  useConfigMenus,
  useConfigRoles,
} from '@/src/hooks/query/config'
import { AccessRow, ConfigMenu } from '@/src/models/config'
import { Lock } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { isFullAccess } from './helpers'

interface Group {
  root: ConfigMenu | null
  items: { menu: ConfigMenu; depth: number }[]
}

// Susun menu jadi grup per sidebar (level 1) → navbar (2) → sub navbar (3); level 4 grup sendiri
const buildGroups = (menus: ConfigMenu[]): Group[] => {
  const childrenOf = (id: string) => menus.filter((m) => m.parent?.id === id)
  const placed = new Set<string>()
  const groups: Group[] = menus
    .filter((m) => m.level === 1)
    .map((root) => {
      placed.add(root.id)
      const items: Group['items'] = [{ menu: root, depth: 0 }]
      for (const l2 of childrenOf(root.id)) {
        items.push({ menu: l2, depth: 1 })
        placed.add(l2.id)
        for (const l3 of childrenOf(l2.id)) {
          items.push({ menu: l3, depth: 2 })
          placed.add(l3.id)
        }
      }
      return { root, items }
    })

  const rest = menus.filter((m) => !placed.has(m.id))
  if (rest.length) groups.push({ root: null, items: rest.map((menu) => ({ menu, depth: 0 })) })
  return groups
}

export default function ConfigAccessControlPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { data: roles, isLoading: loadingRoles } = useConfigRoles()
  const { data: menus, isLoading: loadingMenus } = useConfigMenus()
  const { data: access, isLoading: loadingAccess } = useConfigAccess()
  const { mutate: save, isPending: saving } = useBulkUpdateAccess()

  const roleList = useMemo(
    () => [...(roles?.data ?? [])].sort((a, b) => b.level - a.level),
    [roles],
  )
  const roleId = searchParams.get('role') ?? roleList.find((r) => !isFullAccess(r))?.id ?? roleList[0]?.id
  const role = roleList.find((r) => r.id === roleId)

  // Perubahan yang belum disimpan: menuId → isAccess
  const [draft, setDraft] = useState<Record<string, boolean>>({})
  const changes = Object.keys(draft).length

  const rowsByMenu = useMemo(() => {
    const map = new Map<string, AccessRow>()
    for (const r of access?.data ?? []) if (r.role.id === roleId) map.set(r.menu.id, r)
    return map
  }, [access, roleId])

  const groups = useMemo(() => buildGroups(menus?.data ?? []), [menus])
  const roleLocked = isFullAccess(role)
  const isLocked = (m: ConfigMenu) => roleLocked || m.level === 1

  const valueOf = (menuId: string) => draft[menuId] ?? rowsByMenu.get(menuId)?.isAccess ?? false

  const setValue = (menuId: string, v: boolean) =>
    setDraft((d) => {
      const next = { ...d }
      if ((rowsByMenu.get(menuId)?.isAccess ?? false) === v) delete next[menuId]
      else next[menuId] = v
      return next
    })

  const setAll = (v: boolean) => {
    for (const m of menus?.data ?? []) if (!isLocked(m)) setValue(m.id, v)
  }

  const selectRole = (id: string) => {
    if (id === roleId) return
    if (changes && !window.confirm('Ada perubahan yang belum disimpan. Buang perubahan?')) return
    setDraft({})
    router.replace(`${pathname}?role=${id}`)
  }

  const submit = () => {
    if (!roleId || !changes) return
    save(
      { roleId, updates: Object.entries(draft).map(([menuId, isAccess]) => ({ menuId, isAccess })) },
      { onSuccess: () => setDraft({}) },
    )
  }

  const allowedCount = (menus?.data ?? []).filter((m) => valueOf(m.id)).length
  const loading = loadingRoles || loadingMenus || loadingAccess

  return (
    <>
      <PageHeader
        title="Access Control"
        subtitle="Menu dashboard yang boleh dibuka tiap role. Menu sidebar (L1) selalu terbuka untuk semua role."
      />

      <div className="mb-6 flex justify-center">
        <SegmentTabs
          value={roleId ?? ''}
          onChange={selectRole}
          items={roleList.map((r) => ({ key: r.id, label: r.name, count: r.level }))}
        />
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      ) : !role ? (
        <Empty dark>Belum ada role</Empty>
      ) : (
        <>
          <Card className="mb-4 flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-[var(--cp-muted)]">Role dipilih</p>
              <p className="mt-1 text-2xl font-light">
                {role.name}
                <span className="ml-3 text-sm text-[var(--cp-muted)]">
                  {allowedCount}/{menus?.data.length ?? 0} menu terbuka
                </span>
              </p>
            </div>
            {roleLocked ? (
              <Chip tone="accent">
                <Lock size={11} className="mr-1" />
                Level {role.level} — akses penuh, tidak bisa diubah
              </Chip>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setAll(true)}>
                  Buka semua
                </Button>
                <Button variant="ghost" onClick={() => setAll(false)}>
                  Tutup semua
                </Button>
              </div>
            )}
          </Card>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {groups.map((g) => (
              <Card key={g.root?.id ?? 'rest'} className="p-4 sm:p-5">
                <p className="mb-3 px-1 text-xs text-[var(--cp-muted)]">
                  {g.root ? g.root.name : 'Standalone / lainnya'}
                </p>
                <ul className="space-y-1">
                  {g.items.map(({ menu, depth }) => {
                    const locked = isLocked(menu)
                    const changed = menu.id in draft
                    return (
                      <li
                        key={menu.id}
                        className={cx(
                          'flex items-center gap-3 rounded-2xl px-3 py-2.5',
                          changed ? 'bg-[var(--cp-accent)]/10' : 'bg-[var(--cp-frame)]',
                        )}
                        style={{ marginLeft: depth * 16 }}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-2 truncate text-sm">
                            {menu.name ?? '(tanpa nama)'}
                            {locked && <Lock size={11} className="shrink-0 text-[var(--cp-muted)]" />}
                          </p>
                          <p className="truncate font-mono text-[11px] text-[var(--cp-muted)]">
                            L{menu.level} · {menu.path ?? '-'}
                          </p>
                        </div>
                        <Toggle
                          label={`Akses ${menu.name ?? menu.id}`}
                          checked={valueOf(menu.id)}
                          disabled={locked || !rowsByMenu.has(menu.id)}
                          onChange={(v) => setValue(menu.id, v)}
                        />
                      </li>
                    )
                  })}
                </ul>
              </Card>
            ))}
          </div>

          {changes > 0 && (
            <div className="sticky bottom-4 z-20 mt-6 flex justify-center">
              <div className="flex items-center gap-3 rounded-full border border-[var(--cp-line)] bg-[var(--cp-card)] p-2 pl-5 shadow-2xl">
                <span className="text-sm">{changes} perubahan belum disimpan</span>
                <Button variant="ghost" onClick={() => setDraft({})}>
                  Batal
                </Button>
                <Button onClick={submit} disabled={saving}>
                  {saving ? 'Menyimpan…' : 'Simpan akses'}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
