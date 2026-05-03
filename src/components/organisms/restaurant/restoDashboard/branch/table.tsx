import { BranchRestoRow, columns } from "./column"

interface Props {
  data: BranchRestoRow[]
}

export default function BranchRestoTable({ data }: Props) {
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
                  Belum ada cabang
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-orange-50/30 transition-colors">
                  {/* Kode Site */}
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 text-xs font-semibold">
                      {row.siteCode}
                    </span>
                  </td>

                  {/* Nama */}
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-800">{row.site.nama}</p>
                  </td>

                  {/* Lokasi */}
                  <td className="px-5 py-3.5 text-gray-500">{row.site.lokasi}</td>

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