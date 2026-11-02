// QRIS per provider — masing-masing bisa on/off sendiri di config panel (scope BOOKING).
// `value` = paymentMethod yang dikirim ke BE.
export type QrisProvider = 'qris' | 'qris_dpay'

export const QRIS_PROVIDERS: { value: QrisProvider; name: string; logo: string }[] = [
  { value: 'qris', name: 'Midtrans', logo: 'MID' },
  { value: 'qris_dpay', name: 'Duit', logo: 'DUIT' },
]

export const DPAY_SANDBOX_SIMULATOR_URL = 'https://dcor-duit.yaaqin.xyz/dpay/sandbox'
