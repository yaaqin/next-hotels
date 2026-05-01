import AdminList from "@/src/components/organisms/restaurant/dashboard/adminDataList";
import RevenueChart from "@/src/components/organisms/restaurant/dashboard/revenueResto";
import SummaryCards from "@/src/components/organisms/restaurant/dashboard/summary";
import TopProducts from "@/src/components/organisms/restaurant/dashboard/topProducts";


export default function DashboardRestoPage() {
  return (
    <div className="space-y-5">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Selamat datang kembali 👋</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Berikut ringkasan aktivitas restoranmu hari ini.
        </p>
      </div>

      {/* Summary stats */}
      <SummaryCards />

      {/* Main grid: chart + sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Revenue chart — 2/3 width */}
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>

        {/* Admin list — 1/3 width */}
        <div>
          <AdminList />
        </div>
      </div>

      {/* Top products — full width */}
      <TopProducts />
    </div>
  );
}