import { test, expect, type Page } from '@playwright/test'
import { ADMIN, RESTO_OWNER } from '../support/env'

async function login(page: Page, username: string, password: string) {
  await page.goto('/login')
  await page.locator('#username').fill(username)
  await page.locator('#password').fill(password)
  await page.locator('button[type="submit"]').click()
}

test.describe('Login admin', () => {
  test('form login tampil', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('#username')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('superadmin diarahkan ke /config-panel lalu bisa buka /dashboard', async ({ page }) => {
    await login(page, ADMIN.username, ADMIN.password)
    await expect(page).toHaveURL(/\/config-panel/)

    await page.locator('a[href="/dashboard"][title="Buka dashboard monitoring"]').click()
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('owner restoran diarahkan ke /restaurant', async ({ page }) => {
    await login(page, RESTO_OWNER.username, RESTO_OWNER.password)
    await expect(page).toHaveURL(/\/restaurant/)
  })

  test('kredensial salah tetap di /login dan tidak menyimpan token', async ({ page, context }) => {
    const loginRes = page.waitForResponse((res) => res.request().method() === 'POST' && res.url().endsWith('/auth/login'))
    await login(page, 'wrong_user', 'wrong_pass')
    expect((await loginRes).ok()).toBeFalsy()

    await expect(page).toHaveURL(/\/login/)
    const cookies = await context.cookies()
    expect(cookies.find((c) => c.name === 'access_token')).toBeUndefined()
  })
})
