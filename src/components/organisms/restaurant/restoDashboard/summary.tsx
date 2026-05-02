import { summaryStats } from "@/src/constans/dummy/restoData";
import { TrendingUp, ShoppingCart, Users, Wallet } from "lucide-react";

const cards = [
  {
    label: "Total Pendapatan",
    value: `Rp ${(summaryStats.totalRevenue / 1_000_000).toFixed(1)}jt`,
    sub: "7 hari terakhir",
    icon: <Wallet size={18} />,
    color: "bg-orange-50 text-orange-600",
    border: "border-orange-100",
  },
  {
    label: "Total Pesanan",
    value: summaryStats.totalOrders.toLocaleString("id-ID"),
    sub: "7 hari terakhir",
    icon: <ShoppingCart size={18} />,
    color: "bg-blue-50 text-blue-600",
    border: "border-blue-100",
  },
  {
    label: "Total Pelanggan",
    value: summaryStats.totalCustomers.toLocaleString("id-ID"),
    sub: "Unik minggu ini",
    icon: <Users size={18} />,
    color: "bg-emerald-50 text-emerald-600",
    border: "border-emerald-100",
  },
  {
    label: "Rata-rata Pesanan",
    value: `Rp ${Math.round(summaryStats.avgOrderValue / 1000)}rb`,
    sub: "Per transaksi",
    icon: <TrendingUp size={18} />,
    color: "bg-purple-50 text-purple-600",
    border: "border-purple-100",
  },
];

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-white rounded-2xl border ${card.border} p-5 flex flex-col gap-3`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-500">{card.label}</p>
            <div className={`w-8 h-8 rounded-lg ${card.color} flex items-center justify-center`}>
              {card.icon}
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">{card.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}