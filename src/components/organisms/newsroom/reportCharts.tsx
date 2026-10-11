'use client'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

// Chart laporan newsroom (tema gelap .config-theme, permukaan --cp-card #1e1f23).
// Warna series divalidasi untuk permukaan itu (kontras >= 3:1, aman CVD): view = biru, like = magenta.
export const SERIES = { views: '#3987e5', likes: '#d55181' } as const

const MUTED = '#8d8f97' // --cp-muted
const GRID = 'rgba(255,255,255,0.07)' // --cp-line
const AXIS = 'rgba(255,255,255,0.14)'

type Point = { t: string; views: number; likes: number }
type Bucket = 'hour' | 'day'

const compact = (n: number) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(n)

// Label sumbu & tooltip dalam WIB
export const formatBucket = (iso: string, bucket: Bucket, long = false) =>
  new Date(iso).toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    ...(bucket === 'hour'
      ? { hour: '2-digit', minute: '2-digit', ...(long && { day: 'numeric', month: 'short' }) }
      : { day: 'numeric', month: 'short', ...(long && { weekday: 'short' }) }),
  })

function ChartTooltip({
  active,
  payload,
  label,
  bucket,
  name,
  color,
}: {
  active?: boolean
  payload?: readonly { value?: unknown }[]
  label?: unknown
  bucket: Bucket
  name: string
  color: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-[var(--cp-line)] bg-[var(--cp-frame)] px-3 py-2 text-xs shadow-xl">
      <p className="text-[var(--cp-muted)]">{formatBucket(String(label), bucket, true)}</p>
      <p className="mt-1 flex items-center gap-2">
        <span className="inline-block h-0.5 w-3 rounded-full" style={{ background: color }} />
        <span className="text-sm font-semibold tabular-nums text-[var(--cp-text)]">
          {Number(payload[0].value).toLocaleString('id-ID')}
        </span>
        <span className="text-[var(--cp-muted)]">{name}</span>
      </p>
    </div>
  )
}

const axisProps = (bucket: Bucket, count: number) => ({
  x: {
    dataKey: 't',
    tickFormatter: (v: string) => formatBucket(v, bucket),
    tick: { fill: MUTED, fontSize: 11 },
    axisLine: { stroke: AXIS },
    tickLine: false,
    minTickGap: 24,
    interval: count > 31 ? ('preserveStartEnd' as const) : undefined,
  },
  y: {
    tick: { fill: MUTED, fontSize: 11 },
    axisLine: false,
    tickLine: false,
    allowDecimals: false,
    width: 40,
    tickFormatter: compact,
  },
})

export function ViewsChart({ data, bucket }: { data: Point[]; bucket: Bucket }) {
  const a = axisProps(bucket, data.length)
  return (
    <div className="h-60" role="img" aria-label="Grafik jumlah view per periode">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke={GRID} />
          <XAxis {...a.x} />
          <YAxis {...a.y} />
          <Tooltip
            cursor={{ stroke: MUTED, strokeWidth: 1 }}
            content={(p) => (
              <ChartTooltip active={p.active} payload={p.payload} label={p.label} bucket={bucket} name="view" color={SERIES.views} />
            )}
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke={SERIES.views}
            strokeWidth={2}
            fill={SERIES.views}
            fillOpacity={0.1}
            activeDot={{ r: 4, fill: SERIES.views, stroke: '#1e1f23', strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function LikesChart({ data, bucket }: { data: Point[]; bucket: Bucket }) {
  const a = axisProps(bucket, data.length)
  return (
    <div className="h-60" role="img" aria-label="Grafik jumlah like per periode">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barCategoryGap={2}>
          <CartesianGrid vertical={false} stroke={GRID} />
          <XAxis {...a.x} />
          <YAxis {...a.y} />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            content={(p) => (
              <ChartTooltip active={p.active} payload={p.payload} label={p.label} bucket={bucket} name="like" color={SERIES.likes} />
            )}
          />
          <Bar dataKey="likes" fill={SERIES.likes} radius={[4, 4, 0, 0]} maxBarSize={24} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Tabel data chart — nilai tetap terbaca tanpa hover
export function ChartTable({ data, bucket, field, label }: { data: Point[]; bucket: Bucket; field: 'views' | 'likes'; label: string }) {
  return (
    <details className="mt-3 text-xs">
      <summary className="cursor-pointer text-[var(--cp-muted)] hover:text-[var(--cp-text)]">Lihat data</summary>
      <div className="mt-2 max-h-56 overflow-y-auto rounded-xl border border-[var(--cp-line)]">
        <table className="w-full">
          <thead className="sticky top-0 bg-[var(--cp-card-2)] text-left text-[var(--cp-muted)]">
            <tr>
              <th className="px-3 py-2 font-normal">{bucket === 'hour' ? 'Jam (WIB)' : 'Tanggal'}</th>
              <th className="px-3 py-2 text-right font-normal">{label}</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {data.map((p) => (
              <tr key={p.t} className="border-t border-[var(--cp-line)]">
                <td className="px-3 py-1.5">{formatBucket(p.t, bucket, true)}</td>
                <td className="px-3 py-1.5 text-right">{p[field].toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}
