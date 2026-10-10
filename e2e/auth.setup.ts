import fs from 'node:fs'
import path from 'node:path'
import { test as setup, expect } from '@playwright/test'
import { encode } from 'next-auth/jwt'
import { ADMIN, BE_URL, USER } from './support/env'

const AUTH_DIR = path.join(__dirname, '.auth')
const ADMIN_STATE = path.join(AUTH_DIR, 'admin.json')
const USER_STATE = path.join(AUTH_DIR, 'user.json')

setup.beforeAll(() => fs.mkdirSync(AUTH_DIR, { recursive: true }))

// Admin: login lewat form, token disimpan di cookie access_token / refresh_token
setup('login admin', async ({ page }) => {
  await page.goto('/login')
  await page.locator('#username').fill(ADMIN.username)
  await page.locator('#password').fill(ADMIN.password)
  await page.locator('button[type="submit"]').click()
  await expect(page).toHaveURL(/\/(config-panel|dashboard)/)
  await page.context().storageState({ path: ADMIN_STATE })
})

// User publik: Google OAuth tidak bisa diotomasi, jadi token BE diambil langsung dari
// /auth/google lalu dibungkus jadi cookie session next-auth (isi sama dengan callback jwt).
setup('login user', async ({ request, context, baseURL }) => {
  if (!USER.email) {
    fs.writeFileSync(USER_STATE, JSON.stringify({ cookies: [], origins: [] }))
    setup.skip(true, 'E2E_USER_EMAIL belum di-set')
  }

  const secret = process.env.NEXTAUTH_SECRET
  expect(secret, 'NEXTAUTH_SECRET harus ada di .env').toBeTruthy()

  const res = await request.post(`${BE_URL}/api/v1/auth/google`, {
    data: { googleId: USER.googleId, email: USER.email, name: USER.name },
  })
  expect(res.ok(), `BE login gagal: ${res.status()}`).toBeTruthy()
  const { data } = await res.json()

  const sessionToken = await encode({
    secret: secret!,
    token: {
      sub: data.userId,
      name: USER.name,
      email: USER.email,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      backendUserId: data.userId,
      accessTokenExpiry: Date.now() + 4 * 60 * 1000,
    },
  })

  await context.addCookies([
    { name: 'next-auth.session-token', value: sessionToken, url: baseURL! },
    { name: 'userToken', value: data.accessToken, url: baseURL! },
  ])
  await context.storageState({ path: USER_STATE })
})
