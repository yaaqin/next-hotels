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