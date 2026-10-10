import { defineConfig, devices } from '@playwright/test'
import { loadEnvConfig } from '@next/env'

// Tanggal di test dihitung di Node, kalender dirender di browser → samakan zona waktunya
process.env.TZ = 'Asia/Jakarta'

// Baca .env / .env.local seperti Next (NEXTAUTH_SECRET, BE_URL, E2E_*)
loadEnvConfig(process.cwd())

const PORT = 9022
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/.results',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { outputFolder: 'e2e/.report', open: 'never' }]],

  use: {
    baseURL,
    // Hook data-cy yang sudah ada dipakai lewat page.getByTestId()
    testIdAttribute: 'data-cy',
    locale: 'en-US',
    timezoneId: 'Asia/Jakarta',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'public',
      testDir: './e2e/public',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'admin',
      testDir: './e2e/admin',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: 'e2e/.auth/admin.json' },
    },
    {
      name: 'user',
      testDir: './e2e/user',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: 'e2e/.auth/user.json' },
    },
  ],

  // Pakai dev server yang sudah jalan kalau ada; kalau belum, dinyalakan otomatis
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        url: baseURL,
        reuseExistingServer: true,
        timeout: 180_000,
      },
})
