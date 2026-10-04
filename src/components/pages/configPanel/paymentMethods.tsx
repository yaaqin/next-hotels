'use client'
import { PageHeader } from '@/src/components/organisms/configPanel/shell'
import {
  Button,
  Card,
  Chip,
  Empty,
  FilterBar,
  FilterSelect,
  SegmentTabs,
  Skeleton,
  Toggle,
  cx,
} from '@/src/components/organisms/configPanel/ui'
import {
  useConfigSites,
  usePaymentMethodConfig,
  useUpdatePaymentMethod,
} from '@/src/hooks/query/config'
import { PaymentMethodConfig, PaymentScope } from '@/src/models/config'
import { useState } from 'react'

const ALL_SITES = ''

const SCOPES: { key: PaymentScope; label: string; hint: string }[] = [
  { key: 'BOOKING', label: 'Booking kamar', hint: 'Halaman reservasi & bayar selisih reschedule' },
  { key: 'FOOD', label: 'Food order', hint: 'Pilihan bayar di halaman Midtrans untuk pesanan makanan' },
]

const onOff = (v: boolean) => (v ? 'On' : 'Off')

// Asal status efektif: cabang → semua cabang → default
function sourceLabel(item: PaymentMethodConfig, isSiteView: boolean) {
  if (isSiteView) {
    if (item.siteValue !== null) return 'Diatur khusus cabang ini'
    return `Ikut semua cabang (${onOff(item.isEnabled)})`
  }
  if (item.globalValue !== null) return 'Diatur untuk semua cabang'
  return `Default sistem (${onOff(item.defaultEnabled)})`
}

export default function ConfigPaymentMethodsPage() {
  const [scope, setScope] = useState<PaymentScope>('BOOKING')
  const [siteCode, setSiteCode] = useState(ALL_SITES)
  const isSiteView = siteCode !== ALL_SITES

  const { data: sites } = useConfigSites()
  const { data, isLoading } = usePaymentMethodConfig(scope, siteCode || undefined)
  const { mutate, isPending, variables } = useUpdatePaymentMethod()

  const items = data?.data ?? []
  const siteName = sites?.data.find((s) => s.sitecode === siteCode)?.nama
  const scopeInfo = SCOPES.find((s) => s.key === scope)!

  const save = (method: string, isEnabled: boolean | null) =>
    mutate({ scope, siteCode: siteCode || undefined, method, isEnabled })

  return (
    <>
      <PageHeader
        title="Payment Methods"
        subtitle="Nyalakan / matikan metode pembayaran untuk semua cabang, atau override per cabang."
      />

      <FilterBar label="Cabang">
        <FilterSelect
          value={siteCode}
          onChange={setSiteCode}
          options={[
            { value: ALL_SITES, label: 'Semua cabang' },
            ...(sites?.data ?? []).map((s) => ({ value: s.sitecode, label: `${s.nama} (${s.sitecode})` })),
          ]}
        />
      </FilterBar>

      <div className="mt-6 flex justify-center px-4">
        <SegmentTabs<PaymentScope>
          value={scope}
          onChange={setScope}
          items={SCOPES.map((s) => ({ key: s.key, label: s.label }))}
        />
      </div>

      <Card className="mt-6 p-4 sm:p-5">
        <div className="mb-4 px-1">
          <p className="text-base font-medium">
            {scopeInfo.label} · {isSiteView ? siteName ?? siteCode : 'Semua cabang'}
          </p>
          <p className="mt-1 text-xs text-[var(--cp-muted)]">
            {scopeInfo.hint}.{' '}
            {isSiteView
              ? 'Setting di sini hanya berlaku untuk cabang ini dan menimpa setting semua cabang.'
              : 'Berlaku untuk semua cabang yang tidak punya setting sendiri.'}
          </p>
        </div>

        <ul className="space-y-1">
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          {!isLoading && items.length === 0 && <Empty>Tidak ada metode pembayaran</Empty>}
          {items.map((item) => {
            const overridden = isSiteView ? item.siteValue !== null : item.globalValue !== null
            const saving = isPending && variables?.method === item.method
            return (
              <li
                key={item.method}
                className={cx(
                  'flex items-center gap-3 rounded-2xl px-3 py-2.5',
                  overridden ? 'bg-[var(--cp-accent)]/10' : 'bg-[var(--cp-frame)]',
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 truncate text-sm">
                    {item.label}
                    <Chip tone={item.isEnabled ? 'accent' : 'danger'}>{onOff(item.isEnabled)}</Chip>
                  </p>
                  <p className="truncate text-[11px] text-[var(--cp-muted)]">
                    <span className="font-mono">{item.method}</span> · {sourceLabel(item, isSiteView)}
                  </p>
                </div>
                {overridden && (
                  <Button
                    variant="ghost"
                    className="h-8 px-3"
                    disabled={saving}
                    onClick={() => save(item.method, null)}
                  >
                    {isSiteView ? 'Ikut semua cabang' : 'Reset default'}
                  </Button>
                )}
                <Toggle
                  label={`${item.label} ${onOff(item.isEnabled)}`}
                  checked={item.isEnabled}
                  disabled={saving}
                  onChange={(v) => save(item.method, v)}
                />
              </li>
            )
          })}
        </ul>
      </Card>
    </>
  )
}
