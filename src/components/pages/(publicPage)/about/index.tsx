import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

interface FlowStep {
  number: string;
  title: string;
  description: string;
}

interface RoadmapItem {
  status: "done" | "progress" | "planned";
  label: string;
  description: string;
}

interface StackItem {
  label: string;
  items: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const features: FeatureCard[] = [
  {
    icon: "🏨",
    title: "Hotel & Room Management",
    description:
      "Full CRUD for hotels with room types, facilities, galleries, and multi-language support at the database level.",
  },
  {
    icon: "📋",
    title: "Proposal-Based Pricing",
    description:
      "Prices aren't static data — they're submitted via proposals with date ranges, long holiday overrides, weekends, and specific date rules. No duration limits.",
  },
  {
    icon: "✅",
    title: "Approval Workflow",
    description:
      "Pricing proposals go through a structured approval flow before going live. Admins have full control over what pricing is active.",
  },
  {
    icon: "🔑",
    title: "Booking + Google Auth",
    description:
      "Users must sign in via Google to book. History and activity are automatically tracked per account.",
  },
  {
    icon: "💳",
    title: "Midtrans + Crypto Payment",
    description:
      "Payments are integrated with Midtrans and support cryptocurrency as an alternative payment method.",
  },
  {
    icon: "🔄",
    title: "Cancellation & Refund",
    description:
      "Cancel with admin-configured penalty policies. Refund via cash (min. 3 business days) or instant credit — redeemable as crypto.",
  },
  {
    icon: "📊",
    title: "Daily Monitoring",
    description:
      "Admin dashboard with daily booking rate and real-time revenue monitoring.",
  },
  {
    icon: "👤",
    title: "User Profile & History",
    description:
      "Profile page for tracking all booking activity, statuses, and transaction history per user.",
  },
];

const pricingFlow: FlowStep[] = [
  {
    number: "01",
    title: "Create a pricing proposal",
    description:
      "Admin selects a date range — can be 1 week, 1 month, or 1 year. Set a base price, then override for long holidays, weekends, and specific dates.",
  },
  {
    number: "02",
    title: "Review & approval",
    description:
      "The proposal is submitted through an approval flow. Reviewers can approve or reject before the price goes live.",
  },
  {
    number: "03",
    title: "Price goes live",
    description:
      "Once approved, prices are immediately active for the configured date range. No manual date-by-date entry required.",
  },
];

const roadmap: RoadmapItem[] = [
  {
    status: "progress",
    label: "Reschedule",
    description: "Move an existing booking to a different date",
  },
  {
    status: "progress",
    label: "Credit payment",
    description: "Pay for reschedules using credit balance",
  },
  {
    status: "progress",
    label: "Multi-night booking",
    description: "Reserve rooms for more than one night",
  },
  {
    status: "planned",
    label: "Food ordering",
    description: "In-booking food ordering integrated into the stay",
  },
  {
    status: "planned",
    label: "Porto / CMS",
    description: "Content management for menus and F&B product catalog",
  },
];

const stack: StackItem[] = [
  { label: "Frontend", items: "Next.js · TypeScript · Tailwind CSS · React Query" },
  { label: "Backend", items: "Node.js · REST API · Multi-language DB schema" },
  { label: "Payments", items: "Midtrans · Crypto payment gateway" },
  { label: "Auth & Infra", items: "Google OAuth · JWT · Admin dashboard" },
];

const principles: string[] = [
  "Proposal-driven pricing",
  "No hardcoded date limits",
  "Multi-layer approval",
  "Flexible refund modes",
  "Crypto-native",
  "Per-policy cancellation",
  "Activity-tracked users",
  "Admin-first monitoring",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] tracking-widest uppercase text-zinc-400 font-medium mb-5">
      {children}
    </p>
  );
}

function Badge({
  status,
}: {
  status: "live" | "in-progress";
}) {
  const isLive = status === "live";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${
        isLive
          ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
          : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isLive ? "bg-green-500" : "bg-amber-500"
        }`}
      />
      {isLive ? "MVP 1 — Live" : "MVP 2 — In Progress"}
    </span>
  );
}

function FeatureCardItem({ icon, title, description }: FeatureCard) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-4 flex flex-col gap-2.5">
      <span className="text-base">{icon}</span>
      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{title}</p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}

function FlowStepItem({ number, title, description }: FlowStep) {
  return (
    <div className="flex gap-4 py-4 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0">
      <span className="font-serif text-xl text-zinc-300 dark:text-zinc-600 min-w-[24px] leading-snug">
        {number}
      </span>
      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">{title}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

const statusConfig = {
  done: { color: "bg-green-500", label: "Done" },
  progress: { color: "bg-amber-400", label: "In Progress" },
  planned: { color: "bg-zinc-300 dark:bg-zinc-600", label: "Planned" },
};

function RoadmapItemRow({ status, label, description }: RoadmapItem) {
  const config = statusConfig[status];
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${config.color}`} />
      <span className="text-zinc-500 dark:text-zinc-400">
        <span className="font-medium text-zinc-900 dark:text-zinc-100">{label}</span>
        {" — "}
        {description}
      </span>
    </div>
  );
}

function StackCard({ label, items }: StackItem) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-900/60 rounded-lg p-4">
      <p className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium mb-1.5">
        {label}
      </p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{items}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 font-sans text-zinc-900 dark:text-zinc-100">

      {/* Hero */}
      <div className="mb-12 pb-10 border-b border-zinc-100 dark:border-zinc-800">
        <p className="text-[11px] tracking-widest uppercase text-zinc-400 font-medium mb-4">
          About this project
        </p>
        <h1 className="font-serif text-4xl leading-tight font-normal mb-4">
          Hotel Booking —{" "}
          <em className="italic text-zinc-400">built for real complexity</em>
        </h1>
        <p className="text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-xl mb-5">
          A full-stack hotel reservation platform built from scratch, designed to handle dynamic
          pricing, multi-policy cancellation, crypto payments, and real-time booking monitoring in
          one integrated system.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge status="live" />
          <Badge status="in-progress" />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
          >
            Try the demo
            <span>→</span>
          </a>
          <p className="text-xs text-zinc-400 m-0">
            Use the test credentials below to get started
          </p>
        </div>
      </div>

      {/* Core Features */}
      <div className="mb-12">
        <SectionLabel>Core features — MVP 1</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f) => (
            <FeatureCardItem key={f.title} {...f} />
          ))}
        </div>
      </div>

      {/* Pricing Flow */}
      <div className="mb-12">
        <SectionLabel>Pricing proposal flow</SectionLabel>
        <div className="flex flex-col">
          {pricingFlow.map((step) => (
            <FlowStepItem key={step.number} {...step} />
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="mb-12">
        <SectionLabel>In development — MVP 2</SectionLabel>
        <div className="flex flex-col gap-3">
          {roadmap.map((item) => (
            <RoadmapItemRow key={item.label} {...item} />
          ))}
        </div>
        <div className="flex items-center gap-4 mt-5 text-xs text-zinc-400 dark:text-zinc-600">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" /> In progress
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 inline-block" /> Planned
          </span>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="mb-12">
        <SectionLabel>Tech overview</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stack.map((s) => (
            <StackCard key={s.label} {...s} />
          ))}
        </div>
      </div>

      {/* Design Principles */}
      <div className="mb-12">
        <SectionLabel>Design principles</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {principles.map((p) => (
            <span
              key={p}
              className="text-xs text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded-full px-3 py-1 bg-zinc-50 dark:bg-zinc-900"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Test Credentials */}
      <div className="mb-12">
        <SectionLabel>Test credentials</SectionLabel>
        <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-base">🔐</span>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-0.5">
                Demo account
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Use these credentials to explore the platform without creating an account.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-lg px-4 py-3">
              <p className="text-[11px] tracking-widest uppercase text-zinc-400 font-medium mb-1.5">
                Username
              </p>
              <p className="text-sm font-medium font-mono text-zinc-900 dark:text-zinc-100 select-all">
                testing
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-lg px-4 py-3">
              <p className="text-[11px] tracking-widest uppercase text-zinc-400 font-medium mb-1.5">
                Password
              </p>
              <p className="text-sm font-medium font-mono text-zinc-900 dark:text-zinc-100 select-all">
                1234abcd
              </p>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-600 mt-3">
            ⚠ This account is shared — please do not change the password or personal details.
          </p>
          <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
              Need access to other roles (admin, reviewer, etc.)?
            </span>
            <a
              href="mailto:yaqin.me@gmail.com"
              className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300 underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              yaqin.me@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6 flex items-center justify-between flex-wrap gap-3">
        <p className="text-xs text-zinc-400">
          Hotel Booking Platform · Built from scratch · MVP 1 production-ready
        </p>
        <p className="text-xs text-zinc-300 dark:text-zinc-600">
          More features shipping soon →
        </p>
      </div>

    </div>
  );
}