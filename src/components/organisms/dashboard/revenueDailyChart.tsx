'use client'

import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import { revenueDailyRow } from '@/src/models/finance/revenueDaily'

// Uang masuk per hari menurut tanggal pembayaran (WIB). Satu seri, satu sumbu.
// Klik batang → pilih hari untuk rincian di bawah.

interface RevenueDailyChartProps {
  data: revenueDailyRow[]
  selectedDate: string
  onSelectDate: (date: string) => void
}

const SERIES = '#2a78d6'
const SERIES_SELECTED = '#1a4f99'
const SERIES_MUTED = '#a9c8ee'

const fmtDay = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })

const fmtRp = (v: number) => `Rp ${v.toLocaleString('id-ID')}`

const fmtCompact = (v: number) => {
  if (v >= 1_000_000_000) return `Rp ${(v / 1_000_000_000).toFixed(1).replace('.0', '')}M`
  if (v >= 1_000_000) return `Rp ${(v / 1_000_000).toFixed(1).replace('.0', '')}jt`
  if (v >= 1_000) return `Rp ${Math.round(v / 1_000)}rb`
  return `Rp ${v}`
}

export default function RevenueDailyChart({ data, selectedDate, onSelectDate }: RevenueDailyChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  const total = data.reduce((sum, d) => sum + d.revenue, 0)
  const payments = data.reduce((sum, d) => sum + d.payments, 0)

  useEffect(() => {
    if (!canvasRef.current) return
    chartRef.current?.destroy()

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: data.map((d) => fmtDay(d.date)),
        datasets: [
          {
            label: 'Uang masuk',
            data: data.map((d) => d.revenue),
            backgroundColor: data.map((d) =>
              d.date === selectedDate ? SERIES_SELECTED : selectedDate ? SERIES_MUTED : SERIES,
            ),
            hoverBackgroundColor: data.map((d) => (d.date === selectedDate ? SERIES_SELECTED : SERIES)),
            borderRadius: { topLeft: 4, topRight: 4 },
            borderSkipped: 'bottom',
            maxBarThickness: 24,
            categoryPercentage: 0.8,
            barPercentage: 0.9,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 300 },
        onClick: (_, elements) => {
          const idx = elements[0]?.index
          if (idx !== undefined) onSelectDate(data[idx].date)
        },
        onHover: (event, elements) => {
          const target = event.native?.target as HTMLElement | undefined
          if (target) target.style.cursor = elements.length ? 'pointer' : 'default'
        },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#ffffff',
            titleColor: '#0b0b0b',
            bodyColor: '#52514e',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              title: (items) => fmtDay(data[items[0].dataIndex].date),
              label: (item) => {
                const d = data[item.dataIndex]
                const lines = [`Uang masuk: ${fmtRp(d.revenue)}`, `${d.payments} pembayaran`]
                if (d.creditUsed > 0) lines.push(`Credit dipakai: ${fmtRp(d.creditUsed)}`)
                return lines
              },
              footer: () => 'Klik untuk lihat rincian',
            },
            footerColor: '#9ca3af',
            footerFont: { size: 10, weight: 'normal' },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { color: '#e5e7eb' },
            ticks: { color: '#9ca3af', font: { size: 11 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 },
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            border: { display: false },
            ticks: { color: '#9ca3af', font: { size: 11 }, maxTicksLimit: 5, callback: (v) => fmtCompact(Number(v)) },
          },
        },
      },
    })

    return () => chartRef.current?.destroy()
  }, [data, selectedDate, onSelectDate])

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-700">Uang masuk per hari</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Berdasarkan tanggal pembayaran diterima (WIB), 30 hari terakhir. Klik batang untuk melihat rincian.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Total 30 hari</p>
          <p className="text-base font-semibold text-gray-900">{fmtRp(total)}</p>
          <p className="text-[11px] text-gray-400">{payments} pembayaran</p>
        </div>
      </div>
      <div className="relative" style={{ height: 240 }}>
        <canvas ref={canvasRef} aria-label="Grafik uang masuk per hari" role="img" />
      </div>
    </div>
  )
}
