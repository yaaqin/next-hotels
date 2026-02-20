export interface menuListProps {
  success: boolean
  message: string
  data: menuListState[]
}

export interface menuListState {
  id: string
  level: number
  code?: string
  path: string
  isActive: boolean
  createdAt: string
  name: string
  parent?: Parent
  creator: Creator
}

export interface Parent {
  id: string
  name: string
}

export interface Creator {
  username: string
}
