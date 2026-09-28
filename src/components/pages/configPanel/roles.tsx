'use client'
import { PageHeader } from '@/src/components/organisms/configPanel/shell'
import {
  AvatarStack,
  Button,
  Chip,
  DetailCard,
  Empty,
  Field,
  FilterBar,
  FilterSearch,
  ListRow,
  Modal,
  Paper,
  Skeleton,
  Tile,
  inputClass,
} from '@/src/components/organisms/configPanel/ui'
import {
  useConfigAccess,
  useConfigAdmins,
  useConfigMenus,
  useConfigRoles,
  useCreateRole,
  useDeleteRole,
  useUpdateRole,
} from '@/src/hooks/query/config'
import { Role } from '@/src/models/config'
import { KeyRound, Pencil, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent, useMemo, useState } from 'react'
import { SCOPE_LABEL, countAccessByRole, formatDate, isFullAccess, roleScope } from './helpers'

export default function ConfigRolesPage() {
  const router = useRouter()
  const { data: roles, isLoading } = useConfigRoles()
  const { data: admins } = useConfigAdmins()
  const { data: menus } = useConfigMenus()
  const { data: access } = useConfigAccess()
  const { mutate: remove, isPending: removing } = useDeleteRole()

  const accessByRole = useMemo(() => countAccessByRole(access?.data), [access])
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string>()
  const [modal, setModal] = useState<{ mode: 'create' } | { mode: 'edit'; role: Role } | null>(null)

  const roleList = [...(roles?.data ?? [])].sort((a, b) => b.level - a.level)
  const adminList = admins?.data ?? []
  const membersOf = (roleId: string) => adminList.filter((a) => a.role.id === roleId)

  const q = search.trim().toLowerCase()
  const filtered = roleList.filter(
    (r) => !q || r.name.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q),
  )
  const selected = filtered.find((r) => r.id === selectedId) ?? filtered[0]
  const members = selected ? membersOf(selected.id) : []

  const handleDelete = (role: Role) => {
    if (!window.confirm(`Hapus role ${role.name}?`)) return
    remove(role.id, { onSuccess: () => setSelectedId(undefined) })
  }

  return (
    <>
      <PageHeader
        title="Roles"
        subtitle="Tingkatan akses admin. Level ≥ 800 otomatis punya akses penuh."
        actions={
          <Button onClick={() => setModal({ mode: 'create' })}>
            <Plus size={14} />
            Tambah role
          </Button>
        }
      />

      <FilterBar label="Filter aktif" count={q ? 1 : 0}>
        <FilterSearch value={search} onChange={setSearch} placeholder="Cari nama / deskripsi role" />
      </FilterBar>

      <Paper title="Daftar role" className="mt-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          <div className="max-h-[560px] space-y-1 overflow-y-auto">
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 bg-black/5" />)}
            {!isLoading && filtered.length === 0 && <Empty>Tidak ada role yang cocok</Empty>}
            {filtered.map((r) => {
              const active = r.id === selected?.id
              return (
                <ListRow
                  key={r.id}
                  active={active}
                  onClick={() => setSelectedId(r.id)}
                  avatar={
                    <span
                      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums ${
                        active ? 'bg-[var(--cp-accent)] text-[var(--cp-accent-ink)]' : 'bg-black/[0.06]'
                      }`}
                    >
                      {r.level}
                    </span>
                  }
                  title={r.name}
                  subtitle={r.description || '-'}
                  badge={<Chip tone={active ? 'light' : 'outline'}>{SCOPE_LABEL[roleScope(r.name)]}</Chip>}
                  trailing={`${membersOf(r.id).length} admin`}
                />
              )
            })}
          </div>

          {!selected ? (
            <Empty dark>Pilih role untuk lihat detail</Empty>
          ) : (
            <DetailCard className="flex h-full flex-col gap-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-[var(--cp-muted)]">Detail role</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    <h3 className="truncate text-3xl font-light">{selected.name}</h3>
                    <Chip tone={isFullAccess(selected) ? 'accent' : 'muted'}>
                      {isFullAccess(selected) ? 'Akses penuh' : SCOPE_LABEL[roleScope(selected.name)]}
                    </Chip>
                  </div>
                  <p className="mt-2 text-sm text-[var(--cp-muted)]">{selected.description || 'Tanpa deskripsi'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Tile label="Level" value={selected.level} />
                <Tile label="Admin" value={members.length} />
                <Tile
                  label="Menu diakses"
                  value={`${accessByRole.get(selected.id) ?? 0}/${menus?.data.length ?? '-'}`}
                  onClick={() => router.push(`/config-panel/access-control?role=${selected.id}`)}
                />
              </div>

              <div>
                <p className="mb-3 text-xs text-[var(--cp-muted)]">Anggota</p>
                {members.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <AvatarStack names={members.map((m) => m.username)} max={8} />
                    <p className="text-xs text-[var(--cp-muted)]">
                      {members.map((m) => m.username).join(', ')}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-[var(--cp-muted)]">Belum ada admin dengan role ini</p>
                )}
              </div>

              <div className="mt-auto flex flex-wrap items-center gap-3 rounded-[20px] bg-[var(--cp-card)] p-4">
                <div className="flex-1">
                  <p className="text-[11px] text-[var(--cp-muted)]">Dibuat</p>
                  <p className="text-sm">{formatDate(selected.createdAt)}</p>
                </div>
                <Button variant="ghost" onClick={() => setModal({ mode: 'edit', role: selected })}>
                  <Pencil size={13} />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  disabled={members.length > 0 || removing}
                  title={members.length > 0 ? 'Role masih dipakai admin' : undefined}
                  onClick={() => handleDelete(selected)}
                >
                  <Trash2 size={13} />
                  Hapus
                </Button>
                <Button onClick={() => router.push(`/config-panel/access-control?role=${selected.id}`)}>
                  <KeyRound size={13} />
                  Atur akses
                </Button>
              </div>
            </DetailCard>
          )}
        </div>
      </Paper>

      {modal && (
        <RoleFormModal
          key={modal.mode === 'edit' ? modal.role.id : 'create'}
          role={modal.mode === 'edit' ? modal.role : undefined}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}

function RoleFormModal({ role, onClose }: { role?: Role; onClose: () => void }) {
  const { mutate: create, isPending: creating } = useCreateRole()
  const { mutate: update, isPending: updating } = useUpdateRole()
  const [form, setForm] = useState({
    name: role?.name ?? '',
    level: role ? String(role.level) : '',
    description: role?.description ?? '',
  })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const payload = {
      name: form.name.trim().toUpperCase(),
      level: Number(form.level),
      description: form.description.trim(),
    }
    if (role) update({ id: role.id, payload }, { onSuccess: onClose })
    else create(payload, { onSuccess: onClose })
  }

  return (
    <Modal open title={role ? `Edit ${role.name}` : 'Tambah role'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Nama role" hint="Disimpan huruf kapital, harus unik">
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={inputClass}
          />
        </Field>
        <Field label="Level" hint="Makin tinggi makin kuat. ≥ 800 = akses penuh ke semua menu">
          <input
            required
            type="number"
            min={1}
            value={form.level}
            onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
            className={inputClass}
          />
        </Field>
        <Field label="Deskripsi">
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className={`${inputClass} h-auto py-3`}
          />
        </Field>
        <Button type="submit" disabled={creating || updating} className="w-full">
          {creating || updating ? 'Menyimpan…' : 'Simpan role'}
        </Button>
      </form>
    </Modal>
  )
}
