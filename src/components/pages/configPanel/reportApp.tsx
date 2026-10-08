'use client'
import { PageHeader } from '@/src/components/organisms/configPanel/shell'
import { Button, Card, Field, Skeleton, inputClass } from '@/src/components/organisms/configPanel/ui'
import { useReportAppSetting, useUpdateReportAppSetting } from '@/src/hooks/query/config'
import { useEffect, useState } from 'react'

// Batas sama dengan validasi BE (UpdateReportAppSettingDto)
const IDLE_MIN = 10
const IDLE_MAX = 3600
const PIN_MIN = 3
const PIN_MAX = 10

const IDLE_PRESETS = [15, 30, 60, 300]

const formatSeconds = (s: number) => (s < 60 ? `${s} detik` : s % 60 === 0 ? `${s / 60} menit` : `${s} detik`)

export default function ConfigReportAppPage() {
  const { data, isLoading } = useReportAppSetting()
  const { mutate, isPending } = useUpdateReportAppSetting()
  const setting = data?.data

  const [idle, setIdle] = useState('')
  const [attempts, setAttempts] = useState('')

  useEffect(() => {
    if (!setting) return
    setIdle(String(setting.idleTimeoutSeconds))
    setAttempts(String(setting.pinMaxAttempts))
  }, [setting])

  const idleNum = Number(idle)
  const attemptsNum = Number(attempts)
  const idleError =
    !Number.isInteger(idleNum) || idleNum < IDLE_MIN || idleNum > IDLE_MAX
      ? `Isi ${IDLE_MIN}–${IDLE_MAX} detik`
      : null
  const attemptsError =
    !Number.isInteger(attemptsNum) || attemptsNum < PIN_MIN || attemptsNum > PIN_MAX
      ? `Isi ${PIN_MIN}–${PIN_MAX} kali`
      : null
  const changed =
    !!setting && (idleNum !== setting.idleTimeoutSeconds || attemptsNum !== setting.pinMaxAttempts)

  return (
    <>
      <PageHeader
        title="Report App"
        subtitle="Keamanan aplikasi laporan (Flutter) untuk Owner & Manager: kunci otomatis dan batas salah PIN."
      />

      <Card className="mt-6 max-w-xl p-4 sm:p-5">
        {isLoading || !setting ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault()
              if (idleError || attemptsError || !changed) return
              mutate({ idleTimeoutSeconds: idleNum, pinMaxAttempts: attemptsNum })
            }}
          >
            <Field
              label="Kunci otomatis setelah diam (detik)"
              hint={
                idleError ??
                `App terkunci kalau tidak disentuh selama ${formatSeconds(idleNum)}, atau ditinggal ke background selama itu. Buka lagi pakai PIN / sidik jari.`
              }
            >
              <input
                className={inputClass}
                inputMode="numeric"
                value={idle}
                onChange={(e) => setIdle(e.target.value.replace(/\D/g, ''))}
              />
            </Field>
            <div className="-mt-2 flex flex-wrap gap-2">
              {IDLE_PRESETS.map((s) => (
                <Button
                  key={s}
                  type="button"
                  variant={idleNum === s ? 'accent' : 'ghost'}
                  className="h-8 px-3"
                  onClick={() => setIdle(String(s))}
                >
                  {formatSeconds(s)}
                </Button>
              ))}
            </div>

            <Field
              label="Batas salah PIN"
              hint={
                attemptsError ??
                `Salah PIN ${attemptsNum} kali → perangkat dicabut dan user harus login ulang pakai password.`
              }
            >
              <input
                className={inputClass}
                inputMode="numeric"
                value={attempts}
                onChange={(e) => setAttempts(e.target.value.replace(/\D/g, ''))}
              />
            </Field>

            <div className="flex items-center justify-between gap-3 pt-1">
              <p className="text-[11px] text-[var(--cp-muted)]">
                Terakhir diubah{' '}
                {new Date(setting.updatedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}.
                Berlaku di app saat login / buka kunci berikutnya.
              </p>
              <Button type="submit" disabled={isPending || !changed || !!idleError || !!attemptsError}>
                {isPending ? 'Menyimpan…' : 'Simpan'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </>
  )
}
