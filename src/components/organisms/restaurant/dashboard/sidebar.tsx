"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  BookOpen,
  ShoppingBag,
  Layout,
  BarChart2,
  Users,
  Settings,
  ChefHat,
  LogOut,
} from "lucide-react";
import { navItems } from "@/src/constans/dummy/restoData";

const iconMap: Record<string, React.ReactNode> = {
  grid: <LayoutGrid size={18} />,
  "book-open": <BookOpen size={18} />,
  "shopping-bag": <ShoppingBag size={18} />,
  layout: <Layout size={18} />,
  "bar-chart-2": <BarChart2 size={18} />,
  users: <Users size={18} />,
  settings: <Settings size={18} />,
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-sm">
            <ChefHat size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-base leading-tight">Restorantiku</p>
            <p className="text-xs text-gray-400">Management System</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">
          Menu Utama
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <span
                className={`transition-colors ${
                  isActive ? "text-orange-500" : "text-gray-400 group-hover:text-gray-600"
                }`}
              >
                {iconMap[item.icon]}
              </span>
              {item.label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-150 group">
          <LogOut size={18} className="group-hover:text-red-400 transition-colors" />
          Keluar
        </button>
      </div>
    </aside>
  );
}