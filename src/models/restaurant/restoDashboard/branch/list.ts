export interface BranchRestoListProps {
  success: boolean
  message: string
  data: BranchRestoListState[]
}

export interface BranchRestoListState {
  id: string
  siteCode: string
  isActive: boolean
  site: Site
}

export interface Site {
  nama: string
  lokasi: string
}
