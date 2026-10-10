import { expect, type Page } from '@playwright/test'

export function daysFromToday(days: number) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + days)
  return d
}

// yyyy-MM-dd (format query param ?checkin= / ?checkout=)
export function toParam(date: Date) {
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${mm}-${dd}`
}

// Klik tanggal di kalender shadcn (react-day-picker) yang sedang terbuka.
// Tombol hari punya data-day = toLocaleDateString() → browser di-set locale en-US.
export async function pickCalendarDay(page: Page, date: Date) {
  const day = page.locator(`button[data-day="${date.toLocaleDateString('en-US')}"]`).first()
  for (let i = 0; i < 12 && !(await day.isVisible()); i++) {
    await page.getByRole('button', { name: /next month/i }).click()
  }
  await expect(day).toBeEnabled()
  await day.click()
}
