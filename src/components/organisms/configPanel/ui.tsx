'use client'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { ReactNode, useEffect } from 'react'

// Primitive UI panel config — warna dari token --cp-* di globals.css (.config-theme)

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

// ── Surface ────────────────────────────────────
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section
      className={cx(
        'rounded-[28px] border border-[var(--cp-line)] bg-[var(--cp-card)] p-5 sm:p-6',
        className,
      )}
    >
      {children}
    </section>
  )
}

// Panel terang di bawah (list kiri + detail gelap kanan), seperti "Unpaid Invoices"
export function Paper({
  title,
  action,
  className,
  children,
}: {
  title: string
  action?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <section
      className={cx(
        'rounded-[28px] bg-[var(--cp-paper)] p-4 text-[var(--cp-ink)] sm:p-5',
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <h2 className="text-base font-medium">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

// Kartu detail gelap di dalam Paper
export function DetailCard({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cx(
        'rounded-[24px] bg-[var(--cp-frame)] p-5 text-[var(--cp-text)] sm:p-6',
        className,
      )}
    >
      {children}
    </div>
  )
}

// Sub-kartu kecil di dalam DetailCard (label + nilai + panah)
export function Tile({
  label,
  value,
  onClick,
  className,
}: {
  label: string
  value: ReactNode
  onClick?: () => void
  className?: string
}) {
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      onClick={onClick}
      className={cx(
        'flex min-h-[104px] flex-col justify-between rounded-[18px] border border-[var(--cp-line)] bg-[var(--cp-card)] p-4 text-left',
        onClick && 'transition hover:border-[var(--cp-accent)]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xl font-light tabular-nums">{value}</span>
        {onClick && <ArrowUpRight size={14} className="text-[var(--cp-muted)]" />}
      </div>
      <span className="text-xs text-[var(--cp-muted)]">{label}</span>
    </Comp>
  )
}

export function Metric({
  label,
  value,
  suffix,
}: {
  label: string
  value: ReactNode
  suffix?: string
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-[var(--cp-muted)]">{label}</p>
      <p className="mt-2 text-3xl font-light tabular-nums sm:text-4xl">
        {value}
        {suffix && <span className="ml-1 text-base text-[var(--cp-muted)]">{suffix}</span>}
      </p>
    </div>
  )
}

// ── Chips & avatar ─────────────────────────────
type Tone = 'muted' | 'accent' | 'light' | 'outline' | 'danger'
const toneClass: Record<Tone, string> = {
  muted: 'bg-[var(--cp-card-2)] text-[var(--cp-text)]',
  accent: 'bg-[var(--cp-accent)] text-[var(--cp-accent-ink)]',
  light: 'bg-white text-[var(--cp-ink)]',
  outline: 'border border-[var(--cp-paper-line)] text-[var(--cp-ink-muted)]',
  danger: 'bg-[var(--cp-danger)]/15 text-[var(--cp-danger)]',
}

export function Chip({ tone = 'muted', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center rounded-full px-3 py-1 text-[11px] font-medium',
        toneClass[tone],
      )}
    >
      {children}
    </span>
  )
}

const AVATAR_HUES = [28, 200, 150, 330, 260, 90, 10, 180]
const hueOf = (name: string) =>
  AVATAR_HUES[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_HUES.length]

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const hue = hueOf(name)
  return (
    <span
      title={name}
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold uppercase ring-2 ring-[var(--cp-card)]"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `hsl(${hue} 70% 82%)`,
        color: `hsl(${hue} 45% 22%)`,
      }}
    >
      {name.slice(0, 2)}
    </span>
  )
}

export function AvatarStack({ names, max = 5 }: { names: string[]; max?: number }) {
  const shown = names.slice(0, max)
  const rest = names.length - shown.length
  return (
    <div className="flex -space-x-2">
      {shown.map((n) => (
        <Avatar key={n} name={n} size={34} />
      ))}
      {rest > 0 && (
        <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[var(--cp-card-2)] text-[11px] ring-2 ring-[var(--cp-card)]">
          +{rest}
        </span>
      )}
    </div>
  )
}

// ── Tabs pill (seperti All / Draft / Unpaid) ───
export function SegmentTabs<T extends string>({
  items,
  value,
  onChange,
}: {
  items: { key: T; label: string; count?: number }[]
  value: T
  onChange: (key: T) => void
}) {
  return (
    <div className="hide-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full bg-[var(--cp-frame)] p-1.5">
      {items.map((it) => {
        const active = it.key === value
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={cx(
              'flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition',
              active
                ? 'bg-[var(--cp-accent)] text-[var(--cp-accent-ink)]'
                : 'bg-[var(--cp-card)] text-[var(--cp-text)] hover:bg-[var(--cp-card-2)]',
            )}
          >
            {it.label}
            {it.count !== undefined && (
              <span
                className={cx(
                  'inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px]',
                  active
                    ? 'bg-[var(--cp-accent-ink)] text-[var(--cp-accent)]'
                    : 'bg-[var(--cp-card-2)]',
                )}
              >
                {it.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ── List row di Paper (baris terpilih jadi pill gelap) ──
export function ListRow({
  active,
  onClick,
  avatar,
  title,
  subtitle,
  badge,
  trailing,
}: {
  active?: boolean
  onClick?: () => void
  avatar?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  badge?: ReactNode
  trailing?: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        'flex w-full items-center gap-3 rounded-full py-2 pl-2 pr-4 text-left transition',
        active ? 'bg-[var(--cp-ink)] text-white' : 'hover:bg-black/[0.04]',
      )}
    >
      {avatar}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        {subtitle && (
          <p
            className={cx(
              'truncate text-xs',
              active ? 'text-white/60' : 'text-[var(--cp-ink-muted)]',
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      {badge}
      {trailing && <div className="shrink-0 text-sm tabular-nums">{trailing}</div>}
    </button>
  )
}

// ── Filter bar ─────────────────────────────────
export function FilterSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full border border-[var(--cp-line)] bg-[var(--cp-card)] px-4 text-sm sm:max-w-xs">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[var(--cp-text)] outline-none placeholder:text-[var(--cp-muted)]"
      />
      <Search size={16} className="text-[var(--cp-muted)]" />
    </label>
  )
}

export function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 min-w-0 flex-1 appearance-none rounded-full border border-[var(--cp-line)] bg-[var(--cp-card)] px-4 text-sm text-[var(--cp-text)] outline-none sm:max-w-[200px]"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

export function FilterBar({ label, count, children }: { label: string; count?: number; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <p className="flex shrink-0 items-center gap-2 text-sm">
        {label}
        {count !== undefined && (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-semibold text-[var(--cp-ink)]">
            {count}
          </span>
        )}
      </p>
      <div className="flex flex-1 flex-wrap gap-2">{children}</div>
    </div>
  )
}

// ── Buttons ────────────────────────────────────
export function Button({
  variant = 'accent',
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'accent' | 'light' | 'ghost' | 'danger' }) {
  return (
    <button
      {...props}
      className={cx(
        'inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40',
        variant === 'accent' && 'bg-[var(--cp-accent)] text-[var(--cp-accent-ink)] hover:brightness-95',
        variant === 'light' && 'bg-white text-[var(--cp-ink)] hover:bg-white/90',
        variant === 'ghost' &&
          'border border-[var(--cp-line)] text-[var(--cp-text)] hover:bg-[var(--cp-card-2)]',
        variant === 'danger' &&
          'border border-[var(--cp-danger)]/40 text-[var(--cp-danger)] hover:bg-[var(--cp-danger)]/10',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function IconButton({
  label,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      {...props}
      aria-label={label}
      title={label}
      className={cx(
        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--cp-line)] text-[var(--cp-text)] transition hover:bg-[var(--cp-card-2)]',
        className,
      )}
    >
      {children}
    </button>
  )
}

// ── Toggle ─────────────────────────────────────
export function Toggle({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean
  disabled?: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cx(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-[var(--cp-accent)]' : 'bg-[var(--cp-card-2)]',
      )}
    >
      <span
        className={cx(
          'absolute h-5 w-5 rounded-full shadow transition-all',
          checked ? 'left-[22px] bg-[var(--cp-accent-ink)]' : 'left-0.5 bg-white',
        )}
      />
    </button>
  )
}

// ── Modal + form ───────────────────────────────
export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      className="config-theme fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[28px] border border-[var(--cp-line)] bg-[var(--cp-frame)] p-6 text-[var(--cp-text)]"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg">{title}</h3>
          <IconButton label="Tutup" onClick={onClose}>
            <X size={16} />
          </IconButton>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-[var(--cp-muted)]">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-[var(--cp-muted)]">{hint}</span>}
    </label>
  )
}

export const inputClass =
  'h-11 w-full rounded-2xl border border-[var(--cp-line)] bg-[var(--cp-card)] px-4 text-sm text-[var(--cp-text)] outline-none placeholder:text-[var(--cp-muted)] focus:border-[var(--cp-accent)]'

// ── States ─────────────────────────────────────
export function Empty({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <div
      className={cx(
        'flex min-h-[160px] items-center justify-center rounded-[20px] border border-dashed p-6 text-center text-sm',
        dark
          ? 'border-[var(--cp-line)] text-[var(--cp-muted)]'
          : 'border-[var(--cp-paper-line)] text-[var(--cp-ink-muted)]',
      )}
    >
      {children}
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx('animate-pulse rounded-2xl bg-[var(--cp-card-2)]', className)} />
}

export { cx }
