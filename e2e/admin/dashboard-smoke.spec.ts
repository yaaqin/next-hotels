import { test, expect } from '@playwright/test'

// Halaman list (tanpa [id]) — cukup dibuka, harus render tanpa crash & tanpa 5xx dari BE
const DASHBOARD_PAGES = [
  '/dashboard',
  '/dashboard/booking',
  '/dashboard/room',
  '/dashboard/room-type',
  '/dashboard/room-maintenance',
  '/dashboard/bed-type',
  '/dashboard/facility',
  '/dashboard/facility/group',
  '/dashboard/facility/type',
  '/dashboard/gallery',
  '/dashboard/image',
  '/dashboard/site',
  '/dashboard/user',
  '/dashboard/user-log',
  '/dashboard/active-user',
  '/dashboard/finance',
  '/dashboard/refund',
  '/dashboard/withdraw',
  '/dashboard/currency',
  '/dashboard/operational',
  '/dashboard/price-proposal',
  '/dashboard/price-adjustment',
  '/dashboard/partner-proposal',
  '/dashboard/reschedule-policy',
  '/dashboard/menu',
  '/dashboard/food',
  '/dashboard/food-category',
  '/dashboard/food-history',
  '/dashboard/restaurant',
  '/dashboard/admin-restaurant',
]

const CONFIG_PANEL_PAGES = [
  '/config-panel',
  '/config-panel/admins',
  '/config-panel/roles',
  '/config-panel/menus',
  '/config-panel/access-control',
  '/config-panel/payment-methods',
  '/config-panel/report-app',
]

for (const path of [...DASHBOARD_PAGES, ...CONFIG_PANEL_PAGES]) {
  test(`buka ${path}`, async ({ page }) => {
    const jsErrors: string[] = []
    const serverErrors: string[] = []
    page.on('pageerror', (err) => jsErrors.push(err.message))
    page.on('response', (res) => {
      if (res.status() >= 500 && res.url().includes('/api/v1/')) {
        serverErrors.push(`${res.status()} ${res.request().method()} ${res.url()}`)
      }
    })

    const res = await page.goto(path)
    expect(res?.status(), 'status HTML').toBeLessThan(400)

    // Tunggu request awal (react-query) selesai — socket.io tidak dihitung
    await page.waitForLoadState('networkidle').catch(() => {})

    await expect(page).not.toHaveURL(/\/login/)
    await expect(page.getByText(/application error|unhandled runtime error/i)).toHaveCount(0)
    expect(jsErrors, 'error JS di browser').toEqual([])
    expect(serverErrors, 'response 5xx dari BE').toEqual([])
  })
}
