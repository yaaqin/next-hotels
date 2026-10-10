import { test, expect, type Page } from '@playwright/test'
import { daysFromToday, toParam } from '../support/dates'
import { ALLOW_WRITES, USER } from '../support/env'

test.skip(!USER.email, 'E2E_USER_EMAIL belum di-set')

const checkin = daysFromToday(3)
const checkout = daysFromToday(4)

async function openReservation(page: Page) {
  await page.goto(`/booking?checkin=${toParam(checkin)}&checkout=${toParam(checkout)}`)
  await page.getByRole('button', { name: /reserve now/i }).first().click()
  await expect(page).toHaveURL(/\/reservation$/)
  // Form kontak hanya muncul kalau session next-auth terbaca
  await expect(page.getByTestId('input-full-name')).toBeVisible()
}

async function fillContact(page: Page) {
  await page.getByTestId('input-full-name').fill('Agus Test')
  await page.getByTestId('input-phone').fill('81234567890')
  await page.getByTestId('select-id-type').selectOption('KTP')
  await page.getByTestId('input-id-number').fill('3271010101010001')
}

async function selectFirstRoom(page: Page) {
  await expect(page.getByTestId('btn-select-room')).toBeEnabled()
  await page.getByTestId('btn-select-room').click()
  await page.getByTestId('room-option').first().click()
}

test.describe('Reservation (user login)', () => {
  test('user login melihat form kontak dengan email akun', async ({ page }) => {
    await openReservation(page)
    await expect(page.getByRole('button', { name: /masuk dengan google/i })).toHaveCount(0)
    await expect(page.locator('input[type="email"]')).toHaveValue(USER.email!)
    await expect(page.getByTestId('btn-confirm-booking')).toBeEnabled()
  })

  test('submit form kosong menampilkan error validasi tanpa membuat booking', async ({ page }) => {
    let bookingRequested = false
    page.on('request', (req) => {
      if (req.method() === 'POST' && /\/booking(\?|$)/.test(req.url())) bookingRequested = true
    })

    await openReservation(page)
    // Nama bisa terisi dari kunjungan sebelumnya (store persist) → kosongkan dulu
    await page.getByTestId('input-full-name').fill('')
    await page.getByTestId('btn-confirm-booking').click()

    await expect(page.getByText('Nama lengkap wajib diisi')).toBeVisible()
    await expect(page.getByText('Nomor telepon wajib diisi')).toBeVisible()
    await expect(page.getByText('Tipe identitas wajib dipilih')).toBeVisible()

    // Error hilang begitu field diperbaiki (validasi ulang setelah submit pertama)
    await page.getByTestId('input-full-name').fill('Agus Test')
    await expect(page.getByText('Nama lengkap wajib diisi')).toBeHidden()
    expect(bookingRequested).toBe(false)
  })

  test('pilih nomor kamar dan metode VA', async ({ page }) => {
    await openReservation(page)
    await fillContact(page)
    await selectFirstRoom(page)

    await page.getByTestId('btn-payment-va').click()
    await page.getByTestId('btn-select-va').click()
    await page.getByTestId('va-option-va_bca').click()
    await expect(page.getByTestId('btn-select-va')).toContainText(/bca/i)
  })

  // Membuat booking + transaksi Midtrans di DB bersama → jalankan dengan E2E_ALLOW_WRITES=1
  test('konfirmasi booking VA BCA diarahkan ke halaman pembayaran', async ({ page }) => {
    test.skip(!ALLOW_WRITES, 'Set E2E_ALLOW_WRITES=1 untuk test yang membuat booking')

    await openReservation(page)
    await fillContact(page)
    await selectFirstRoom(page)
    await page.getByTestId('btn-payment-va').click()
    await page.getByTestId('btn-select-va').click()
    await page.getByTestId('va-option-va_bca').click()

    await page.getByTestId('btn-confirm-booking').click()
    // Kalau tampilan harga bukan IDR, muncul konfirmasi mata uang dulu
    const confirmCurrency = page.getByTestId('btn-confirm-currency')
    if (await confirmCurrency.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await confirmCurrency.click()
    }

    await expect(page).toHaveURL(/\/reservation\/[^/]+$/, { timeout: 30_000 })
  })
})
