import { test, expect } from '@playwright/test'
import { daysFromToday, pickCalendarDay, toParam } from '../support/dates'

const checkin = daysFromToday(3)
const checkout = daysFromToday(4)
const bookingUrl = `/booking?checkin=${toParam(checkin)}&checkout=${toParam(checkout)}`

test.describe('Booking (tanpa login)', () => {
  test('daftar kamar tersedia tampil untuk tanggal yang dipilih', async ({ page }) => {
    await page.goto(bookingUrl)
    await expect(page.getByText('1 Malam', { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: /reserve now/i }).first()).toBeVisible()
  })

  test('tanpa check-out → default 1 malam', async ({ page }) => {
    await page.goto(`/booking?checkin=${toParam(checkin)}`)
    await expect(page.getByText('1 Malam', { exact: true })).toBeVisible()
  })

  test('ganti rentang tanggal lewat kalender + Apply mengubah URL', async ({ page }) => {
    const newCheckin = daysFromToday(6)
    const newCheckout = daysFromToday(9)

    await page.goto(bookingUrl)
    await page.getByTestId('btn-open-calendar').click()

    const apply = page.getByTestId('btn-apply-dates')
    // Klik pertama pada rentang lengkap memulai check-in baru → Apply nonaktif sampai check-out dipilih
    await pickCalendarDay(page, newCheckin)
    await expect(apply).toBeDisabled()
    await pickCalendarDay(page, newCheckout)
    await expect(apply).toBeEnabled()
    await apply.click()

    await expect(page).toHaveURL(new RegExp(`checkin=${toParam(newCheckin)}&checkout=${toParam(newCheckout)}`))
    await expect(page.getByText('3 Malam', { exact: true })).toBeVisible()
  })

  test('Lihat Perincian Kamar membuka halaman detail', async ({ page }) => {
    await page.goto(bookingUrl)
    await page.getByRole('button', { name: /lihat perincian kamar/i }).first().click()
    await expect(page).toHaveURL(/\/booking\/[^/?]+\?checkIn=/)
  })

  test('Reserve Now tanpa login meminta masuk dengan Google', async ({ page }) => {
    await page.goto(bookingUrl)
    await page.getByRole('button', { name: /reserve now/i }).first().click()

    await expect(page).toHaveURL(/\/reservation$/)
    await expect(page.getByRole('button', { name: /masuk dengan google/i })).toBeVisible()
    await expect(page.getByTestId('btn-confirm-booking')).toBeDisabled()
  })
})
