// Semua konfigurasi E2E dibaca dari .env / .env.local (lihat e2e/README.md)

export const BE_URL = process.env.BE_URL ?? 'http://localhost:9021'

// Password dev/staging semua akun admin disamakan (lihat doc/v2/24-akses-login)
export const ADMIN = {
  username: process.env.E2E_ADMIN_USERNAME ?? 'superadmin',
  password: process.env.E2E_ADMIN_PASSWORD ?? '@Hotel123',
}

export const RESTO_OWNER = {
  username: process.env.E2E_RESTO_OWNER_USERNAME ?? 'owner@sushijapan.com',
  password: process.env.E2E_RESTO_OWNER_PASSWORD ?? ADMIN.password,
}

// User publik (login Google). Tanpa E2E_USER_EMAIL, project "user" di-skip.
export const USER = {
  email: process.env.E2E_USER_EMAIL,
  googleId: process.env.E2E_USER_GOOGLE_ID ?? 'e2e-playwright',
  name: process.env.E2E_USER_NAME ?? 'E2E Playwright',
}

// Test yang membuat data (booking, VA Midtrans) ke DB bersama hanya jalan kalau diizinkan
export const ALLOW_WRITES = process.env.E2E_ALLOW_WRITES === '1'
