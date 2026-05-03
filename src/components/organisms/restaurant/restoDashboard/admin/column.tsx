import { Owner, Staff } from "@/src/models/restaurant/restoDashboard/adminResto/list"

export type AdminRestoRow = (Owner | Staff) & { type: 'OWNER' | 'STAFF' }

export const columns = [
  {
    key: "name",
    label: "Nama",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "phone",
    label: "No. Telepon",
  },
  {
    key: "role",
    label: "Role",
  },
  {
    key: "site",
    label: "Site",
  },
  {
    key: "isActive",
    label: "Status",
  },
]