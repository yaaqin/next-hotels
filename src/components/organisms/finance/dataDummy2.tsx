import { RoomType } from "@/src/models/finance/dashboard";

// ─── Cancellation by Room Type ─────────────────────────────────────────────
export interface CancellationStat {
  roomType: RoomType;
  cancelled: number;
  confirmedTotal: number;
  cancellationRate: number;
  color: string;
}

export const cancellationByPeriod: Record<string, CancellationStat[]> = {
  ytd: [
    { roomType: "Deluxe",      cancelled: 124, confirmedTotal: 1306, cancellationRate: 9.5,  color: "#185FA5" },
    { roomType: "Superior",    cancelled:  98, confirmedTotal: 1037, cancellationRate: 9.4,  color: "#0F6E56" },
    { roomType: "Suite",       cancelled:  41, confirmedTotal:  691, cancellationRate: 5.9,  color: "#B85C1C" },
    { roomType: "Standard",    cancelled:  87, confirmedTotal:  499, cancellationRate: 17.4, color: "#888780" },
    { roomType: "Family Room", cancelled:  53, confirmedTotal:  309, cancellationRate: 17.2, color: "#8B3A6E" },
  ],
  q1: [
    { roomType: "Deluxe",      cancelled: 28, confirmedTotal: 310, cancellationRate: 9.0,  color: "#185FA5" },
    { roomType: "Superior",    cancelled: 22, confirmedTotal: 248, cancellationRate: 8.9,  color: "#0F6E56" },
    { roomType: "Suite",       cancelled:  9, confirmedTotal: 162, cancellationRate: 5.6,  color: "#B85C1C" },
    { roomType: "Standard",    cancelled: 21, confirmedTotal: 119, cancellationRate: 17.6, color: "#888780" },
    { roomType: "Family Room", cancelled: 12, confirmedTotal:  74, cancellationRate: 16.2, color: "#8B3A6E" },
  ],
  q2: [
    { roomType: "Deluxe",      cancelled: 30, confirmedTotal: 312, cancellationRate: 9.6,  color: "#185FA5" },
    { roomType: "Superior",    cancelled: 24, confirmedTotal: 249, cancellationRate: 9.6,  color: "#0F6E56" },
    { roomType: "Suite",       cancelled:  9, confirmedTotal: 165, cancellationRate: 5.5,  color: "#B85C1C" },
    { roomType: "Standard",    cancelled: 22, confirmedTotal: 120, cancellationRate: 18.3, color: "#888780" },
    { roomType: "Family Room", cancelled: 13, confirmedTotal:  75, cancellationRate: 17.3, color: "#8B3A6E" },
  ],
  q3: [
    { roomType: "Deluxe",      cancelled: 31, confirmedTotal: 328, cancellationRate: 9.5,  color: "#185FA5" },
    { roomType: "Superior",    cancelled: 26, confirmedTotal: 261, cancellationRate: 10.0, color: "#0F6E56" },
    { roomType: "Suite",       cancelled: 11, confirmedTotal: 174, cancellationRate: 6.3,  color: "#B85C1C" },
    { roomType: "Standard",    cancelled: 22, confirmedTotal: 126, cancellationRate: 17.5, color: "#888780" },
    { roomType: "Family Room", cancelled: 14, confirmedTotal:  78, cancellationRate: 17.9, color: "#8B3A6E" },
  ],
  q4: [
    { roomType: "Deluxe",      cancelled: 35, confirmedTotal: 356, cancellationRate: 9.8,  color: "#185FA5" },
    { roomType: "Superior",    cancelled: 26, confirmedTotal: 279, cancellationRate: 9.3,  color: "#0F6E56" },
    { roomType: "Suite",       cancelled: 12, confirmedTotal: 190, cancellationRate: 6.3,  color: "#B85C1C" },
    { roomType: "Standard",    cancelled: 22, confirmedTotal: 134, cancellationRate: 16.4, color: "#888780" },
    { roomType: "Family Room", cancelled: 14, confirmedTotal:  82, cancellationRate: 17.1, color: "#8B3A6E" },
  ],
};

// ─── Revenue vs Credit/Refund ───────────────────────────────────────────────
export type MetricMode = "cancelled" | "paid";

export interface RevenueCreditMonth {
  month: string;
  shortMonth: string;
  revenue: number;
  refundCredit: number;       // refund yang jadi credit note
  cashRefund: number;         // refund tunai/transfer balik
  netRevenue: number;         // revenue - cashRefund
}

export const revenueCreditByPeriod: Record<string, RevenueCreditMonth[]> = {
  ytd: [
    { month: "January",   shortMonth: "Jan", revenue: 342_000_000, refundCredit:  8_200_000, cashRefund:  5_100_000, netRevenue: 336_900_000 },
    { month: "February",  shortMonth: "Feb", revenue: 298_500_000, refundCredit:  7_400_000, cashRefund:  4_200_000, netRevenue: 294_300_000 },
    { month: "March",     shortMonth: "Mar", revenue: 315_200_000, refundCredit:  9_100_000, cashRefund:  5_800_000, netRevenue: 309_400_000 },
    { month: "April",     shortMonth: "Apr", revenue: 287_400_000, refundCredit:  6_900_000, cashRefund:  4_100_000, netRevenue: 283_300_000 },
    { month: "May",       shortMonth: "May", revenue: 304_600_000, refundCredit:  7_800_000, cashRefund:  4_700_000, netRevenue: 299_900_000 },
    { month: "June",      shortMonth: "Jun", revenue: 321_800_000, refundCredit:  9_300_000, cashRefund:  5_200_000, netRevenue: 316_600_000 },
    { month: "July",      shortMonth: "Jul", revenue: 356_000_000, refundCredit: 10_400_000, cashRefund:  6_100_000, netRevenue: 349_900_000 },
    { month: "August",    shortMonth: "Aug", revenue: 389_500_000, refundCredit: 11_200_000, cashRefund:  6_800_000, netRevenue: 382_700_000 },
    { month: "September", shortMonth: "Sep", revenue: 334_200_000, refundCredit:  8_600_000, cashRefund:  5_300_000, netRevenue: 328_900_000 },
    { month: "October",   shortMonth: "Oct", revenue: 341_700_000, refundCredit:  8_900_000, cashRefund:  5_600_000, netRevenue: 336_100_000 },
    { month: "November",  shortMonth: "Nov", revenue: 358_300_000, refundCredit: 10_100_000, cashRefund:  6_200_000, netRevenue: 352_100_000 },
    { month: "December",  shortMonth: "Des", revenue: 512_400_000, refundCredit: 14_800_000, cashRefund:  8_900_000, netRevenue: 503_500_000 },
  ],
  q1: [
    { month: "January",  shortMonth: "Jan", revenue: 342_000_000, refundCredit:  8_200_000, cashRefund: 5_100_000, netRevenue: 336_900_000 },
    { month: "February", shortMonth: "Feb", revenue: 298_500_000, refundCredit:  7_400_000, cashRefund: 4_200_000, netRevenue: 294_300_000 },
    { month: "March",    shortMonth: "Mar", revenue: 315_200_000, refundCredit:  9_100_000, cashRefund: 5_800_000, netRevenue: 309_400_000 },
  ],
  q2: [
    { month: "April", shortMonth: "Apr", revenue: 287_400_000, refundCredit: 6_900_000, cashRefund: 4_100_000, netRevenue: 283_300_000 },
    { month: "May",   shortMonth: "May", revenue: 304_600_000, refundCredit: 7_800_000, cashRefund: 4_700_000, netRevenue: 299_900_000 },
    { month: "June",  shortMonth: "Jun", revenue: 321_800_000, refundCredit: 9_300_000, cashRefund: 5_200_000, netRevenue: 316_600_000 },
  ],
  q3: [
    { month: "July",      shortMonth: "Jul", revenue: 356_000_000, refundCredit: 10_400_000, cashRefund: 6_100_000, netRevenue: 349_900_000 },
    { month: "August",    shortMonth: "Aug", revenue: 389_500_000, refundCredit: 11_200_000, cashRefund: 6_800_000, netRevenue: 382_700_000 },
    { month: "September", shortMonth: "Sep", revenue: 334_200_000, refundCredit:  8_600_000, cashRefund: 5_300_000, netRevenue: 328_900_000 },
  ],
  q4: [
    { month: "October",  shortMonth: "Okt", revenue: 341_700_000, refundCredit:  8_900_000, cashRefund: 5_600_000, netRevenue: 336_100_000 },
    { month: "November", shortMonth: "Nov", revenue: 358_300_000, refundCredit: 10_100_000, cashRefund: 6_200_000, netRevenue: 352_100_000 },
    { month: "December", shortMonth: "Des", revenue: 512_400_000, refundCredit: 14_800_000, cashRefund: 8_900_000, netRevenue: 503_500_000 },
  ],
};

// Aggregated summary per period
export interface CreditSummary {
  totalRevenue: number;
  totalRefundCredit: number;
  totalCashRefund: number;
  totalNetRevenue: number;
  creditRatio: number;   // % of revenue that became credit
  refundRatio: number;   // % of revenue that was cash-refunded
}

export function getCreditSummary(period: string): CreditSummary {
  const data = revenueCreditByPeriod[period] ?? revenueCreditByPeriod.ytd;
  const totalRevenue      = data.reduce((s, d) => s + d.revenue, 0);
  const totalRefundCredit = data.reduce((s, d) => s + d.refundCredit, 0);
  const totalCashRefund   = data.reduce((s, d) => s + d.cashRefund, 0);
  const totalNetRevenue   = data.reduce((s, d) => s + d.netRevenue, 0);
  return {
    totalRevenue,
    totalRefundCredit,
    totalCashRefund,
    totalNetRevenue,
    creditRatio: +((totalRefundCredit / totalRevenue) * 100).toFixed(1),
    refundRatio: +((totalCashRefund   / totalRevenue) * 100).toFixed(1),
  };
}
