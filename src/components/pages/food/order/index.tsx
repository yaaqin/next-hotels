'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Loader2, ShoppingBag, Copy, Check, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useFoodOrderDetail } from '@/src/hooks/query/publicFood/orderDetail';
import { DPAY_SANDBOX_SIMULATOR_URL } from '@/src/constans/payment';
import type { FoodOrderDetail } from '@/src/services/publicFood/orderDetail';

const C = {
  primary: '#0f172a',
  accent: '#3b82f6',
  accentBg: '#eff6ff',
  accentBorder: '#bfdbfe',
  accentText: '#1e3a8a',
  bg: '#f8fafc',
  surface: '#ffffff',
  border: '#e2e8f0',
  muted: '#94a3b8',
  subtle: '#64748b',
  success: '#16a34a',
  successBg: '#f0fdf4',
  danger: '#ef4444',
  dangerBg: '#fef2f2',
  warn: '#b45309',
  warnBg: '#fffbeb',
};

const formatPrice = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

// Halaman setelah checkout food: instruksi bayar DPAY (QR / VA) + status order.
// Order Midtrans juga mendarat di sini (callback finish Snap).
export default function FoodOrderPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { order, isLoading, error } = useFoodOrderDetail(id);

  if (isLoading) {
    return (
      <Centered>
        <Loader2 style={{ width: 22, height: 22, color: C.muted, animation: 'spin 1s linear infinite' }} />
      </Centered>
    );
  }

  if (error || !order) {
    return (
      <Centered>
        <p style={{ color: C.muted, fontSize: 14 }}>Pesanan tidak ditemukan</p>
        <button onClick={() => router.push('/food')} style={linkBtn}>Kembali ke menu</button>
      </Centered>
    );
  }

  const payment = order.payment;
  const isDpay = payment?.method === 'QRIS_DPAY' || payment?.method === 'VA_DPAY';
  const waiting = order.status === 'PENDING' && payment?.status === 'PENDING';

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: C.bg, minHeight: '100vh' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 30, background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/food')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
            <ChevronLeft style={{ width: 20, height: 20, color: C.primary }} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: C.primary }}>Pesanan</h1>
            <p style={{ margin: 0, fontSize: 11, color: C.muted }}>
              {order.orderCode} · {order.restaurantSite.restaurant.name}
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '16px 16px 40px' }}>
        <StatusBanner status={order.status} paymentStatus={payment?.status} />

        {waiting && isDpay && payment && <DpayPaymentCard payment={payment} total={order.totalAmount} />}

        {waiting && !isDpay && (
          <Card>
            <p style={{ margin: 0, fontSize: 13, color: C.subtle, lineHeight: 1.6 }}>
              Menunggu konfirmasi pembayaran dari Midtrans. Halaman ini akan diperbarui otomatis setelah pembayaran diterima.
            </p>
          </Card>
        )}

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <ShoppingBag style={{ width: 14, height: 14, color: C.accent }} />
            <p style={sectionTitle}>Pesanan</p>
          </div>
          {order.items.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: C.primary }}>{item.quantity}× {item.productName}</span>
              <span style={{ fontSize: 13, color: C.subtle }}>{formatPrice(item.subtotal)}</span>
            </div>
          ))}
          <div style={{ height: 1, background: C.border, margin: '10px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>Total</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: C.primary }}>{formatPrice(order.totalAmount)}</span>
          </div>
          {order.note && <p style={{ margin: '10px 0 0', fontSize: 12, color: C.muted }}>{order.note}</p>}
        </Card>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Status ───────────────────────────────────────────────────────────────────

function StatusBanner({ status, paymentStatus }: { status: string; paymentStatus?: string }) {
  if (status === 'PENDING') {
    return (
      <Banner bg={C.warnBg} color={C.warn} icon={<Clock style={{ width: 16, height: 16 }} />}>
        Menunggu pembayaran
      </Banner>
    );
  }
  if (status === 'CANCELLED') {
    return (
      <Banner bg={C.dangerBg} color={C.danger} icon={<XCircle style={{ width: 16, height: 16 }} />}>
        {paymentStatus === 'EXPIRED' ? 'Waktu pembayaran habis, pesanan dibatalkan' : 'Pesanan dibatalkan'}
      </Banner>
    );
  }
  const label: Record<string, string> = {
    CONFIRMED: 'Pembayaran diterima, pesanan dikonfirmasi',
    IN_PROGRESS: 'Pesanan sedang disiapkan',
    READY: 'Pesanan siap',
    COMPLETED: 'Pesanan selesai',
  };
  return (
    <Banner bg={C.successBg} color={C.success} icon={<CheckCircle2 style={{ width: 16, height: 16 }} />}>
      {label[status] ?? status}
    </Banner>
  );
}

// ── Instruksi bayar DPAY ─────────────────────────────────────────────────────

function DpayPaymentCard({ payment, total }: { payment: NonNullable<FoodOrderDetail['payment']>; total: number }) {
  const isQris = payment.method === 'QRIS_DPAY';
  const remaining = useCountdown(payment.expiredAt);

  return (
    <Card>
      <p style={sectionTitle}>{isQris ? 'Scan QRIS Duit' : 'Transfer ke Duit Virtual Account'}</p>

      {isQris ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
          {payment.qrisUrl ? (
            <img src={payment.qrisUrl} alt="QRIS" style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 8, border: `1px solid ${C.border}` }} />
          ) : (
            <p style={{ fontSize: 12, color: C.muted }}>QR Code tidak tersedia</p>
          )}
        </div>
      ) : (
        <CopyField label="Nomor Virtual Account" value={payment.vaNumber ?? '—'} mono />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
        <span style={{ fontSize: 13, color: C.subtle }}>Total bayar</span>
        <span style={{ fontSize: 18, fontWeight: 800, color: C.success }}>{formatPrice(total)}</span>
      </div>

      {remaining !== null && (
        <p style={{ margin: '10px 0 0', fontSize: 12, color: remaining > 0 ? C.warn : C.danger }}>
          {remaining > 0 ? `Bayar dalam ${formatRemaining(remaining)}` : 'Waktu pembayaran habis'}
        </p>
      )}

      {/* Sandbox: tagihan dibayar lewat simulator DPAY */}
      <div style={{ marginTop: 14, padding: '10px 12px', background: C.accentBg, border: `1px solid ${C.accentBorder}`, borderRadius: 10 }}>
        <p style={{ margin: 0, fontSize: 12, color: C.accentText, lineHeight: 1.5 }}>
          {isQris
            ? 'Simulasi: buka simulator DPAY sandbox, pilih tab QRIS, lalu tempel URL gambar QRIS di bawah.'
            : 'Simulasi: buka simulator DPAY sandbox, pilih tab VA, lalu masukkan nomor Virtual Account di atas.'}
        </p>
        <a href={DPAY_SANDBOX_SIMULATOR_URL} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 700, color: C.accent }}>
          Buka simulator →
        </a>
      </div>
      {isQris && payment.qrisUrl && <CopyField label="URL gambar QRIS" value={payment.qrisUrl} />}
    </Card>
  );
}

function useCountdown(expiredAt: string | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!expiredAt) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [expiredAt]);
  if (!expiredAt) return null;
  return Math.max(0, Math.floor((new Date(expiredAt).getTime() - now) / 1000));
}

const formatRemaining = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

// ── Helpers ──────────────────────────────────────────────────────────────────

function CopyField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ marginTop: 12 }}>
      <p style={{ margin: '0 0 6px', fontSize: 11, color: C.muted }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10 }}>
        <span style={{
          flex: 1, minWidth: 0, wordBreak: 'break-all', color: C.primary,
          fontFamily: mono ? 'ui-monospace, monospace' : 'inherit',
          fontSize: mono ? 17 : 11, fontWeight: mono ? 800 : 400, letterSpacing: mono ? '0.08em' : 0,
        }}>
          {value}
        </span>
        <button onClick={copy} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: copied ? C.success : C.subtle }}>
          {copied ? <Check style={{ width: 16, height: 16 }} /> : <Copy style={{ width: 16, height: 16 }} />}
        </button>
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: '14px 16px', marginBottom: 12 }}>
      {children}
    </div>
  );
}

function Banner({ bg, color, icon, children }: { bg: string; color: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', background: bg, color, borderRadius: 12, marginBottom: 12, fontSize: 13, fontWeight: 700 }}>
      {icon}
      {children}
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      {children}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const sectionTitle: React.CSSProperties = {
  margin: 0, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em',
};

const linkBtn: React.CSSProperties = {
  color: C.accent, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
};
