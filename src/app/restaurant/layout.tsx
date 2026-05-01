import Sidebar from "@/src/components/organisms/restaurant/dashboard/sidebar";
import Topbar from "@/src/components/organisms/restaurant/dashboard/topBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64">
        <Topbar title="Dashboard" />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}