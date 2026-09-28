import { FULL_ACCESS_LEVEL, GLOBAL_ROLES, isSystemRole } from '@/src/constans/config'
import { AccessRow, RoleRef } from '@/src/models/config'

export const formatDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    : '-'

export type RoleScope = 'system' | 'global' | 'site'

export const roleScope = (name: string): RoleScope =>
  isSystemRole(name) ? 'system' : GLOBAL_ROLES.includes(name) ? 'global' : 'site'

export const SCOPE_LABEL: Record<RoleScope, string> = {
  system: 'Sistem',
  global: 'Global',
  site: 'Cabang',
}

export const isFullAccess = (role?: Pick<RoleRef, 'level'>) =>
  !!role && role.level >= FULL_ACCESS_LEVEL

// Jumlah menu aktif yang boleh diakses per role
export const countAccessByRole = (rows: AccessRow[] = []) => {
  const map = new Map<string, number>()
  for (const r of rows) {
    if (r.isAccess && r.menu.isActive) map.set(r.role.id, (map.get(r.role.id) ?? 0) + 1)
  }
  return map
}

export const LANG_OPTIONS = [
  { value: 'idn', label: 'Indonesia' },
  { value: 'eng', label: 'English' },
  { value: 'jpn', label: '日本語' },
  { value: 'chn', label: '中文' },
]

export const MENU_LEVELS = [
  { value: 1, label: 'Sidebar', hint: 'Wajib punya code, tanpa parent' },
  { value: 2, label: 'Navbar', hint: 'Parent: menu sidebar (level 1)' },
  { value: 3, label: 'Sub navbar', hint: 'Parent: menu navbar (level 2)' },
  { value: 4, label: 'Standalone', hint: 'Tanpa parent' },
]
