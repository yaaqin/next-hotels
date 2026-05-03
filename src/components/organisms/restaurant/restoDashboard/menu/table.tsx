import Image from "next/image"
import { columns, MenuRestoRow } from "./column"

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)

interface Props {
  data: MenuRestoRow[]
}

export default function MenuRestoTable({ data }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-orange-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-orange-50 bg-orange-50/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-5 py-3.5 text-xs font-medium text-orange-400 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-50/50">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-10 text-orange-300 text-sm"
                >
                  Belum ada menu
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-orange-50/30 transition-colors">
                  {/* Gambar */}
                  <td className="px-5 py-3.5">
                    {row.images.length > 0 ? (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-orange-100">
                        <Image
                          src={row.images[0].url}
                          alt={row.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </td>

                  {/* Nama & Deskripsi */}
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-800">{row.name}</p>
                    {row.description && (
                      <p className="text-xs text-gray-400 truncate max-w-xs mt-0.5">
                        {row.description}
                      </p>
                    )}
                  </td>

                  {/* Kategori */}
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 text-xs font-semibold">
                      {row.category.name}
                    </span>
                  </td>

                  {/* Harga */}
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-gray-800">{formatPrice(row.basePrice)}</p>
                  </td>

                  {/* Diskon */}
                  <td className="px-5 py-3.5">
                    {row.discountRules.length > 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                        {row.discountRules.length} diskon aktif
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
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