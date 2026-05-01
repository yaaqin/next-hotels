import { topProducts } from "@/src/constans/dummy/restoData";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function TopProducts() {
  const maxSold = Math.max(...topProducts.map((p) => p.sold));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Produk Terlaris
          </p>
          <p className="text-base font-bold text-gray-900 mt-0.5">Top 5 Minggu Ini</p>
        </div>
        <span className="text-xs text-orange-500 font-medium cursor-pointer hover:underline">
          Lihat semua →
        </span>
      </div>

      <div className="space-y-4">
        {topProducts.map((product, idx) => (
          <div key={product.id} className="flex items-center gap-3 group">
            {/* Rank */}
            <span
              className={`text-xs font-bold w-5 text-center ${
                idx === 0
                  ? "text-orange-500"
                  : idx === 1
                  ? "text-gray-400"
                  : idx === 2
                  ? "text-amber-600"
                  : "text-gray-300"
              }`}
            >
              {idx + 1}
            </span>

            {/* Emoji icon */}
            <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-lg flex-shrink-0">
              {product.emoji}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-gray-800 truncate pr-2">
                  {product.name}
                </p>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {product.trend === "up" ? (
                    <TrendingUp size={12} className="text-emerald-500" />
                  ) : (
                    <TrendingDown size={12} className="text-red-400" />
                  )}
                  <span className="text-xs font-semibold text-gray-700">
                    {product.sold} terjual
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === 0 ? "bg-orange-500" : "bg-orange-200"
                  }`}
                  style={{ width: `${(product.sold / maxSold) * 100}%` }}
                />
              </div>

              {/* Revenue */}
              <p className="text-[10px] text-gray-400 mt-1">
                Rp {product.revenue.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}