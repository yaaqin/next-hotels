'use client'
import { useRestoDataAdminRestoList } from "@/src/hooks/query/restaurant/restoDashboard/adminResto/list"
import { Owner, Staff } from "@/src/models/restaurant/restoDashboard/adminResto/list"

const roleBadgeColor: Record<string, string> = {
  OWNER: "bg-orange-100 text-orange-700",
  MANAGER: "bg-blue-100 text-blue-700",
  KITCHEN_STAFF: "bg-emerald-100 text-emerald-700",
  CASHIER: "bg-purple-100 text-purple-700",
  UNASSIGNED: "bg-gray-100 text-gray-500",
}

const avatarBg: Record<string, string> = {
  OWNER: "bg-orange-200 text-orange-800",
  MANAGER: "bg-blue-200 text-blue-800",
  KITCHEN_STAFF: "bg-emerald-200 text-emerald-800",
  CASHIER: "bg-purple-200 text-purple-800",
  UNASSIGNED: "bg-gray-200 text-gray-600",
}

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

export default function AdminList() {
  const { data, isLoading } = useRestoDataAdminRestoList()

  const allAdmins: (Owner | Staff)[] = [
    ...(data?.data?.owners ?? []),
    ...(data?.data?.staff ?? []),
  ]

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-sm text-gray-400 text-center py-6">Memuat data...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Pengguna Sistem
          </p>
          <p className="text-base font-bold text-gray-900 mt-0.5">Daftar Admin</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs bg-gray-50 text-gray-500 px-2.5 py-1 rounded-full border border-gray-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {allAdmins.filter((a) => a.isActive).length} aktif
        </span>
      </div>

      <div className="space-y-3">
        {allAdmins.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Belum ada admin</p>
        ) : (
          allAdmins.map((admin) => (
            <div
              key={admin.id}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-default"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${avatarBg[admin.role] ?? avatarBg.UNASSIGNED}`}
                >
                  {getInitials(admin.name)}
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    admin.isActive ? "bg-emerald-400" : "bg-gray-300"
                  }`}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{admin.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{admin.email}</p>
              </div>

              {/* Role badge */}
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${roleBadgeColor[admin.role] ?? roleBadgeColor.UNASSIGNED}`}
              >
                {admin.role}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}