"use client";

import { useState, useMemo } from "react";
import { menuRestoPublicState } from "@/src/models/public/menuResto/list";
import { ShoppingCart, Search, Minus, Plus, X } from "lucide-react";
import { useMenuRestoPublicList } from "@/src/hooks/query/restaurant/restoDashboard/menu/publicList";
import { useCartStore } from "@/src/stores/restaurant/cartStore";

// ─── Palette (ngikutin room map) ──────────────────────────────
const C = {
  primary: "#0f172a",
  primaryHover: "#334155",
  accent: "#3b82f6",
  accentBg: "#eff6ff",
  accentBorder: "#bfdbfe",
  accentText: "#1e3a8a",
  bg: "#f8fafc",
  surface: "#ffffff",
  border: "#e2e8f0",
  muted: "#94a3b8",
  subtle: "#64748b",
  danger: "#ef4444",
  dangerBg: "#fef2f2",
};

export default function FoodPage() {
  const { data, isLoading } = useMenuRestoPublicList();
  const { items, addItem, removeItem, updateQty, totalItems, totalPrice } = useCartStore();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedResto, setSelectedResto] = useState("ALL");
  const [cartOpen, setCartOpen] = useState(false);

  const products = data?.data ?? [];

  const categories = useMemo(() => {
    const cats = products.map((p) => ({ id: p.category.id, name: p.category.name }));
    return [{ id: "ALL", name: "Semua" }, ...Array.from(new Map(cats.map((c) => [c.id, c])).values())];
  }, [products]);

  const restos = useMemo(() => {
    const r = products.map((p) => ({
      id: p.restaurantSite.id,
      name: p.restaurantSite.restaurant.name,
    }));
    return [{ id: "ALL", name: "Semua Resto" }, ...Array.from(new Map(r.map((x) => [x.id, x])).values())];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === "ALL" || p.category.id === selectedCategory;
      const matchResto = selectedResto === "ALL" || p.restaurantSite.id === selectedResto;
      return matchSearch && matchCat && matchResto;
    });
  }, [products, search, selectedCategory, selectedResto]);

  const getCartItem = (id: string) => items.find((i) => i.id === id);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price);

  if (isLoading) return <FoodSkeleton />;

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: C.bg, minHeight: "100vh" }}>

      {/* ── Sticky Header ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 30,
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
      }}>
        {/* Top bar */}
        <div style={{
          maxWidth: 896, margin: "0 auto", padding: "12px 16px",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <h1 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: C.primary, whiteSpace: "nowrap" }}>
            Food Menu
          </h1>

          {/* Search */}
          <div style={{ flex: 1, position: "relative" }}>
            <Search style={{
              position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
              width: 15, height: 15, color: C.muted,
            }} />
            <input
              type="text"
              placeholder="Cari makanan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", paddingLeft: 32, paddingRight: 14,
                paddingTop: 8, paddingBottom: 8,
                fontSize: 13, borderRadius: 999,
                border: `1.5px solid ${C.border}`,
                outline: "none", color: C.primary,
                boxSizing: "border-box",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = C.accent)}
              onBlur={e => (e.currentTarget.style.borderColor = C.border)}
            />
          </div>

          {/* Cart button */}
          <button
            onClick={() => setCartOpen(true)}
            style={{
              position: "relative", padding: 9,
              background: C.primary, color: "#fff",
              border: "none", borderRadius: 999, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShoppingCart style={{ width: 18, height: 18 }} />
            {totalItems() > 0 && (
              <span style={{
                position: "absolute", top: -4, right: -4,
                background: C.accent, color: "#fff",
                fontSize: 10, fontWeight: 800,
                borderRadius: 999, width: 18, height: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {totalItems()}
              </span>
            )}
          </button>
        </div>

        {/* Resto filter */}
        <div style={{
          maxWidth: 896, margin: "0 auto", padding: "0 16px 10px",
          display: "flex", gap: 6, overflowX: "auto",
        }}>
          {restos.map((r) => (
            <FilterPill
              key={r.id}
              label={r.name}
              active={selectedResto === r.id}
              variant="primary"
              onClick={() => setSelectedResto(r.id)}
            />
          ))}
        </div>

        {/* Category filter */}
        <div style={{
          maxWidth: 896, margin: "0 auto", padding: "0 16px 12px",
          display: "flex", gap: 6, overflowX: "auto",
        }}>
          {categories.map((c) => (
            <FilterPill
              key={c.id}
              label={c.name}
              active={selectedCategory === c.id}
              variant="accent"
              onClick={() => setSelectedCategory(c.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div style={{ maxWidth: 896, margin: "0 auto", padding: "16px 16px 100px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 80, color: C.muted, fontSize: 14 }}>
            Produk tidak ditemukan
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 12,
          }}>
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                cartItem={getCartItem(product.id)}
                onAdd={() => addItem(product)}
                onUpdateQty={(qty) => updateQty(product.id, qty)}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Cart Drawer ── */}
      {cartOpen && (
        <CartDrawer
          items={items}
          totalPrice={totalPrice()}
          onClose={() => setCartOpen(false)}
          onUpdateQty={updateQty}
          onRemove={removeItem}
          formatPrice={formatPrice}
        />
      )}

      {/* ── Sticky Bottom Bar ── */}
      {totalItems() > 0 && !cartOpen && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 20, padding: "12px 16px" }}>
          <div style={{ maxWidth: 896, margin: "0 auto" }}>
            <button
              onClick={() => setCartOpen(true)}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                justifyContent: "space-between",
                background: C.primary, color: "#fff",
                border: "none", borderRadius: 14,
                padding: "13px 20px", cursor: "pointer",
                boxShadow: "0 4px 20px rgba(15,23,42,0.3)",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = C.primaryHover)}
              onMouseLeave={e => (e.currentTarget.style.background = C.primary)}
            >
              <span style={{
                background: C.accent, borderRadius: 8,
                padding: "2px 10px", fontSize: 12, fontWeight: 800,
              }}>
                {totalItems()} item
              </span>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Lihat Keranjang</span>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{formatPrice(totalPrice())}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Filter Pill ──────────────────────────────────────────────────────────────

function FilterPill({
  label, active, variant, onClick,
}: {
  label: string;
  active: boolean;
  variant: "primary" | "accent";
  onClick: () => void;
}) {
  const activeBg = variant === "primary" ? C.primary : C.accentBg;
  const activeColor = variant === "primary" ? "#fff" : C.accentText;
  const activeBorder = variant === "primary" ? C.primary : C.accent;

  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0, padding: "5px 14px", borderRadius: 999,
        fontSize: 12, fontWeight: 600, cursor: "pointer",
        border: `1.5px solid ${active ? activeBorder : C.border}`,
        background: active ? activeBg : C.surface,
        color: active ? activeColor : C.subtle,
        transition: "all 0.12s ease",
      }}
    >
      {label}
    </button>
  );
}

// ── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product, cartItem, onAdd, onUpdateQty, formatPrice,
}: {
  product: menuRestoPublicState;
  cartItem: ReturnType<typeof useCartStore.getState>["items"][0] | undefined;
  onAdd: () => void;
  onUpdateQty: (qty: number) => void;
  formatPrice: (n: number) => string;
}) {
  const now = new Date();
  const activeDiscount = product.discountRules.find((d) => {
    const start = d.startDate ? new Date(d.startDate) : null;
    const end = d.endDate ? new Date(d.endDate) : null;
    if (start && now < start) return false;
    if (end && now > end) return false;
    return true;
  });

  const finalPrice = activeDiscount
    ? activeDiscount.type === "FIXED_PRICE"
      ? activeDiscount.value
      : product.basePrice - (product.basePrice * activeDiscount.value) / 100
    : product.basePrice;

  return (
    <div style={{
      background: C.surface, borderRadius: 14,
      border: `1px solid ${C.border}`,
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      overflow: "hidden", display: "flex", flexDirection: "column",
      transition: "box-shadow 0.15s ease",
    }}>
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "1/1", background: C.bg }}>
        {product.images[0] ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, color: C.muted,
          }}>
            🍽️
          </div>
        )}
        {activeDiscount && (
          <span style={{
            position: "absolute", top: 8, left: 8,
            background: C.accent, color: "#fff",
            fontSize: 10, fontWeight: 800,
            borderRadius: 6, padding: "2px 7px",
          }}>
            {activeDiscount.type === "PERCENTAGE" ? `${activeDiscount.value}%` : "PROMO"}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", flex: 1, gap: 2 }}>
        <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: C.accent }}>
          {product.restaurantSite.restaurant.name}
        </p>
        <p style={{
          margin: 0, fontSize: 13, fontWeight: 700, color: C.primary,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {product.name}
        </p>
        <p style={{ margin: 0, fontSize: 10, color: C.muted }}>{product.category.name}</p>

        {/* Price + Qty */}
        <div style={{ marginTop: "auto", paddingTop: 10, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            {activeDiscount && (
              <p style={{ margin: 0, fontSize: 10, color: C.muted, textDecoration: "line-through" }}>
                {formatPrice(product.basePrice)}
              </p>
            )}
            <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: C.primary }}>
              {formatPrice(finalPrice)}
            </p>
          </div>

          {!cartItem ? (
            <button
              onClick={onAdd}
              style={{
                background: C.primary, color: "#fff",
                border: "none", borderRadius: 999,
                width: 30, height: 30,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = C.primaryHover)}
              onMouseLeave={e => (e.currentTarget.style.background = C.primary)}
            >
              <Plus style={{ width: 14, height: 14 }} />
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <QtyBtn onClick={() => onUpdateQty(cartItem.quantity - 1)}>
                <Minus style={{ width: 11, height: 11 }} />
              </QtyBtn>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.primary, minWidth: 16, textAlign: "center" }}>
                {cartItem.quantity}
              </span>
              <QtyBtn filled onClick={() => onUpdateQty(cartItem.quantity + 1)}>
                <Plus style={{ width: 11, height: 11 }} />
              </QtyBtn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Qty Button ───────────────────────────────────────────────────────────────

function QtyBtn({ onClick, filled, children }: { onClick: () => void; filled?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 26, height: 26, borderRadius: 999,
        border: `1.5px solid ${C.accentBorder}`,
        background: filled ? C.accent : C.accentBg,
        color: filled ? "#fff" : C.accentText,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

// ── Cart Drawer ──────────────────────────────────────────────────────────────

function CartDrawer({
  items, totalPrice, onClose, onUpdateQty, onRemove, formatPrice,
}: {
  items: ReturnType<typeof useCartStore.getState>["items"];
  totalPrice: number;
  onClose: () => void;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  formatPrice: (n: number) => string;
}) {
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", zIndex: 40 }}
      />
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        background: C.surface, borderRadius: "24px 24px 0 0",
        maxHeight: "80vh", display: "flex", flexDirection: "column",
        boxShadow: "0 -8px 40px rgba(15,23,42,0.15)",
      }}>
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: C.border }} />
        </div>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 20px 12px", borderBottom: `1px solid ${C.border}`,
        }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: C.primary }}>Keranjang</h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
          >
            <X style={{ width: 18, height: 18, color: C.muted }} />
          </button>
        </div>

        {/* Items */}
        <div style={{ overflowY: "auto", flex: 1, padding: "12px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item) => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {item.image && (
                <img
                  src={item.image} alt={item.name}
                  style={{ width: 52, height: 52, borderRadius: 10, objectFit: "cover", flexShrink: 0 }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.primary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.name}
                </p>
                <p style={{ margin: "1px 0 0", fontSize: 11, color: C.muted }}>{item.restaurantName}</p>
                <p style={{ margin: "3px 0 0", fontSize: 13, fontWeight: 800, color: C.accent }}>
                  {formatPrice(item.finalPrice)}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                <QtyBtn onClick={() => onUpdateQty(item.id, item.quantity - 1)}>
                  <Minus style={{ width: 11, height: 11 }} />
                </QtyBtn>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.primary, minWidth: 20, textAlign: "center" }}>
                  {item.quantity}
                </span>
                <QtyBtn filled onClick={() => onUpdateQty(item.id, item.quantity + 1)}>
                  <Plus style={{ width: 11, height: 11 }} />
                </QtyBtn>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 20px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: C.subtle }}>Total</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: C.primary }}>{formatPrice(totalPrice)}</span>
          </div>
          <button
            style={{
              width: "100%", padding: "13px 0", borderRadius: 12,
              background: C.primary, color: "#fff",
              border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = C.primaryHover)}
            onMouseLeave={e => (e.currentTarget.style.background = C.primary)}
          >
            Lanjut ke Pembayaran →
          </button>
        </div>
      </div>
    </>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function FoodSkeleton() {
  return (
    <div style={{ maxWidth: 896, margin: "0 auto", padding: "16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}` }}>
          <div style={{ aspectRatio: "1/1", background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
          <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ height: 10, background: "#f1f5f9", borderRadius: 4, width: "50%", animation: "shimmer 1.5s infinite" }} />
            <div style={{ height: 13, background: "#f1f5f9", borderRadius: 4, animation: "shimmer 1.5s infinite" }} />
            <div style={{ height: 10, background: "#f1f5f9", borderRadius: 4, width: "35%", animation: "shimmer 1.5s infinite" }} />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}