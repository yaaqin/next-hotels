'use client'
import { PageHeader } from '@/src/components/organisms/configPanel/shell'
import {
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
  SegmentTabs,
  Skeleton,
  Tile,
  inputClass,
} from '@/src/components/organisms/configPanel/ui'
import {
  useAddMenuTranslations,
  useConfigMenuDetail,
  useConfigMenus,
  useConfigMenuTranslations,
  useCreateMenu,
  useUpdateMenu,
} from '@/src/hooks/query/config'
import { ConfigMenu } from '@/src/models/config'
import { KeyRound, Plus } from 'lucide-react'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { LANG_OPTIONS, MENU_LEVELS, formatDate } from './helpers'

type LevelTab = 'all' | '1' | '2' | '3' | '4'

export default function ConfigMenusPage() {
  const { data: menus, isLoading } = useConfigMenus()
  const [tab, setTab] = useState<LevelTab>('all')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string>()
  const [createOpen, setCreateOpen] = useState(false)

  const menuList = menus?.data ?? []
  const q = search.trim().toLowerCase()
  const searched = menuList.filter(
    (m) =>
      !q ||
      m.name?.toLowerCase().includes(q) ||
      m.code?.toLowerCase().includes(q) ||
      m.path?.toLowerCase().includes(q),
  )
  const filtered = searched.filter((m) => tab === 'all' || String(m.level) === tab)
  const selected = filtered.find((m) => m.id === selectedId) ?? filtered[0]

  return (
    <>
      <PageHeader
        title="Menus"
        subtitle="Struktur sidebar & navbar dashboard. Menu baru otomatis dapat baris akses untuk semua role."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus size={14} />
            Tambah menu
          </Button>
        }
      />

      <FilterBar label="Filter aktif" count={q ? 1 : 0}>
        <FilterSearch value={search} onChange={setSearch} placeholder="Cari nama, code, atau path" />
      </FilterBar>

      <div className="relative z-10 -mb-6 mt-6 flex justify-center px-4">
        <SegmentTabs<LevelTab>
          value={tab}
          onChange={setTab}
          items={[
            { key: 'all', label: 'Semua', count: searched.length },
            ...MENU_LEVELS.map((l) => ({
              key: String(l.value) as LevelTab,
              label: l.label,
              count: searched.filter((m) => m.level === l.value).length,
            })),
          ]}
        />
      </div>

      <Paper title="Daftar menu" className="pt-8">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          <div className="max-h-[600px] space-y-1 overflow-y-auto">
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 bg-black/5" />)}
            {!isLoading && filtered.length === 0 && <Empty>Tidak ada menu yang cocok</Empty>}
            {filtered.map((m) => {
              const active = m.id === selected?.id
              return (
                <ListRow
                  key={m.id}
                  active={active}
                  onClick={() => setSelectedId(m.id)}
                  avatar={
                    <span
                      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                        active ? 'bg-[var(--cp-accent)] text-[var(--cp-accent-ink)]' : 'bg-black/[0.06]'
                      }`}
                    >
                      L{m.level}
                    </span>
                  }
                  title={m.name ?? '(tanpa nama)'}
                  subtitle={m.path ?? '-'}
                  badge={
                    m.code ? <Chip tone={active ? 'light' : 'outline'}>{m.code}</Chip> : undefined
                  }
                  trailing={m.parent?.name ?? ''}
                />
              )
            })}
          </div>

          {selected ? (
            <MenuDetail key={selected.id} menu={selected} />
          ) : (
            <Empty dark>Pilih menu untuk lihat detail</Empty>
          )}
        </div>
      </Paper>

      {createOpen && <CreateMenuModal menus={menuList} onClose={() => setCreateOpen(false)} />}
    </>
  )
}

function MenuDetail({ menu }: { menu: ConfigMenu }) {
  const { data: detail } = useConfigMenuDetail(menu.id)
  const { data: translations } = useConfigMenuTranslations(menu.id)
  const { mutate: saveTranslation, isPending: savingTr } = useAddMenuTranslations(menu.id)
  const { mutate: saveMenu, isPending: savingMenu } = useUpdateMenu(menu.id)

  const [tr, setTr] = useState({ lang: 'eng', name: '' })
  const [edit, setEdit] = useState({ code: menu.code ?? '', path: menu.path ?? '' })

  const accessRows = [...(detail?.data.accessControls ?? [])].sort((a, b) => b.role.level - a.role.level)
  const allowed = accessRows.filter((a) => a.isAccess).length
  const levelInfo = MENU_LEVELS.find((l) => l.value === menu.level)

  const submitTranslation = (e: FormEvent) => {
    e.preventDefault()
    if (!tr.name.trim()) return
    saveTranslation([{ lang: tr.lang, name: tr.name.trim() }], {
      onSuccess: () => setTr((t) => ({ ...t, name: '' })),
    })
  }

  const submitEdit = (e: FormEvent) => {
    e.preventDefault()
    saveMenu({
      ...(edit.code.trim() && { code: edit.code.trim() }),
      ...(edit.path.trim() && { path: edit.path.trim() }),
    })
  }

  return (
    <DetailCard className="flex h-full flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-[var(--cp-muted)]">Detail menu</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h3 className="truncate text-3xl font-light">{menu.name ?? '(tanpa nama)'}</h3>
            {menu.code && <Chip>{menu.code}</Chip>}
          </div>
          <p className="mt-2 font-mono text-xs text-[var(--cp-muted)]">{menu.path ?? '-'}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--cp-muted)]">Dibuat</p>
          <p className="mt-1 text-sm">{formatDate(menu.createdAt)}</p>
          <p className="text-[11px] text-[var(--cp-muted)]">oleh {menu.creator.username}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Tile label={levelInfo?.label ?? 'Level'} value={`L${menu.level}`} />
        <Tile label="Parent" value={menu.parent?.name ?? '-'} />
        <Tile label="Role dengan akses" value={detail ? `${allowed}/${accessRows.length}` : '–'} />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs text-[var(--cp-muted)]">Akses per role</p>
          <Link
            href="/config-panel/access-control"
            className="inline-flex items-center gap-1 text-xs text-[var(--cp-accent)] hover:underline"
          >
            <KeyRound size={12} />
            Atur akses
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {accessRows.map((a) => (
            <Chip key={a.id} tone={a.isAccess ? 'accent' : 'muted'}>
              {a.role.name}
            </Chip>
          ))}
          {!detail && <span className="text-xs text-[var(--cp-muted)]">Memuat…</span>}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <form onSubmit={submitTranslation} className="rounded-[20px] bg-[var(--cp-card)] p-4">
          <p className="mb-3 text-xs text-[var(--cp-muted)]">Terjemahan</p>
          <ul className="mb-3 space-y-1.5 text-sm">
            {translations?.data.translations.map((t) => (
              <li key={t.lang} className="flex justify-between gap-3">
                <span className="text-[var(--cp-muted)]">
                  {LANG_OPTIONS.find((l) => l.value === t.lang)?.label ?? t.lang}
                </span>
                <span className="truncate">{t.name}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <select
              value={tr.lang}
              onChange={(e) => setTr((t) => ({ ...t, lang: e.target.value }))}
              className={`${inputClass} w-28 shrink-0 px-3`}
              aria-label="Bahasa"
            >
              {LANG_OPTIONS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.value.toUpperCase()}
                </option>
              ))}
            </select>
            <input
              value={tr.name}
              onChange={(e) => setTr((t) => ({ ...t, name: e.target.value }))}
              placeholder="Nama menu"
              className={inputClass}
            />
          </div>
          <Button type="submit" variant="ghost" disabled={savingTr} className="mt-3 w-full">
            Simpan terjemahan
          </Button>
        </form>

        <form onSubmit={submitEdit} className="rounded-[20px] bg-[var(--cp-card)] p-4">
          <p className="mb-3 text-xs text-[var(--cp-muted)]">Code & path</p>
          <div className="space-y-2">
            <input
              value={edit.code}
              onChange={(e) => setEdit((f) => ({ ...f, code: e.target.value }))}
              placeholder="CODE"
              aria-label="Code"
              className={inputClass}
            />
            <input
              value={edit.path}
              onChange={(e) => setEdit((f) => ({ ...f, path: e.target.value }))}
              placeholder="/dashboard/..."
              aria-label="Path"
              className={inputClass}
            />
          </div>
          <Button type="submit" disabled={savingMenu} className="mt-3 w-full">
            Simpan perubahan
          </Button>
        </form>
      </div>
    </DetailCard>
  )
}

function CreateMenuModal({ menus, onClose }: { menus: ConfigMenu[]; onClose: () => void }) {
  const { mutate, isPending } = useCreateMenu()
  const [form, setForm] = useState({ level: 1, code: '', parentId: '', path: '', name: '' })

  // Aturan BE: level 2 → parent level 1, level 3 → parent level 2, level 1 & 4 tanpa parent
  const parentLevel = form.level === 2 ? 1 : form.level === 3 ? 2 : null
  const parents = parentLevel ? menus.filter((m) => m.level === parentLevel) : []

  const submit = (e: FormEvent) => {
    e.preventDefault()
    mutate(
      {
        level: form.level,
        name: form.name.trim(),
        ...(form.code.trim() && { code: form.code.trim().toUpperCase() }),
        ...(parentLevel && form.parentId && { parentId: form.parentId }),
        ...(form.path.trim() && { path: form.path.trim() }),
      },
      { onSuccess: onClose },
    )
  }

  return (
    <Modal open title="Tambah menu" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Level" hint={MENU_LEVELS.find((l) => l.value === form.level)?.hint}>
          <select
            value={form.level}
            onChange={(e) => setForm((f) => ({ ...f, level: Number(e.target.value), parentId: '' }))}
            className={inputClass}
          >
            {MENU_LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                L{l.value} · {l.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Nama" hint="Disimpan untuk bahasa yang sedang aktif">
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={inputClass}
          />
        </Field>
        <Field label={form.level === 1 ? 'Code' : 'Code (opsional)'} hint="Unik, huruf kapital">
          <input
            required={form.level === 1}
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            className={inputClass}
          />
        </Field>
        {parentLevel && (
          <Field label="Parent">
            <select
              required
              value={form.parentId}
              onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))}
              className={inputClass}
            >
              <option value="">Pilih menu level {parentLevel}</option>
              {parents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field label="Path">
          <input
            value={form.path}
            onChange={(e) => setForm((f) => ({ ...f, path: e.target.value }))}
            placeholder="/dashboard/..."
            className={inputClass}
          />
        </Field>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Menyimpan…' : 'Simpan menu'}
        </Button>
      </form>
    </Modal>
  )
}
