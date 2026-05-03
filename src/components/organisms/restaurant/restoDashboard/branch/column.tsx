export type BranchRestoRow = {
  id: string
  siteCode: string
  isActive: boolean
  site: {
    nama: string
    lokasi: string
  }
}

export const columns = [
  { key: "siteCode", label: "Kode Site" },
  { key: "nama", label: "Nama" },
  { key: "lokasi", label: "Lokasi" },
  { key: "isActive", label: "Status" },
]