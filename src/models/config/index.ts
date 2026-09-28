export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface RoleRef {
  id: string
  name: string
  level: number
}

export interface Role extends RoleRef {
  description: string | null
  createdAt: string
  createdBy: string | null
}

export interface Admin {
  id: string
  username: string
  email: string
  createdAt: string
  createdBy: string | null
  isActive: boolean
  sitecode: string | null
  role: RoleRef
}

export interface ConfigMenu {
  id: string
  level: number
  code: string | null
  path: string | null
  isActive: boolean
  createdAt: string
  name: string | null
  parent: { id: string; name: string | null } | null
  creator: { username: string }
}

export interface ConfigMenuDetail extends ConfigMenu {
  children: { id: string }[]
  accessControls: { id: string; isAccess: boolean; role: RoleRef }[]
}

export interface MenuTranslations {
  id: string
  createdBy: string
  translations: { lang: string; name: string }[]
}

export interface AccessRow {
  id: string
  isAccess: boolean
  createdAt: string
  role: RoleRef
  menu: {
    id: string
    code: string | null
    level: number
    path: string | null
    isActive: boolean
    name: string | null
  }
}

export interface Site {
  id: string
  nama: string
  lokasi: string
  sitecode: string
}

export interface CreateRolePayload {
  name: string
  description: string
  level: number
}

export interface CreateAdminPayload {
  username: string
  email: string
  password: string
  roleId: string
  sitecode?: string
}

export interface CreateMenuPayload {
  level: number
  code?: string
  parentId?: string
  path?: string
  name: string
}
