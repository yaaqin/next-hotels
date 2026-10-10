import { test, expect } from '@playwright/test'
import { USER } from '../support/env'

test.skip(!USER.email, 'E2E_USER_EMAIL belum di-set')

// Halaman akun user — dengan session valid tidak boleh muncul gerbang "Masuk dengan Google"
for (const path of ['/history', '/recent-activity', '/profile']) {
  test(`${path} terbuka untuk user login`, async ({ page }) => {
    const jsErrors: string[] = []
    page.on('pageerror', (err) => jsErrors.push(err.message))

    await page.goto(path)
    await page.waitForLoadState('networkidle').catch(() => {})

    await expect(page.getByRole('button', { name: /masuk dengan google|sign in with google/i })).toHaveCount(0)
    expect(jsErrors).toEqual([])
  })
}

test('cookie userToken disinkronkan dari session', async ({ page, context }) => {
  await page.goto('/history')
  await expect
    .poll(async () => (await context.cookies()).find((c) => c.name === 'userToken')?.value)
    .toBeTruthy()
})
