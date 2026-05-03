import { columns, FoodCategoryRow } from "./column"

const statusBadge: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-600",
  PENDING: "bg-blue-50 text-blue-600",
  REJECTED: "bg-red-50 text-red-500",
}

interface Props {
  data: FoodCategoryRow[]
}

export default function FoodCategoryTable({ data }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-blue-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-blue-50 bg-blue-50/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-5 py-3.5 text-xs font-medium text-blue-400 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50/50">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-10 text-blue-300 text-sm"
                >
                  Belum ada kategori
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  {/* Kode */}
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold">
                      {row.code}
                    </span>
                  </td>

                  {/* Nama */}
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-800">{row.name}</p>
                  </td>

                  {/* Deskripsi */}
                  <td className="px-5 py-3.5 text-gray-500 max-w-xs truncate">
                    {row.description ?? "-"}
                  </td>

                  {/* Tipe */}
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        row.isGlobal
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                      {row.isGlobal ? "Global" : "Custom"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        statusBadge[row.status] ?? "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                      {row.status}
                    </span>
                  </td>

                  {/* Dibuat */}
                  <td className="px-5 py-3.5 text-gray-400 text-xs">
                    {new Date(row.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
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