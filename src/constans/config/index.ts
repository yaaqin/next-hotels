// Harus sama dengan SYSTEM_ROLES di BE (nest-hotels/src/auth/guards/system-role.guard.ts)
export const SYSTEM_ROLES = ['DEV', 'SUPERADMIN']

export const isSystemRole = (roleName?: string | null) =>
  !!roleName && SYSTEM_ROLES.includes(roleName)

// Role global boleh tanpa site, sisanya wajib punya sitecode (aturan BE admin.service)
export const GLOBAL_ROLES = ['DEV', 'OWNER', 'SUPERADMIN']

// Role level >= ini selalu punya akses penuh, tidak bisa di-toggle (aturan BE accessControl)
export const FULL_ACCESS_LEVEL = 800

export const CONFIG_TABS = [
  { label: 'Overview', href: '/config-panel' },
  { label: 'Roles', href: '/config-panel/roles' },
  { label: 'Admins', href: '/config-panel/admins' },
  { label: 'Menus', href: '/config-panel/menus' },
  { label: 'Access Control', href: '/config-panel/access-control' },
]
