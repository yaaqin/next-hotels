'use client'
import { Avatar, Chip, DetailCard, Empty, Tile } from '@/src/components/organisms/configPanel/ui'
import { Admin } from '@/src/models/config'
import { KeyRound } from 'lucide-react'
import Link from 'next/link'
import { SCOPE_LABEL, formatDate, roleScope } from './helpers'

export default function AdminDetail({
  admin,
  admins,
  menuCount,
  totalMenus,
}: {
  admin?: Admin
  admins: Admin[]
  menuCount?: number
  totalMenus?: number
}) {
  if (!admin) return <Empty dark>Pilih admin untuk lihat detail</Empty>

  // createdBy berisi id admin pembuat (atau "system" untuk seed)
  const creator = admins.find((a) => a.id === admin.createdBy)?.username ?? admin.createdBy ?? '-'

  return (
    <DetailCard className="flex h-full flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-[var(--cp-muted)]">Detail admin</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h3 className="truncate text-3xl font-light">{admin.username}</h3>
            <Chip tone={admin.isActive ? 'muted' : 'danger'}>
              {admin.isActive ? 'Aktif' : 'Nonaktif'}
            </Chip>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--cp-muted)]">Role</p>
          <p className="mt-1 text-xl font-semibold tracking-tight">{admin.role.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="Level role" value={admin.role.level} />
        <Tile label="Cakupan" value={SCOPE_LABEL[roleScope(admin.role.name)]} />
        <Tile label="Site" value={admin.sitecode ?? 'Semua'} />
        <Tile
          label="Menu diakses"
          value={menuCount !== undefined ? `${menuCount}/${totalMenus ?? '-'}` : '-'}
        />
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-4 rounded-[20px] bg-[var(--cp-card)] p-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Avatar name={admin.username} size={40} />
          <div className="min-w-0">
            <p className="text-[11px] text-[var(--cp-muted)]">Email</p>
            <p className="truncate text-sm">{admin.email}</p>
          </div>
        </div>
        <div>
          <p className="text-[11px] text-[var(--cp-muted)]">Dibuat</p>
          <p className="text-sm">{formatDate(admin.createdAt)}</p>
        </div>
        <div>
          <p className="text-[11px] text-[var(--cp-muted)]">Oleh</p>
          <p className="text-sm">{creator}</p>
        </div>
        <Link
          href={`/config-panel/access-control?role=${admin.role.id}`}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--cp-accent)] px-5 text-xs font-semibold text-[var(--cp-accent-ink)]"
        >
          <KeyRound size={14} />
          Atur akses role
        </Link>
      </div>
    </DetailCard>
  )
}
