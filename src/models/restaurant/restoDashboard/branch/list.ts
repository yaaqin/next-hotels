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
  contract: BranchContract | null
  // ACTIVE = berlaku, EXPIRING = sisa <= 7 hari, INACTIVE = menu tidak tampil ke tamu
  contractState: 'ACTIVE' | 'EXPIRING' | 'INACTIVE'
  contractDaysLeft: number | null
}

export interface BranchContract {
  status: string
  startDate: string
  endDate: string
}

export interface Site {
  nama: string
  lokasi: string
}
