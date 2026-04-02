'use client'

import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

export interface RevenueOccupancyData {
  date: string
  revenue: number
  occupancy: number
}

interface RevenueOccupancyChartProps {
  data: RevenueOccupancyData[]
}

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })

const fmtRevenue = (v: number) =>
  v >= 1000000 ? `Rp ${(v / 1000000).toFixed(0)}M` : `Rp ${v.toLocaleString()}`

export default function RevenueOccupancyChart({ data }: RevenueOccupancyChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const revenues = data.map((r) => r.revenue)
  const occupancies = data.map((r) => r.occupancy)
  const labels = data.map((r) => fmtDate(r.date))

  const maxRev = Math.max(...revenues)
  const minRev = Math.min(...revenues)
  const maxOcc = Math.max(...occupancies)
  const minOcc = Math.min(...occupancies)

  const tickCount = 6
  const step = Math.floor(data.length / (tickCount - 1))
  const tickIndices = Array.from({ length: tickCount }, (_, i) =>
    i === tickCount - 1 ? data.length - 1 : i * step
  )

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) chartRef.current.destroy()

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Revenue',
            data: revenues,
            borderColor: '#378ADD',
            borderWidth: 2,
            tension: 0.45,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#378ADD',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
            yAxisID: 'y',
            fill: false,
          },
          {
            label: 'Occupancy',
            data: occupancies,
            borderColor: '#E24B4A',
            borderWidth: 2,
            tension: 0.45,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#E24B4A',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
            yAxisID: 'y2',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        layout: { padding: { top: 8, bottom: 4 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: false,
            external: ({ chart, tooltip }) => {
              const el = tooltipRef.current
              if (!el) return
              if (tooltip.opacity === 0) { el.style.display = 'none'; return }
              const idx = tooltip.dataPoints[0].dataIndex
              const d = data[idx]
              el.innerHTML = `
                <div style="font-size:11px;color:#6b7280;margin-bottom:6px;font-weight:600;letter-spacing:0.02em;">${fmtDate(d.date)}</div>
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                  <span style="width:8px;height:8px;border-radius:2px;background:#378ADD;display:inline-block;flex-shrink:0;"></span>
                  <span style="font-size:12px;color:#111827;font-weight:500;">${fmtRevenue(d.revenue)}</span>
                </div>
                <div style="display:flex;align-items:center;gap:6px;">
                  <span style="width:8px;height:8px;border-radius:2px;background:#E24B4A;display:inline-block;flex-shrink:0;"></span>
                  <span style="font-size:12px;color:#111827;font-weight:500;">Occupancy: ${d.occupancy}%</span>
                </div>
              `
              let left = tooltip.caretX + 14
              if (left + 172 > chart.canvas.offsetWidth) left = tooltip.caretX - 172
              el.style.display = 'block'
              el.style.left = `${left}px`
              el.style.top = `${tooltip.caretY - 24}px`
            },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(0,0,0,0.05)', drawTicks: false },
            border: { display: false },
            ticks: {
              color: '#9ca3af',
              font: { size: 11 },
              maxRotation: 0,
              autoSkip: false,
              padding: 8,
              callback: (_, i) => tickIndices.includes(i) ? labels[i] : '',
            },
          },
          y: {
            display: false,
            min: minRev * 0.9,
            max: maxRev * 1.05,
          },
          y2: {
            display: false,
            min: minOcc * 0.85,
            max: maxOcc * 1.1,
          },
        },
      },
    })

    return () => { chartRef.current?.destroy() }
  }, [data])

  const leftSteps = [maxRev, (maxRev + minRev) / 2, minRev]
  const rightSteps = [maxOcc, Math.round((maxOcc + minOcc) / 2), minOcc]

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 p-5 mt-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <span className="text-sm font-semibold text-gray-600 tracking-wide">Last 30 days</span>
        <div className="flex gap-5">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: '#378ADD' }} />
            Revenue (IDR)
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: '#E24B4A' }} />
            Occupancy
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-stretch gap-0">
        {/* Y-axis left */}
        <div className="flex flex-col justify-between pr-3 text-right" style={{ minWidth: 56, paddingBottom: 28 }}>
          {leftSteps.map((v, i) => (
            <span key={i} className="text-xs text-gray-400 leading-none">{fmtRevenue(v)}</span>
          ))}
        </div>

        {/* Canvas wrapper */}
        <div className="flex-1 relative" style={{ height: 240 }}>
          <div
            ref={tooltipRef}
            className="absolute z-10 pointer-events-none rounded-xl px-3 py-2.5"
            style={{
              display: 'none',
              minWidth: 160,
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}
          />
          <canvas ref={canvasRef} />
        </div>

        {/* Y-axis right */}
        <div className="flex flex-col justify-between pl-3 text-left" style={{ minWidth: 36, paddingBottom: 28 }}>
          {rightSteps.map((v, i) => (
            <span key={i} className="text-xs font-medium leading-none" style={{ color: '#E24B4A' }}>{v}%</span>
          ))}
        </div>
      </div>
    </div>
  )
}