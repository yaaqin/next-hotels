import { axiosPrivate } from "@/src/libs/instance"

export const assignStaffToSite = async ({ 
  staffId, 
  siteCode, 
  role 
}: { 
  staffId: string
  siteCode: string
  role: 'MANAGER' | 'KITCHEN_STAFF' | 'CASHIER'
}) => {
  const res = await axiosPrivate.post(`/resto-data/staff/${staffId}/assign-site`, { siteCode, role })
  return res.data
}