'use client'
import { PageHeader } from '@/src/components/organisms/configPanel/shell'
import {
  Avatar,
  Button,
  Chip,
  Empty,
  Field,
  FilterBar,
  FilterSearch,
  FilterSelect,
  ListRow,
  Modal,
  Paper,
  SegmentTabs,
  Skeleton,
  inputClass,
} from '@/src/components/organisms/configPanel/ui'
import { GLOBAL_ROLES } from '@/src/constans/config'
import {
  useConfigAccess,
  useConfigAdmins,
  useConfigMenus,
  useConfigRoles,
  useConfigSites,
  useCreateAdmin,
} from '@/src/hooks/query/config'
import { UserPlus } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useMemo, useState } from 'react'
import AdminDetail from './adminDetail'
import { countAccessByRole, formatDate } from './helpers'

type Status = 'all' | 'active' | 'inactive'

export default function ConfigAdminsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const createOpen = searchParams.get('new') === '1'
  const setCreateOpen = (open: boolean) => router.replace(open ? `${pathname}?new=1` : pathname)

  const { data: admins, isLoading } = useConfigAdmins()
  const { data: roles } = useConfigRoles()
  const { data: sites } = useConfigSites()
  const { data: menus } = useConfigMenus()
  const { data: access } = useConfigAccess()
  const accessByRole = useMemo(() => countAccessByRole(access?.data), [access])

  const [status, setStatus] = useState<Status>('all')
  const [roleFilter, setRoleFilter] = useState('')
  const [siteFilter, setSiteFilter] = useState('')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string>()

  const adminList = useMemo(() => admins?.data ?? [], [admins])
  const roleList = roles?.data ?? []
  const siteList = sites?.data ?? []

  const baseFiltered = adminList.filter((a) => {
    if (roleFilter && a.role.id !== roleFilter) return false
    if (siteFilter === '__global' && a.sitecode) return false
    if (siteFilter && siteFilter !== '__global' && a.sitecode !== siteFilter) return false
    const q = search.trim().toLowerCase()
    if (q && !a.username.toLowerCase().includes(q) && !a.email.toLowerCase().includes(q)) return false
    return true
  })
  const filtered = baseFiltered.filter((a) =>
    status === 'all' ? true : status === 'active' ? a.isActive : !a.isActive,
  )
  const selected = filtered.find((a) => a.id === selectedId) ?? filtered[0]
  const activeFilters = [roleFilter, siteFilter, search.trim()].filter(Boolean).length

  return (
    <>
      <PageHeader
        title="Admins"
        subtitle="Akun admin hotel beserta role dan cabangnya"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <UserPlus size={14} />
            Tambah admin
          </Button>
        }
      />

      <FilterBar label="Filter aktif" count={activeFilters}>
        <FilterSelect
          value={roleFilter}
          onChange={setRoleFilter}
          options={[
            { value: '', label: 'Semua role' },
            ...roleList.map((r) => ({ value: r.id, label: r.name })),
          ]}
        />
        <FilterSelect
          value={siteFilter}
          onChange={setSiteFilter}
          options={[
            { value: '', label: 'Semua site' },
            { value: '__global', label: 'Global (tanpa site)' },
            ...siteList.map((s) => ({ value: s.sitecode, label: `${s.sitecode} · ${s.nama}` })),
          ]}
        />
        <FilterSearch value={search} onChange={setSearch} placeholder="Cari username / email" />
      </FilterBar>

      <div className="relative z-10 -mb-6 mt-6 flex justify-center px-4">
        <SegmentTabs<Status>
          value={status}
          onChange={setStatus}
          items={[
            { key: 'all', label: 'Semua', count: baseFiltered.length },
            { key: 'active', label: 'Aktif', count: baseFiltered.filter((a) => a.isActive).length },
            { key: 'inactive', label: 'Nonaktif', count: baseFiltered.filter((a) => !a.isActive).length },
          ]}
        />
      </div>

      <Paper title="Daftar admin" className="pt-8">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          <div className="max-h-[560px] space-y-1 overflow-y-auto">
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 bg-black/5" />)}
            {!isLoading && filtered.length === 0 && <Empty>Tidak ada admin yang cocok</Empty>}
            {filtered.map((a) => (
              <ListRow
                key={a.id}
                active={a.id === selected?.id}
                onClick={() => setSelectedId(a.id)}
                avatar={<Avatar name={a.username} size={40} />}
                title={a.username}
                subtitle={`${a.email} · ${formatDate(a.createdAt)}`}
                badge={<Chip tone={a.id === selected?.id ? 'light' : 'outline'}>{a.role.name}</Chip>}
                trailing={a.sitecode ?? 'Global'}
              />
            ))}
          </div>
          <AdminDetail
            admin={selected}
            admins={adminList}
            menuCount={selected ? accessByRole.get(selected.role.id) : undefined}
            totalMenus={menus?.data.length}
          />
        </div>
      </Paper>

      <CreateAdminModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  )
}

function CreateAdminModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: roles } = useConfigRoles()
  const { data: sites } = useConfigSites()
  const { mutate, isPending } = useCreateAdmin()

  const [form, setForm] = useState({ username: '', email: '', password: '', roleId: '', sitecode: '' })
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const role = roles?.data.find((r) => r.id === form.roleId)
  const needsSite = !!role && !GLOBAL_ROLES.includes(role.name)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    mutate(
      {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        roleId: form.roleId,
        ...(form.sitecode && { sitecode: form.sitecode }),
      },
      {
        onSuccess: () => {
          setForm({ username: '', email: '', password: '', roleId: '', sitecode: '' })
          onClose()
        },
      },
    )
  }

  return (
    <Modal open={open} title="Tambah admin" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Username">
          <input required value={form.username} onChange={set('username')} className={inputClass} />
        </Field>
        <Field label="Email">
          <input required type="email" value={form.email} onChange={set('email')} className={inputClass} />
        </Field>
        <Field label="Password" hint="Minimal 6 karakter">
          <input
            required
            minLength={6}
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={set('password')}
            className={inputClass}
          />
        </Field>
        <Field label="Role">
          <select required value={form.roleId} onChange={set('roleId')} className={inputClass}>
            <option value="">Pilih role</option>
            {[...(roles?.data ?? [])]
              .sort((a, b) => b.level - a.level)
              .map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} · level {r.level}
                </option>
              ))}
          </select>
        </Field>
        <Field
          label={needsSite ? 'Site' : 'Site (opsional)'}
          hint={needsSite ? 'Role ini wajib terikat ke satu cabang' : 'Role global bisa akses semua cabang'}
        >
          <select required={needsSite} value={form.sitecode} onChange={set('sitecode')} className={inputClass}>
            <option value="">{needsSite ? 'Pilih site' : 'Tanpa site'}</option>
            {sites?.data.map((s) => (
              <option key={s.id} value={s.sitecode}>
                {s.sitecode} · {s.nama}
              </option>
            ))}
          </select>
        </Field>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Menyimpan…' : 'Simpan admin'}
        </Button>
      </form>
    </Modal>
  )
}
