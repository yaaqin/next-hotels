"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

// Pintu masuk ke /user-guide dari homepage — tiap kartu langsung buka topiknya
const CARDS = [
  { key: "booking", topic: "booking-search" },
  { key: "payment", topic: "payment-overview" },
  { key: "reschedule", topic: "manage-reschedule" },
  { key: "refund", topic: "manage-cancel" },
  { key: "credit", topic: "credit-balance" },
  { key: "food", topic: "food-order" },
] as const;

export default function GuideTeaser() {
  const { t } = useTranslation();

  return (
    <section
      id="panduan"
      className="bg-white px-5 py-14 md:px-14 lg:px-24"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10">
        <div className="max-w-xl">
          <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[#1A56A0] mb-2">
            {t("text.home.guide.eyebrow")}
          </p>
          <h2
            className="text-[2rem] md:text-[2.8rem] font-light text-[#0A1828] leading-tight tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {t("text.home.guide.title")}
          </h2>
          <p className="mt-3 text-sm text-[#5B90C9] leading-relaxed">{t("text.home.guide.subtitle")}</p>
        </div>
        <Link
          href="/user-guide"
          className="self-start md:self-auto shrink-0 rounded-xl bg-[#0A1828] px-6 py-3 text-[0.7rem] tracking-[0.14em] uppercase text-white hover:bg-[#1A56A0] transition-colors"
        >
          {t("text.home.guide.cta")} →
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card, i) => (
          <Link
            key={card.key}
            href={`/user-guide?topic=${card.topic}`}
            className="group rounded-[20px] bg-[#EEF3FA] border border-[#DDE8F5] p-6 hover:border-[#1A56A0] transition-colors"
          >
            <p className="text-[0.6rem] tracking-[0.16em] text-[#5B90C9]">{String(i + 1).padStart(2, "0")}</p>
            <p
              className="mt-2 text-xl font-light text-[#0A1828]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {t(`text.home.guide.cards.${card.key}.title`)}
            </p>
            <p className="mt-1 text-xs text-[#2C4E72] leading-relaxed">
              {t(`text.home.guide.cards.${card.key}.desc`)}
            </p>
            <p className="mt-4 text-[0.6rem] tracking-[0.14em] uppercase text-[#1A56A0] opacity-70 group-hover:opacity-100 transition-opacity">
              {t("text.home.guide.read")} →
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
