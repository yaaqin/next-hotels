import { test, expect } from '@playwright/test'
import { daysFromToday, pickCalendarDay, toParam } from '../support/dates'

test.describe('Home', () => {
  test('halaman utama tampil tanpa error JS', async ({ page }) => {
    const errors: Error[] = []
    page.on('pageerror', (err) => errors.push(err))

    await page.goto('/')
    await expect(page.getByRole('link', { name: 'MBS', exact: true }).first()).toBeVisible()
    await expect(page.getByTestId('btn-booking')).toBeVisible()
    expect(errors).toEqual([])
  })

  test('overlay PESAN: tombol reserve nonaktif sampai tanggal dipilih', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('btn-booking').click()

    const reserve = page.getByTestId('btn-reserve')
    await expect(reserve).toBeVisible()
    await expect(reserve).toBeDisabled()

    await page.getByRole('button', { name: 'Close' }).click()
    await expect(reserve).toBeHidden()
  })

  test('pilih check-in & check-out lalu diarahkan ke /booking', async ({ page }) => {
    const checkin = daysFromToday(3)
    const checkout = daysFromToday(5)

    await page.goto('/')
    await page.getByTestId('btn-booking').click()
    await page.getByTestId('btn-open-calendar').click()
    await pickCalendarDay(page, checkin)
    await pickCalendarDay(page, checkout)

    // Popover tertutup otomatis setelah rentang lengkap, label menampilkan jumlah malam
    await expect(page.getByTestId('btn-open-calendar')).toContainText('2')

    await page.getByTestId('btn-reserve').click()
    await expect(page).toHaveURL(
      new RegExp(`/booking\\?checkin=${toParam(checkin)}&checkout=${toParam(checkout)}`),
    )
  })
})
