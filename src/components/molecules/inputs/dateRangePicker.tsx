'use client'

import { useState } from 'react'
import { differenceInCalendarDays, format } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { Calendar01Icon } from 'hugeicons-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

// Pilih rentang menginap (check-in → check-out) — gaya sama dengan DatePicker publik.
// Range baru dikirim lewat onChange kalau sudah lengkap & minimal 1 malam.

export interface StayRange {
  from: Date
  to: Date
}

interface DateRangePickerProps {
  value?: StayRange
  onChange: (range: StayRange) => void
  placeholder: string
  label?: string
  required?: boolean
  // Teks jumlah malam, mis. (n) => `${n} malam`
  nightsLabel: (nights: number) => string
  // Tanggal sebelum ini tidak bisa dipilih (default: hari ini)
  minDate?: Date
  displayFormat?: string
  className?: string
  'data-cy'?: string
}

const startOfToday = () => new Date(new Date().setHours(0, 0, 0, 0))

export function nightsOf(range: StayRange) {
  return differenceInCalendarDays(range.to, range.from)
}

export function DateRangePicker({
  value,
  onChange,
  placeholder,
  label,
  required = false,
  nightsLabel,
  minDate,
  displayFormat = 'dd MMM yyyy',
  className,
  'data-cy': dataCy,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  // Pilihan sementara selama user baru klik check-in
  const [draft, setDraft] = useState<DateRange | undefined>(value)
  const min = minDate ?? startOfToday()

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (next) setDraft(value)
  }

  const handleSelect = (range: DateRange | undefined, clicked: Date) => {
    // Rentang sudah lengkap → klik berikutnya memulai rentang baru (check-in baru)
    if (draft?.from && draft.to) {
      setDraft({ from: clicked, to: undefined })
      return
    }
    setDraft(range)
    if (range?.from && range.to && differenceInCalendarDays(range.to, range.from) >= 1) {
      onChange({ from: range.from, to: range.to })
      setOpen(false)
    }
  }

  return (
    <div className={className}>
      {label && (
        <label
          className="block text-[0.58rem] tracking-[0.18em] uppercase mb-2"
          style={{ color: '#2C4E72' }}
        >
          {label} {required && <span style={{ color: '#1A56A0' }}>*</span>}
        </label>
      )}
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            data-cy={dataCy}
            variant="outline"
            className="w-full justify-start text-left font-normal rounded-xl px-4 py-3 h-auto text-sm hover:bg-transparent transition-all duration-200"
            style={{
              border: '0.5px solid #B5CDE8',
              background: '#EEF3FA',
              color: value ? '#0A1828' : '#6A9EC5',
            }}
          >
            <Calendar01Icon className="mr-2 h-4 w-4 shrink-0" style={{ color: '#1A56A0' }} />
            {value ? (
              <span className="truncate">
                {format(value.from, displayFormat)} → {format(value.to, displayFormat)}
                <span style={{ color: '#6A9EC5' }}> · {nightsLabel(nightsOf(value))}</span>
              </span>
            ) : (
              <span className="truncate">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn('w-auto p-0 z-[200]')} align="start">
          <Calendar
            mode="range"
            selected={draft}
            onSelect={handleSelect}
            defaultMonth={draft?.from ?? min}
            disabled={(date) => date < min}
            min={1}
            initialFocus
            className="rounded-lg border"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
