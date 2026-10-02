import { AdjustmentType, priceAdjustmentItem } from '@/src/models/priceAdjustment'

export const ADJUSTMENT_LABEL: Record<AdjustmentType, string> = {
  FIXED_PRICE: 'Harga tetap',
  PERCENTAGE: 'Persen dari harga proposal',
  FIXED_AMOUNT: 'Tambah / kurang nominal',
}

export const STATUS_STYLE: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

export const formatRp = (v: number) => 'Rp ' + v.toLocaleString('id-ID')

export const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

export function describeChange(adjustment: AdjustmentType, value: number) {
  if (adjustment === 'FIXED_PRICE') return `Jadi ${formatRp(value)}`
  if (adjustment === 'PERCENTAGE') return `${value > 0 ? '+' : ''}${value}%`
  return `${value > 0 ? '+' : '-'}${formatRp(Math.abs(value))}`
}

// "Deluxe: semua kamar · +10%" / "Suite: 301, 302 · Jadi Rp 1.500.000"
export function groupItems(items: priceAdjustmentItem[]) {
  const groups = new Map<string, { label: string; rooms: string[]; change: string }>()
  for (const item of items) {
    const change = describeChange(item.adjustment, item.value)
    const key = `${item.roomTypeId}|${item.roomId ? 'room' : 'all'}|${change}`
    if (!groups.has(key)) {
      groups.set(key, { label: item.roomType.name ?? item.roomTypeId, rooms: [], change })
    }
    if (item.room) groups.get(key)!.rooms.push(item.room.number)
  }
  return Array.from(groups.values()).map((g) => ({
    ...g,
    target: g.rooms.length ? `kamar ${g.rooms.join(', ')}` : 'semua kamar',
  }))
}
