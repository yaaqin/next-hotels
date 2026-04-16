"use client";

import { Guideline, simpleGuideline } from "@/src/constans/guide";
import { useState, useEffect, useRef } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRoots(items: Guideline[], role: "admin" | "user") {
  return items.filter((g) => g.for.includes(role) && !g.parentId);
}

function getChildren(items: Guideline[], parentId: string) {
  return items.filter((g) => g.parentId === parentId);
}

function isAncestorOfSelected(
  items: Guideline[],
  itemId: string,
  selectedId: string
): boolean {
  const children = getChildren(items, itemId);
  return children.some(
    (c) => c.id === selectedId || isAncestorOfSelected(items, c.id, selectedId)
  );
}

// ─── Sidebar Item (with dropdown) ─────────────────────────────────────────────

function SidebarItem({
  item,
  allItems,
  selected,
  onSelect,
  depth = 0,
}: {
  item: Guideline;
  allItems: Guideline[];
  selected: Guideline;
  onSelect: (g: Guideline) => void;
  depth?: number;
}) {
  const children = getChildren(allItems, item.id);
  const isSelected = selected.id === item.id;
  const hasChildren = children.length > 0;
  const isActive = isSelected || isAncestorOfSelected(allItems, item.id, selected.id);

  // Auto-expand if this item is ancestor of selected
  const [open, setOpen] = useState(isActive);

  // Sync open state when selected changes from outside
  useEffect(() => {
    if (isActive) setOpen(true);
  }, [isActive]);

  const handleClick = () => {
    if (hasChildren) {
      setOpen((prev) => !prev);
      // Also select the parent item itself so content shows
      onSelect(item);
    } else {
      onSelect(item);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="w-full text-left transition-all duration-200"
        style={{
          paddingLeft: depth === 0 ? "0.75rem" : "1.5rem",
          paddingRight: "0.75rem",
          paddingTop: "0.45rem",
          paddingBottom: "0.45rem",
          borderRadius: 10,
          fontSize: depth === 0 ? "0.72rem" : "0.67rem",
          letterSpacing: depth === 0 ? "0.05em" : "0.04em",
          fontWeight: 400,
          fontFamily: "'Montserrat', sans-serif",
          background: isSelected ? "#DDE8F5" : "transparent",
          color: isSelected ? "#0A1828" : depth === 0 ? "#2C4E72" : "#5B90C9",
          border: isSelected
            ? "0.5px solid #1A56A0"
            : "0.5px solid transparent",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* Indent line for children */}
        {depth > 0 && (
          <span
            style={{
              width: 14,
              height: 1,
              background: "#B5CDE8",
              opacity: 0.7,
              flexShrink: 0,
            }}
          />
        )}

        <span style={{ flex: 1 }}>{item.name}</span>

        {/* Dropdown chevron */}
        {hasChildren && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "transform 0.2s ease",
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
              color: isActive ? "#1A56A0" : "#B5CDE8",
            }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path
                d="M2.5 1.5L5.5 4L2.5 6.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </button>

      {/* Children — animated dropdown */}
      {hasChildren && (
        <div
          style={{
            marginLeft: "0.75rem",
            borderLeft: "1px solid #B5CDE8",
            paddingLeft: 4,
            opacity: open ? 0.9 : 0,
            maxHeight: open ? 1000 : 0,
            overflow: "hidden",
            transition: "max-height 0.25s ease, opacity 0.2s ease",
            marginTop: open ? 2 : 0,
            marginBottom: open ? 2 : 0,
          }}
        >
          {children.map((child) => (
            <SidebarItem
              key={child.id}
              item={child}
              allItems={allItems}
              selected={selected}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sidebar Content ──────────────────────────────────────────────────────────

function SidebarContent({
  selected,
  onSelect,
  onClose,
}: {
  selected: Guideline;
  onSelect: (g: Guideline) => void;
  onClose?: () => void;
}) {
  const adminRoots = getRoots(simpleGuideline, "admin");
  const userRoots = getRoots(simpleGuideline, "user");

  return (
    <>
      {/* Header */}
      <div
        className="px-4 py-5 shrink-0"
        style={{ borderBottom: "0.5px solid #B5CDE8" }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p
              className="text-[0.5rem] tracking-[0.2em] uppercase mb-1"
              style={{ color: "#1A56A0" }}
            >
              Marina by Sand
            </p>
            <h1
              className="font-light leading-tight"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.3rem",
                color: "#0A1828",
              }}
            >
              Simple Guideline
            </h1>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="md:hidden flex items-center justify-center rounded-lg mt-0.5 transition-colors"
            style={{
              width: 28,
              height: 28,
              background: "transparent",
              border: "0.5px solid #B5CDE8",
              color: "#5B90C9",
              flexShrink: 0,
            }}
            aria-label="Close menu"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable nav */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {/* User group */}
        {userRoots.length > 0 && (
          <div>
            <p
              className="text-[0.5rem] tracking-[0.18em] uppercase mb-2 px-1"
              style={{ color: "#5B90C9" }}
            >
              User
            </p>
            <div className="space-y-0.5">
              {userRoots.map((item) => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  allItems={simpleGuideline}
                  selected={selected}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        {adminRoots.length > 0 && userRoots.length > 0 && (
          <div style={{ height: 1, background: "#B5CDE8", opacity: 0.5 }} />
        )}

        {/* Admin group */}
        {adminRoots.length > 0 && (
          <div>
            <p
              className="text-[0.5rem] tracking-[0.18em] uppercase mb-2 px-1"
              style={{ color: "#5B90C9" }}
            >
              Admin
            </p>
            <div className="space-y-0.5">
              {adminRoots.map((item) => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  allItems={simpleGuideline}
                  selected={selected}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SimpleGuideline() {
  const firstWithGuide =
    simpleGuideline.find((g) => g.guide.length > 0) ?? simpleGuideline[1];
  const [selected, setSelected] = useState<Guideline>(firstWithGuide);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Auto-close sidebar on mobile after selecting
  const handleSelect = (g: Guideline) => {
    setSelected(g);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  // Breadcrumb
  const parent = selected.parentId
    ? simpleGuideline.find((g) => g.id === selected.parentId)
    : null;

  return (
    <div
      className="flex h-screen p-4 gap-3 relative"
      style={{ background: "#EEF3FA", fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* ── MOBILE OVERLAY ── */}
      {sidebarOpen && (
        <div
          ref={overlayRef}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 md:hidden"
          style={{ background: "rgba(10, 24, 40, 0.35)", backdropFilter: "blur(2px)" }}
        />
      )}

      {/* ── LEFT SIDEBAR — desktop always visible, mobile drawer ── */}
      <div
        className="flex flex-col shrink-0 rounded-2xl overflow-hidden
                   fixed md:static inset-y-4 left-4 z-30
                   transition-transform duration-300 ease-in-out
                   md:translate-x-0"
        style={{
          width: 230,
          background: "#DDE8F5",
          border: "0.5px solid #B5CDE8",
          ...(isMobile && { transform: sidebarOpen ? "translateX(0)" : "translateX(calc(-100% - 2rem))" }),
        }}
      >
        <SidebarContent
          selected={selected}
          onSelect={handleSelect}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* ── MOBILE TOGGLE BUTTON ── */}
      <button
        onClick={() => setSidebarOpen((prev) => !prev)}
        className="fixed bottom-5 left-5 z-40 flex items-center justify-center rounded-full shadow-lg md:hidden"
        style={{
          width: 44,
          height: 44,
          background: "#1A56A0",
          border: "0.5px solid #2C6EC7",
          color: "#EEF3FA",
        }}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? (
          // X icon
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 3L13 13M13 3L3 13"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          // Hamburger icon
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 4.5H14M2 8H14M2 11.5H14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      {/* ── RIGHT CONTENT ── */}
      <div
        className="flex-1 rounded-2xl overflow-auto"
        style={{
          background: "#EEF3FA",
          border: "0.5px solid #B5CDE8",
          // On mobile: full width since sidebar is overlayed
        }}
      >
        <div className="px-8 py-7 max-w-2xl">
          {/* Breadcrumb */}
          {parent && (
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => handleSelect(parent)}
                className="text-[0.58rem] tracking-[0.12em] uppercase transition-colors"
                style={{ color: "#5B90C9" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#1A56A0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#5B90C9")}
              >
                {parent.name}
              </button>
              <span style={{ color: "#B5CDE8", fontSize: "0.6rem" }}>›</span>
              <span
                className="text-[0.58rem] tracking-[0.12em] uppercase"
                style={{ color: "#2C4E72" }}
              >
                {selected.name}
              </span>
            </div>
          )}

          {/* Title */}
          <div className="mb-6">
            <h2
              className="font-light leading-tight"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.8rem",
                color: "#0A1828",
              }}
            >
              {selected.name}
            </h2>
            <div
              className="mt-2"
              style={{
                width: 32,
                height: 1,
                background: "#1A56A0",
                opacity: 0.4,
              }}
            />
          </div>

          {/* Empty state */}
          {selected.guide.length === 0 && (
            <div
              className="rounded-xl px-5 py-6 text-[0.7rem] leading-relaxed"
              style={{
                background: "#DDE8F5",
                color: "#5B90C9",
                border: "0.5px solid #B5CDE8",
              }}
            >
              Pilih sub-menu di sebelah kiri untuk melihat panduan.
            </div>
          )}

          {/* Guide content */}
          <div className="space-y-5">
            {selected.guide.map((item, idx) => {
              if (item.type === "list") {
                return (
                  <div key={idx} className="space-y-2">
                    {(item.content as string[]).map((text, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div
                          className="shrink-0 flex items-center justify-center rounded-lg"
                          style={{
                            width: 28,
                            height: 28,
                            background: "#DDE8F5",
                            border: "0.5px solid #B5CDE8",
                            fontSize: "0.6rem",
                            color: "#1A56A0",
                            fontWeight: 500,
                            letterSpacing: "0.05em",
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <p
                          className="pt-1 leading-relaxed"
                          style={{ fontSize: "0.78rem", color: "#2C4E72" }}
                        >
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>
                );
              }

              if (item.type === "note") {
                return (
                  <div
                    key={idx}
                    className="flex gap-3 rounded-xl px-5 py-4"
                    style={{
                      background: "#0A1E38",
                      border: "0.5px solid #163356",
                    }}
                  >
                    <div
                      className="shrink-0 mt-0.5"
                      style={{
                        width: 4,
                        borderRadius: 4,
                        background: "#1A56A0",
                        minHeight: 16,
                      }}
                    />
                    <p
                      className="leading-relaxed"
                      style={{ fontSize: "0.73rem", color: "#6A9EC5" }}
                    >
                      {item.content as string}
                    </p>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}