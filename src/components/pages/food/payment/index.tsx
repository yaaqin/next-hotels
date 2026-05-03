'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ChevronLeft, Minus, Plus, MapPin, MessageSquare, Loader2, User, ShoppingBag } from 'lucide-react';
import { useSafeSession } from '@/src/hooks/custom/payment/useSafeSession';
import toast from 'react-hot-toast';
import { useCartStore } from '@/src/stores/restaurant/cartStore';
import { createFoodOrder } from '@/src/services/publicFood/createOrderFood';

const C = {
  primary: '#0f172a',
  primaryHover: '#334155',
  accent: '#3b82f6',
  accentBg: '#eff6ff',
  accentBorder: '#bfdbfe',
  accentText: '#1e3a8a',
  bg: '#f8fafc',
  surface: '#ffffff',
  border: '#e2e8f0',
  muted: '#94a3b8',
  subtle: '#64748b',
  danger: '#ef4444',
  dangerBg: '#fef2f2',
};

declare global {
  interface Window { snap: any; }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { session, isLoading, isAuthenticated, isUnauthenticated } = useSafeSession();
  const { items, updateQty, totalPrice, clearCart } = useCartStore();

  const [tableNote, setTableNote] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formatPrice = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  const restaurantSiteId = items[0]?.restaurantSiteId ?? '';
  const restaurantName = items[0]?.restaurantName ?? '';

  const tableNoteError = submitted && !tableNote.trim() ? 'Lokasi meja wajib diisi' : '';

  const handleCheckout = async () => {
    setSubmitted(true);
    if (!tableNote.trim() || items.length === 0) return;

    setLoading(true);
    try {
      const res = await createFoodOrder({
        restaurantSiteId,
        tableNote,
        note: orderNote || undefined,
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      });

      // Langsung buka Snap — user pilih payment method di sana
      window.snap.pay(res.data.snapToken, {
        onSuccess: () => {
          clearCart();
          router.push(`/food/order/${res.data.orderId}?status=success`);
        },
        onPending: () => {
          clearCart();
          router.push(`/food/order/${res.data.orderId}?status=pending`);
        },
        onError: () => {
          toast.error('Pembayaran gagal. Silakan coba lagi.');
          setLoading(false);
        },
        onClose: () => setLoading(false),
      });
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Terjadi kesalahan');
      setLoading(false);
    }
  };

  const canSubmit = isAuthenticated && !loading && !isLoading;

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: C.muted, fontSize: 14 }}>Keranjang kosong</p>
          <button onClick={() => router.push('/food')} style={{ marginTop: 12, color: C.accent, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
            Kembali ke menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <script
        type="text/javascript"
        src={`https://app${process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true' ? '' : '.sandbox'}.midtrans.com/snap/snap.js`}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        async
      />

      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: C.bg, minHeight: '100vh' }}>

        {/* ── Header ── */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 30,
          background: C.surface, borderBottom: `1px solid ${C.border}`,
          boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
        }}>
          <div style={{ maxWidth: 560, margin: '0 auto', padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
              <ChevronLeft style={{ width: 20, height: 20, color: C.primary }} />
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: C.primary }}>Checkout</h1>
              <p style={{ margin: 0, fontSize: 11, color: C.muted }}>{restaurantName}</p>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 560, margin: '0 auto', padding: '16px 16px 120px' }}>

          {/* ── 1. Info Akun ── */}
          <Section title="Pemesan" icon={<User style={{ width: 14, height: 14, color: C.accent }} />}>
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: C.border }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ height: 12, width: '40%', background: C.border, borderRadius: 4 }} />
                  <div style={{ height: 10, width: '60%', background: C.border, borderRadius: 4 }} />
                </div>
              </div>
            ) : isUnauthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: C.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User style={{ width: 20, height: 20, color: C.accent }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.primary }}>Login diperlukan</p>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: C.muted }}>Masuk dengan Google untuk melanjutkan pesanan</p>
                </div>
                <button
                  onClick={() => signIn('google')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 20px', background: C.surface,
                    border: `1.5px solid ${C.border}`, borderRadius: 12,
                    fontSize: 13, fontWeight: 600, color: C.primary, cursor: 'pointer',
                  }}
                >
                  <GoogleIcon />
                  Masuk dengan Google
                </button>
              </div>
            ) : session?.user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {session.user.image ? (
                  <img src={session.user.image} alt="" style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: C.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User style={{ width: 18, height: 18, color: C.accent }} />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.primary }}>{session.user.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: C.muted }}>{session.user.email}</p>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: C.accentText,
                  background: C.accentBg, border: `1px solid ${C.accentBorder}`,
                  borderRadius: 6, padding: '2px 8px', flexShrink: 0,
                }}>
                  ONLINE
                </span>
              </div>
            ) : null}
          </Section>

          {/* ── 2. Lokasi Meja ── */}
          <Section title="Lokasi Meja" icon={<MapPin style={{ width: 14, height: 14, color: C.accent }} />}>
            <div style={{ position: 'relative' }}>
              <MapPin style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: C.muted }} />
              <input
                type="text"
                placeholder="Contoh: Meja 3, Lantai 2 pojok kiri..."
                value={tableNote}
                onChange={(e) => setTableNote(e.target.value)}
                style={{
                  width: '100%', paddingLeft: 34, paddingRight: 14,
                  paddingTop: 10, paddingBottom: 10,
                  fontSize: 13, borderRadius: 10, boxSizing: 'border-box',
                  border: `1.5px solid ${tableNoteError ? C.danger : C.border}`,
                  outline: 'none', color: C.primary,
                }}
                onFocus={e => (e.currentTarget.style.borderColor = tableNoteError ? C.danger : C.accent)}
                onBlur={e => (e.currentTarget.style.borderColor = tableNoteError ? C.danger : C.border)}
              />
            </div>
            {tableNoteError && <ErrMsg msg={tableNoteError} />}
          </Section>

          {/* ── 3. Catatan ── */}
          <Section title="Catatan (opsional)" icon={<MessageSquare style={{ width: 14, height: 14, color: C.accent }} />}>
            <textarea
              placeholder="Alergi, permintaan khusus, dll..."
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              rows={3}
              style={{
                width: '100%', padding: '10px 14px',
                fontSize: 13, borderRadius: 10, boxSizing: 'border-box',
                border: `1.5px solid ${C.border}`,
                outline: 'none', color: C.primary, resize: 'none',
                fontFamily: 'inherit',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = C.accent)}
              onBlur={e => (e.currentTarget.style.borderColor = C.border)}
            />
          </Section>

          {/* ── 4. Review Pesanan ── */}
          <Section title="Pesanan" icon={<ShoppingBag style={{ width: 14, height: 14, color: C.accent }} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {item.image && (
                    <img src={item.image} alt={item.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, fontWeight: 700, color: C.accent }}>
                      {formatPrice(item.finalPrice)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <QtyBtn onClick={() => updateQty(item.id, item.quantity - 1)}>
                      <Minus style={{ width: 11, height: 11 }} />
                    </QtyBtn>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.primary, minWidth: 20, textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <QtyBtn filled onClick={() => updateQty(item.id, item.quantity + 1)}>
                      <Plus style={{ width: 11, height: 11 }} />
                    </QtyBtn>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.primary, minWidth: 64, textAlign: 'right' }}>
                    {formatPrice(item.finalPrice * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Divider + Summary inline di section pesanan */}
            <div style={{ height: 1, background: C.border, margin: '14px 0 10px' }} />
            <SummaryRow label="Subtotal" value={formatPrice(totalPrice())} />
            <SummaryRow label="Biaya layanan" value="Rp 0" muted />
            <div style={{ height: 1, background: C.border, margin: '8px 0' }} />
            <SummaryRow label="Total" value={formatPrice(totalPrice())} bold />
          </Section>

          {/* ── Info pembayaran ── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', background: C.accentBg,
            border: `1px solid ${C.accentBorder}`, borderRadius: 10,
          }}>
            <span style={{ fontSize: 16 }}>💳</span>
            <p style={{ margin: 0, fontSize: 12, color: C.accentText, lineHeight: 1.5 }}>
              Metode pembayaran (Transfer VA, QRIS, dll) dipilih di halaman berikutnya
            </p>
          </div>
        </div>

        {/* ── Sticky Bottom ── */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: C.surface, borderTop: `1px solid ${C.border}`,
          padding: '14px 16px', zIndex: 30,
        }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            {isUnauthenticated && (
              <p style={{ margin: '0 0 8px', fontSize: 11, color: C.muted, textAlign: 'center' }}>
                Login terlebih dahulu untuk melanjutkan
              </p>
            )}
            <button
              onClick={handleCheckout}
              disabled={!canSubmit}
              style={{
                width: '100%', padding: '14px 0', borderRadius: 12,
                background: canSubmit ? C.primary : C.border,
                color: canSubmit ? '#fff' : C.muted,
                border: 'none', fontSize: 14, fontWeight: 700,
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { if (canSubmit) e.currentTarget.style.background = C.primaryHover; }}
              onMouseLeave={e => { if (canSubmit) e.currentTarget.style.background = C.primary; }}
            >
              {loading ? (
                <>
                  <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                  Memproses...
                </>
              ) : isLoading ? (
                <>
                  <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                  Memuat sesi...
                </>
              ) : (
                `Lanjut Bayar ${formatPrice(totalPrice())} →`
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: '14px 16px', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
        {icon}
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {title}
        </p>
      </div>
      {children}
    </div>
  );
}

function SummaryRow({ label, value, muted, bold }: { label: string; value: string; muted?: boolean; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
      <span style={{ fontSize: 13, color: muted ? C.muted : C.subtle }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: bold ? 800 : 500, color: bold ? C.primary : C.subtle }}>{value}</span>
    </div>
  );
}

function ErrMsg({ msg }: { msg: string }) {
  return (
    <p style={{ margin: '5px 0 0', fontSize: 11, color: C.danger, display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.danger, display: 'inline-block', flexShrink: 0 }} />
      {msg}
    </p>
  );
}

function QtyBtn({ onClick, filled, children }: { onClick: () => void; filled?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      width: 26, height: 26, borderRadius: 999,
      border: `1.5px solid ${C.accentBorder}`,
      background: filled ? C.accent : C.accentBg,
      color: filled ? '#fff' : C.accentText,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', flexShrink: 0,
    }}>
      {children}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
      <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}