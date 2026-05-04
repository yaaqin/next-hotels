// ─── Data tambahan ─────────────────────────────────────────────────────────

import { SectionLabel } from "@/src/components/pages/(publicPage)/about";

interface FoodFlowCard {
    icon: string;
    title: string;
    content: React.ReactNode;
    full?: boolean;
}

interface OrderStep {
    number: string;
    title: string;
    description: string;
}

interface RoleItem {
    badge: string;
    badgeColor: string;
    description: React.ReactNode;
}

// ─── Data ─────────────────────────────────────────────────────────────────

const orderSteps: OrderStep[] = [
    {
        number: "01",
        title: "Browse & Select Menu",
        description:
            "Users see available menu items based on daily stock — sold-out products are automatically unavailable.",
    },
    {
        number: "02",
        title: "Checkout & Pay",
        description:
            "Payment via Midtrans (QRIS, VA, GoPay, etc.). Pricing already includes surcharge if an active partnership applies.",
    },
    {
        number: "03",
        title: "Confirmed → Auto Complete",
        description:
            "Once payment succeeds, the order moves to Confirmed. The system automatically marks it Completed after 5 minutes — indicating the order has been processed and delivered.",
    },
    {
        number: "04",
        title: "Purchase History",
        description:
            "All transactions are saved to the user's profile with item details, total amount, and order status.",
    },
];

const monitoringItems: string[] = [
    "Sales report per site",
    "Multi-site summary per restaurant",
    "Active contracts & types",
    "Monthly billing tracking",
    "Revenue vs cap threshold",
    "Surcharge applied per order",
    "Daily stock & audit log",
    "Global restaurant monitoring",
];

const roles: RoleItem[] = [
    {
        badge: "Hotel Admin",
        badgeColor: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
        description: (
            <>
                <strong className="text-zinc-800 dark:text-zinc-200">CRUD restaurants & restaurant admins</strong>
                , including owner assignment, site access control, and approving partnership proposals and food categories.
            </>
        ),
    },
    {
        badge: "Owner / Manager",
        badgeColor: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
        description: (
            <>
                <strong className="text-zinc-800 dark:text-zinc-200">Assign kitchen staff & cashiers</strong>{" "}
                to specific sites. View consolidated sales reports and performance across all owned sites in one dashboard.
            </>
        ),
    },
    {
        badge: "Kitchen Staff",
        badgeColor: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
        description: (
            <>
                <strong className="text-zinc-800 dark:text-zinc-200">Manage products & daily stock</strong> —
                add/edit menu items, set today's stock, and update remaining stock in real-time. Only accessible for assigned sites.
            </>
        ),
    },
    {
        badge: "Cashier",
        badgeColor: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
        description: (
            <>
                <strong className="text-zinc-800 dark:text-zinc-200">Input walk-in orders</strong> directly
                from the counter without a user account, with on-site payment processing.
            </>
        ),
    },
    {
        badge: "User / Guest",
        badgeColor: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
        description: (
            <>
                <strong className="text-zinc-800 dark:text-zinc-200">Browse menu, order, and pay</strong>{" "}
                directly in-app via Midtrans. Purchase history is automatically saved to their account.
            </>
        ),
    },
];

// ─── Sub-components baru ───────────────────────────────────────────────────

function RoleBadgeRow({ badge, badgeColor, description }: RoleItem) {
    return (
        <div className="flex items-start gap-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0">
            <span
                className={`text-[10px] font-medium tracking-wide px-2.5 py-0.5 rounded-full whitespace-nowrap mt-0.5 ${badgeColor}`}
            >
                {badge}
            </span>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{description}</p>
        </div>
    );
}

function OrderStepRow({ number, title, description }: OrderStep) {
    return (
        <div className="flex gap-4 py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0">
            <span className="font-serif text-lg text-zinc-300 dark:text-zinc-600 min-w-[22px] leading-snug">
                {number}
            </span>
            <div>
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-0.5">{title}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

// ─── Section Food Ordering ─────────────────────────────────────────────────
// Letakkan ini di dalam <AboutPage />, sebelum section Tech Stack

export function FoodOrderSection() {
    return (
        <div className="mb-12">
            <p className="text-[11px] tracking-widest uppercase text-white font-medium mb-5">Food Ordering — Business Flow</p>

            {/* Tenant Banner — FIXED: plain text, no JSX split */}
            <div className="bg-zinc-900 dark:bg-zinc-950 text-zinc-100 rounded-xl p-6 mb-4">
                <p className="text-[11px] tracking-widest uppercase text-zinc-500 font-medium mb-2">
                    Business Model
                </p>
                <p className="font-serif text-white text-xl font-normal mb-2">
                    Restaurant as a{" "}
                    <span className="italic text-zinc-400">Tenant</span>
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">
                    Each restaurant operates as an independent tenant. They have their own dashboard,
                    manage their own menu and stock, and can be present across multiple hotel sites —
                    but must meet contract requirements before their products are visible to users.
                </p>
            </div>

            {/* Partnership */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5 mb-3">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-base">🤝</span>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Partnership Proposal — Required to Go Live
                    </p>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
                    Before a restaurant site's menu is visible to users, it must have an active partnership
                    proposal approved by the hotel admin. Two models are available:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-lg p-3">
                        <p className="text-[10px] tracking-widest uppercase text-zinc-400 font-medium mb-1.5">
                            Subscription
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            Monthly flat fee. Once revenue exceeds the agreed cap, product prices are automatically
                            surcharged by a set percentage.
                        </p>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-lg p-3">
                        <p className="text-[10px] tracking-widest uppercase text-zinc-400 font-medium mb-1.5">
                            Revenue Share
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            No flat fee. The hotel takes a percentage of every transaction — surcharge is applied
                            to product prices from the start.
                        </p>
                    </div>
                </div>
            </div>

            {/* Roles + Order Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-base">👥</span>
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Roles & Access</p>
                    </div>
                    {roles.map((r) => (
                        <RoleBadgeRow key={r.badge} {...r} />
                    ))}
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-base">📱</span>
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">User Order Flow</p>
                    </div>
                    {orderSteps.map((s) => (
                        <OrderStepRow key={s.number} {...s} />
                    ))}
                </div>
            </div>

            {/* Monitoring */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5 mb-3">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-base">📊</span>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Monitoring & Reporting
                    </p>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
                    Every transaction feeds into a central reporting layer. Restaurants with multiple sites
                    can view a consolidated summary across all their locations.
                </p>
                <div className="flex flex-wrap gap-2">
                    {monitoringItems.map((item) => (
                        <span
                            key={item}
                            className="text-xs text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded-full px-3 py-1 bg-zinc-50 dark:bg-zinc-900"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            {/* Food Category */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">🗂️</span>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Food Categories — Global & Per-Site
                    </p>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
                    Food categories serve as global filters on the user side. Hotel admins can create
                    categories that apply across the entire platform.
                </p>
                <div className="flex gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                    <span className="text-sm flex-shrink-0">⚡</span>
                    <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                        Restaurant sites can also{" "}
                        <strong className="font-medium">submit their own categories</strong> if they need
                        specific filters for their menu. These go through a hotel admin approval flow before
                        going live — keeping global category data consistent.
                    </p>
                </div>
            </div>
        </div>
    );
}
