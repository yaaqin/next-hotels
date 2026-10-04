"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GuideBlock, GuideTopic, USER_GUIDE, getGuideTopics } from "@/src/constans/guide";
import { useCurrentLanguage } from "@/src/hooks/useCurrentLanguage";
import { useLanguageStore } from "@/src/stores/languageStore";
import { SUPPORTED_LANGS, type SupportedLang } from "@/src/utils/languageCookie";

// ─── Palette (sama dengan halaman publik lain) ────────────────────────────────

const C = {
  bg: "#EEF3FA",
  panel: "#DDE8F5",
  line: "#B5CDE8",
  ink: "#0A1828",
  text: "#2C4E72",
  muted: "#5B90C9",
  accent: "#1A56A0",
  dark: "#0A1E38",
  darkLine: "#163356",
  darkText: "#6A9EC5",
};

const CALLOUT: Record<"note" | "tip" | "warning", { bar: string; bg: string; text: string; border: string }> = {
  note: { bar: C.accent, bg: C.dark, text: C.darkText, border: C.darkLine },
  tip: { bar: "#10B981", bg: "#ECFDF5", text: "#047857", border: "#A7F3D0" },
  warning: { bar: "#F59E0B", bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" },
};

const LANG_LABELS: Record<SupportedLang, string> = {
  idn: "Bahasa Indonesia",
  eng: "English",
  jpn: "日本語",
  chn: "中文",
};

// ─── Blocks ───────────────────────────────────────────────────────────────────

function BlockTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.6rem] tracking-[0.16em] uppercase mb-3" style={{ color: C.muted }}>
      {children}
    </p>
  );
}

function Block({ block }: { block: GuideBlock }) {
  const { t } = useTranslation();
  if (block.type === "steps") {
    return (
      <div>
        {block.title && <BlockTitle>{block.title}</BlockTitle>}
        <ol className="space-y-2.5">
          {block.items.map((text, i) => (
            <li key={i} className="flex items-start gap-4">
              <span
                className="shrink-0 flex items-center justify-center rounded-lg"
                style={{
                  width: 28,
                  height: 28,
                  background: C.panel,
                  border: `0.5px solid ${C.line}`,
                  fontSize: "0.6rem",
                  color: C.accent,
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="pt-1 leading-relaxed" style={{ fontSize: "0.8rem", color: C.text }}>
                {text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (block.type === "list") {
    return (
      <div className="rounded-xl px-5 py-4" style={{ background: C.panel, border: `0.5px solid ${C.line}` }}>
        {block.title && <BlockTitle>{block.title}</BlockTitle>}
        <ul className="space-y-2">
          {block.items.map((text, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-[0.45rem] shrink-0 rounded-full" style={{ width: 5, height: 5, background: C.accent }} />
              <p className="leading-relaxed" style={{ fontSize: "0.78rem", color: C.text }}>
                {text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const style = CALLOUT[block.type];
  return (
    <div
      className="flex gap-3 rounded-xl px-5 py-4"
      style={{ background: style.bg, border: `0.5px solid ${style.border}` }}
    >
      <span className="shrink-0 mt-0.5 rounded" style={{ width: 4, minHeight: 16, background: style.bar }} />
      <div>
        <p className="text-[0.58rem] tracking-[0.16em] uppercase mb-1" style={{ color: style.bar }}>
          {t(`guide.callout.${block.type}`)}
        </p>
        <p className="leading-relaxed" style={{ fontSize: "0.76rem", color: style.text }}>
          {block.text}
        </p>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function matches(topic: GuideTopic, q: string) {
  if (!q) return true;
  const haystack = [
    topic.title,
    topic.summary,
    ...topic.blocks.flatMap((b) => ("items" in b ? [b.title ?? "", ...b.items] : [b.text])),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

function Sidebar({
  selectedId,
  onSelect,
  onClose,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const lang = useCurrentLanguage();
  const { setLanguage } = useLanguageStore();
  const [search, setSearch] = useState("");
  const q = search.trim().toLowerCase();
  const categories = USER_GUIDE[lang]
    .map((c) => ({ ...c, topics: c.topics.filter((t) => matches(t, q)) }))
    .filter((c) => c.topics.length > 0);

  return (
    <>
      <div className="px-4 pt-5 pb-4 shrink-0" style={{ borderBottom: `0.5px solid ${C.line}` }}>
        <div className="flex items-start justify-between">
          <div>
            <Link href="/" className="text-[0.5rem] tracking-[0.2em] uppercase mb-1 block" style={{ color: C.accent }}>
              Marina by Sand
            </Link>
            <h1
              className="font-light leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.35rem", color: C.ink }}
            >
              {t("guide.title")}
            </h1>
          </div>
          <button
            onClick={onClose}
            className="md:hidden flex items-center justify-center rounded-lg mt-0.5"
            style={{ width: 28, height: 28, border: `0.5px solid ${C.line}`, color: C.muted }}
            aria-label={t("guide.close")}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("guide.search")}
          className="mt-4 w-full rounded-lg px-3 py-2 text-[0.72rem] outline-none placeholder:text-[#8DB0D6]"
          style={{ background: C.bg, border: `0.5px solid ${C.line}`, color: C.ink }}
        />
        <select
          value={lang}
          onChange={(e) => setLanguage(e.target.value as SupportedLang)}
          aria-label={t("guide.language")}
          className="mt-2 w-full rounded-lg px-3 py-2 text-[0.72rem] outline-none"
          style={{ background: C.bg, border: `0.5px solid ${C.line}`, color: C.text }}
        >
          {SUPPORTED_LANGS.map((l) => (
            <option key={l} value={l}>
              {LANG_LABELS[l]}
            </option>
          ))}
        </select>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {categories.length === 0 && (
          <p className="px-1 text-[0.7rem]" style={{ color: C.muted }}>
            {t("guide.noResults")}
          </p>
        )}
        {categories.map((cat) => (
          <div key={cat.id}>
            <p className="text-[0.52rem] tracking-[0.18em] uppercase mb-2 px-1" style={{ color: C.muted }}>
              {cat.title}
            </p>
            <div className="space-y-0.5">
              {cat.topics.map((topic) => {
                const active = topic.id === selectedId;
                return (
                  <button
                    key={topic.id}
                    onClick={() => onSelect(topic.id)}
                    className="w-full text-left transition-colors"
                    style={{
                      padding: "0.45rem 0.75rem",
                      borderRadius: 10,
                      fontSize: "0.72rem",
                      letterSpacing: "0.03em",
                      background: active ? C.bg : "transparent",
                      color: active ? C.ink : C.text,
                      border: active ? `0.5px solid ${C.accent}` : "0.5px solid transparent",
                    }}
                  >
                    {topic.title}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const CONTENT_ID = "guide-content";

export default function UserGuide() {
  const { t } = useTranslation();
  const lang = useCurrentLanguage();
  const allGuideTopics = getGuideTopics(lang);
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicParam = searchParams.get("topic");

  const index = Math.max(0, allGuideTopics.findIndex((t) => t.id === topicParam));
  const topic = allGuideTopics[index];
  const prev = allGuideTopics[index - 1];
  const next = allGuideTopics[index + 1];

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Topik disimpan di URL supaya bisa dibagikan / dibuka langsung dari halaman lain
  const select = (id: string) => {
    router.replace(`/user-guide?topic=${id}`, { scroll: false });
    setSidebarOpen(false);
  };

  // Konten scroll ke atas tiap ganti topik
  useEffect(() => {
    document.getElementById(CONTENT_ID)?.scrollTo({ top: 0 });
  }, [topic.id]);

  return (
    <div className="flex h-dvh p-4 gap-3 relative" style={{ background: C.bg, fontFamily: "'Montserrat', sans-serif" }}>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 md:hidden"
          style={{ background: "rgba(10, 24, 40, 0.35)", backdropFilter: "blur(2px)" }}
        />
      )}

      {/* Sidebar — desktop selalu tampil, mobile jadi drawer */}
      <aside
        className={`flex flex-col shrink-0 rounded-2xl overflow-hidden fixed md:static inset-y-4 left-4 z-30 w-[250px] transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-[calc(100%+2rem)]"
        }`}
        style={{ background: C.panel, border: `0.5px solid ${C.line}` }}
      >
        <Sidebar selectedId={topic.id} onSelect={select} onClose={() => setSidebarOpen(false)} />
      </aside>

      <button
        onClick={() => setSidebarOpen((v) => !v)}
        className="fixed bottom-5 left-5 z-40 flex items-center justify-center rounded-full shadow-lg md:hidden"
        style={{ width: 44, height: 44, background: C.accent, color: C.bg }}
        aria-label={t("guide.openList")}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4.5H14M2 8H14M2 11.5H14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>

      <main
        id={CONTENT_ID}
        className="flex-1 rounded-2xl overflow-auto"
        style={{ background: C.bg, border: `0.5px solid ${C.line}` }}
      >
        <div className="px-5 sm:px-8 py-7 max-w-2xl">
          <div className="flex items-center gap-2 mb-4 text-[0.58rem] tracking-[0.12em] uppercase">
            <Link href="/" style={{ color: C.muted }}>
              {t("guide.home")}
            </Link>
            <span style={{ color: C.line }}>›</span>
            <span style={{ color: C.muted }}>{topic.categoryTitle}</span>
          </div>

          <h2
            className="font-light leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.9rem", color: C.ink }}
          >
            {topic.title}
          </h2>
          <p className="mt-2 leading-relaxed" style={{ fontSize: "0.8rem", color: C.muted }}>
            {topic.summary}
          </p>
          <div className="mt-3 mb-7" style={{ width: 32, height: 1, background: C.accent, opacity: 0.4 }} />

          <div className="space-y-6">
            {topic.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>

          {topic.cta && (
            <Link
              href={topic.cta.href}
              className="mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[0.7rem] tracking-[0.12em] uppercase transition-opacity hover:opacity-90"
              style={{ background: C.accent, color: C.bg }}
            >
              {topic.cta.label} →
            </Link>
          )}

          {/* Prev / next */}
          <div className="mt-10 pt-6 grid grid-cols-2 gap-3" style={{ borderTop: `0.5px solid ${C.line}` }}>
            {prev ? (
              <button
                onClick={() => select(prev.id)}
                className="text-left rounded-xl px-4 py-3"
                style={{ border: `0.5px solid ${C.line}` }}
              >
                <p className="text-[0.55rem] tracking-[0.14em] uppercase" style={{ color: C.muted }}>
                  ← {t("guide.prev")}
                </p>
                <p className="mt-1 text-[0.74rem]" style={{ color: C.ink }}>
                  {prev.title}
                </p>
              </button>
            ) : (
              <span />
            )}
            {next && (
              <button
                onClick={() => select(next.id)}
                className="text-right rounded-xl px-4 py-3"
                style={{ border: `0.5px solid ${C.line}` }}
              >
                <p className="text-[0.55rem] tracking-[0.14em] uppercase" style={{ color: C.muted }}>
                  {t("guide.next")} →
                </p>
                <p className="mt-1 text-[0.74rem]" style={{ color: C.ink }}>
                  {next.title}
                </p>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
