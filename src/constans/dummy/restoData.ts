export const adminList = [
  {
    id: "1",
    name: "Budi Santoso",
    username: "budi.santoso",
    role: "Superadmin",
    roleLevel: 500,
    email: "budi@restorantiku.id",
    avatar: "BS",
    status: "online",
  },
  {
    id: "2",
    name: "Sari Dewi",
    username: "sari.dewi",
    role: "Admin",
    roleLevel: 300,
    email: "sari@restorantiku.id",
    avatar: "SD",
    status: "online",
  },
  {
    id: "3",
    name: "Ahmad Fauzi",
    username: "ahmad.fauzi",
    role: "Admin",
    roleLevel: 300,
    email: "ahmad@restorantiku.id",
    avatar: "AF",
    status: "offline",
  },
  {
    id: "4",
    name: "Rina Kusuma",
    username: "rina.kusuma",
    role: "Kasir",
    roleLevel: 100,
    email: "rina@restorantiku.id",
    avatar: "RK",
    status: "online",
  },
];

export const topProducts = [
  {
    id: "1",
    name: "Nasi Goreng Spesial",
    category: "Makanan",
    sold: 342,
    revenue: 5_130_000,
    trend: "up",
    emoji: "🍳",
  },
  {
    id: "2",
    name: "Es Teh Manis",
    category: "Minuman",
    sold: 289,
    revenue: 1_445_000,
    trend: "up",
    emoji: "🧋",
  },
  {
    id: "3",
    name: "Ayam Bakar",
    category: "Makanan",
    sold: 214,
    revenue: 6_420_000,
    trend: "down",
    emoji: "🍗",
  },
  {
    id: "4",
    name: "Mie Goreng",
    category: "Makanan",
    sold: 198,
    revenue: 2_970_000,
    trend: "up",
    emoji: "🍜",
  },
  {
    id: "5",
    name: "Jus Alpukat",
    category: "Minuman",
    sold: 167,
    revenue: 2_505_000,
    trend: "up",
    emoji: "🥑",
  },
];

export const dailyRevenue = [
  { day: "Sen", date: "28 Apr", revenue: 3_250_000, orders: 87 },
  { day: "Sel", date: "29 Apr", revenue: 2_870_000, orders: 74 },
  { day: "Rab", date: "30 Apr", revenue: 4_120_000, orders: 103 },
  { day: "Kam", date: "1 Mei", revenue: 3_780_000, orders: 95 },
  { day: "Jum", date: "2 Mei", revenue: 5_640_000, orders: 141 },
  { day: "Sab", date: "3 Mei", revenue: 6_920_000, orders: 178 },
  { day: "Min", date: "4 Mei", revenue: 5_430_000, orders: 136 },
];

export const summaryStats = {
  totalRevenue: 32_010_000,
  totalOrders: 814,
  totalCustomers: 623,
  avgOrderValue: 39_327,
};

export const navItems = [
  { label: "Dashboard", href: "/restaurant", icon: "grid" },
  { label: "Menu", href: "/restaurant/menu", icon: "book-open" },
  // { label: "Pesanan", href: "/restaurant/orders", icon: "shopping-bag" },
  // { label: "Meja", href: "/restaurant/tables", icon: "layout" },
  // { label: "Laporan", href: "/restaurant/reports", icon: "bar-chart-2" },
  { label: "Admin", href: "/restaurant/admin", icon: "users" },
  // { label: "Pengaturan", href: "/restaurant/settings", icon: "settings" },
];