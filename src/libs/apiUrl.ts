// Host BE tanpa prefix — dipakai Socket.IO (gateway tidak kena global prefix).
export const API_HOST = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://mbsc-be.yaaqin.xyz'

// Semua REST endpoint BE ada di bawah /api/v1
export const API_BASE_URL = `${API_HOST}/api/v1`
