import { NAVIGATION, NavItem } from "@/src/constans/menu/navbar"
import { menuListState } from "@/src/models/menu/list"

export const sidebarMap = (menus: menuListState[]) => {
  return menus
    .filter(menu => menu.level === 1 && menu.isActive)
    .map(menu => ({
      id: menu.id,
      name: menu.name,
      path: menu.path,
      code: menu.code,
      createdAt: menu.createdAt,
      creator: menu.creator.username,
    }))
}

const collectPaths = (items: NavItem[]): string[] =>
  items.flatMap((item) => [
    ...(item.path ? [item.path] : []),
    ...(item.matchPaths ?? []),
    ...(item.children ? collectPaths(item.children) : []),
  ])

// Gabungkan NAVIGATION (hardcode) dengan menu dari Access Control (/me/menus):
// menu L2 yang belum ada di NAVIGATION ditambahkan ke navbar parent-nya, dan path L1 dari DB ikut dipakai untuk mencocokkan URL.
export const buildNavigation = (menus?: menuListState[]): NavItem[] => {
  if (!menus) return NAVIGATION

  return NAVIGATION.map((section) => {
    const parent = menus.find(m => m.level === 1 && m.isActive && m.code?.toLowerCase() === section.key)
    if (!parent) return section

    const known = new Set(collectPaths([section]))
    const extra: NavItem[] = menus
      .filter(m => m.level === 2 && m.isActive && m.parent?.id === parent.id && !known.has(m.path))
      .map(m => ({ key: m.id, label: m.name, path: m.path, parentKey: section.key }))

    return {
      ...section,
      matchPaths: [...(section.matchPaths ?? []), parent.path],
      children: [...(section.children ?? []), ...extra],
    }
  })
}

// Cari parent menu yang punya path paling cocok dengan URL sekarang.
// '/dashboard' hanya cocok persis, supaya halaman yang tidak terdaftar tidak selalu jatuh ke Dashboard.
// Kalau satu path ada di beberapa parent (mis. Refund), pertahankan parent yang sedang aktif.
export const matchSidebarByPath = (sections: NavItem[], pathname: string, current: string): string | undefined => {
  let best: { keys: string[]; length: number } | undefined

  for (const section of sections) {
    for (const path of collectPaths([section])) {
      const isMatch = pathname === path || (path !== '/dashboard' && pathname.startsWith(`${path}/`))
      if (!isMatch) continue
      if (!best || path.length > best.length) best = { keys: [section.key], length: path.length }
      else if (path.length === best.length && !best.keys.includes(section.key)) best.keys.push(section.key)
    }
  }

  if (!best) return undefined
  return best.keys.includes(current) ? current : best.keys[0]
}
