export interface sitelistProps {
  success: boolean
  message: string
  data: siteListState[]
}

export interface siteListState {
  id: string
  nama: string
  lokasi: string
  createdAt: string
  sitecode: string
  creator: Creator
}

export interface Creator {
  username: string
}
