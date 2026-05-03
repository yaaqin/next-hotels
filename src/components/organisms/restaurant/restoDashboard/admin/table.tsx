import { AdminRestoRow, columns } from "./column"

const roleBadge: Record<string, string> = {
  OWNER: "bg-orange-100 text-orange-600",
  MANAGER: "bg-blue-100 text-blue-600",
  KITCHEN_STAFF: "bg-emerald-100 text-emerald-600",
  CASHIER: "bg-purple-100 text-purple-600",
  UNASSIGNED: "bg-gray-100 text-gray-500",
}

interface Props {
  data: AdminRestoRow[]
}

export default function AdminRestoTable({ data }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-5 py-3.5 text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-10 text-gray-400 text-sm"
                >
                  Belum ada admin
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-orange-50/30 transition-colors"
                >
                  {/* Nama */}
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-800">{row.name}</p>
                  </td>

                  {/* Email */}
                  <td className="px-5 py-3.5 text-gray-500">{row.email}</td>

                  {/* Phone */}
                  <td className="px-5 py-3.5 text-gray-500">
                    {row.phone ?? "-"}
                  </td>

                  {/* Role */}
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        roleBadge[row.role] ?? "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                      {row.role}
                    </span>
                  </td>

                  {/* Site */}
                  <td className="px-5 py-3.5 text-gray-500">
                    {row.site ? (
                      <span className="text-gray-700 font-medium">
                        {row.site.siteCode}
                        {row.site.site?.nama && (
                          <span className="text-gray-400 font-normal ml-1">
                            — {row.site.site.nama}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        row.isActive
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                      {row.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}