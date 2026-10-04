'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar01Icon } from 'hugeicons-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

// Date picker global — tampilan diambil dari kalender di overlay "Pesan" (navbar)
// supaya semua pemilih tanggal konsisten. variant 'default' = gaya input dashboard.

interface DatePickerProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  placeholder: string
  label?: string
  required?: boolean
  // Tanggal sebelum ini tidak bisa dipilih (default: hari ini)
  minDate?: Date
  // Format teks tombol, default "PPP" → "September 26th, 2026"
  displayFormat?: string
  className?: string
  'data-cy'?: string
  // 'public' = gaya halaman publik (default), 'default' = gaya input dashboard
  variant?: 'public' | 'default'
}

const startOfToday = () => new Date(new Date().setHours(0, 0, 0, 0))

export function DatePicker({
  value,
  onChange,
  placeholder,
  label,
  required = false,
  minDate,
  displayFormat = 'PPP',
  className,
  'data-cy': dataCy,
  variant = 'public',
}: DatePickerProps) {
  const isPublic = variant === 'public'
  const [open, setOpen] = useState(false)
  const min = minDate ?? startOfToday()

  const handleSelect = (date: Date | undefined) => {
    onChange(date)
    if (date) setOpen(false)
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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            data-cy={dataCy}
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal h-auto text-sm transition-all duration-200',
              isPublic
                ? 'rounded-xl px-4 py-3 hover:bg-transparent'
                : 'rounded-md px-3 py-2 border border-gray-300 bg-white hover:bg-white focus-visible:ring-2 focus-visible:ring-blue-500',
              isPublic ? !value && 'text-[#6A9EC5]' : value ? 'text-gray-900' : 'text-gray-400',
            )}
            style={
              isPublic
                ? {
                    border: '0.5px solid #B5CDE8',
                    background: '#EEF3FA',
                    color: value ? '#0A1828' : '#6A9EC5',
                  }
                : undefined
            }
          >
            <Calendar01Icon
              className={cn('mr-2 h-4 w-4', !isPublic && 'text-gray-500')}
              style={isPublic ? { color: '#1A56A0' } : undefined}
            />
            {value ? format(value, displayFormat) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[200]" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            defaultMonth={value ?? min}
            disabled={(date) => date < min}
            initialFocus
            className="rounded-lg border"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
