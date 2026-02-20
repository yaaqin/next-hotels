export interface detailMenuProps {
  success: boolean
  message: string
  data: detailMenuState
}

export interface detailMenuState {
  id: string
  level: number
  code: string
  path: string
  isActive: boolean
  createdAt: string
  name: string
  parent: any
  children: any[]
  accessControls: AccessControl[]
  creator: Creator
}

export interface AccessControl {
  id: string
  isAccess: boolean
  role: Role
}

export interface Role {
  id: string
  name: string
  level: number
}

export interface Creator {
  username: string
}
