# E2E (Playwright)

Butuh BE (`BE_URL`) jalan. Dev server Next (port 9022) dinyalakan otomatis kalau belum jalan.

```bash
npm run e2e                      # semua project
npm run e2e -- --project=public  # hanya halaman publik
npm run e2e:ui                   # mode UI / debug
npm run e2e:report               # buka laporan HTML terakhir
```

## Project

| Project  | Folder         | Session                                        |
| -------- | -------------- | ---------------------------------------------- |
| `setup`  | `auth.setup.ts`| login admin & user, simpan ke `e2e/.auth/`     |
| `public` | `e2e/public`   | tanpa login                                    |
| `admin`  | `e2e/admin`    | superadmin (login lewat form `/login`)         |
| `user`   | `e2e/user`     | user Google (token dari BE `/auth/google`)     |

Login Google tidak bisa diotomasi, jadi `auth.setup.ts` mengambil token dari BE lalu
membuat cookie `next-auth.session-token` sendiri pakai `NEXTAUTH_SECRET`.

## Env (`.env.local`)

| Variabel              | Default                    | Keterangan                                     |
| --------------------- | -------------------------- | ---------------------------------------------- |
| `E2E_USER_EMAIL`      | —                          | email user publik; kosong → project `user` di-skip |
| `E2E_USER_GOOGLE_ID`  | `e2e-playwright`           | dipakai kalau user belum ada                   |
| `E2E_ADMIN_USERNAME`  | `superadmin`               |                                                |
| `E2E_ADMIN_PASSWORD`  | password dev bersama       |                                                |
| `E2E_ALLOW_WRITES`    | —                          | `1` → jalankan test yang membuat booking       |
| `E2E_BASE_URL`        | `http://localhost:9022`    | di-set → tidak menyalakan dev server           |

Selector pakai atribut `data-cy` yang sudah ada (`page.getByTestId('btn-reserve')`).
