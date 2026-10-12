'use client'

import { stagger } from 'framer-motion'
import { NF_COLORS as C, NF_FONT, origin, useLoopedAnimation } from './useLoopedAnimation'

const STARS = [
  [30, 40, 1.3], [70, 110, 1], [44, 200, 1.1], [86, 270, 0.9], [330, 36, 1.4], [366, 110, 1], [348, 214, 1.2], [310, 286, 0.9],
] as const

// Isi artikel (judul, foto, paragraf) — memudar karena beritanya "tidak ada"
const BLOCKS = [
  { x: 126, y: 102, w: 148, h: 10, fill: C.line },
  { x: 126, y: 116, w: 110, h: 10, fill: C.line },
  { x: 126, y: 134, w: 68, h: 52, fill: C.ice },
  ...[136, 145, 154, 163, 172, 181].map((y) => ({ x: 202, y, w: 72, h: 5, fill: C.mist })),
  ...[196, 205, 214, 223, 232].map((y, i) => ({ x: 126, y, w: i === 4 ? 90 : 148, h: 5, fill: C.mist })),
]

// Koran yang beritanya hilang: isi kembali sebentar → kaca pembesar menyisir halaman,
// isi memudar satu per satu, lembaran terbang → cap 404 dihentakkan ke halaman.
// Keadaan diam (sebelum/sesudah animasi): isi pudar + cap 404 terlihat.
export default function NewsScene({ className }: { className?: string }) {
  const scope = useLoopedAnimation((animate) =>
    animate([
      ['.nf-star', { opacity: [0.35, 1, 0.35] }, { duration: 1.6, delay: stagger(0.1), at: 0 }],
      ['.nf-stamp', { opacity: 0, scale: 1.3 }, { duration: 0.3, at: 0 }],
      ['.nf-block', { opacity: 1 }, { duration: 0.4, at: 0.1 }],
      // Menyisir halaman
      [
        '.nf-glass',
        { x: [0, -150, -40, -150, -60, 0], y: [0, -150, -110, -60, -20, 0] },
        { duration: 2.8, ease: 'easeInOut', at: 0.5 },
      ],
      ['.nf-block', { opacity: 0.12 }, { duration: 0.35, delay: stagger(0.12), at: 0.9 }],
      ['.nf-page-l', { x: [0, -70], y: [0, -50], rotate: [0, -40], opacity: [0, 1, 0] }, { duration: 1.4, at: 1.4 }],
      ['.nf-page-r', { x: [0, 70], y: [0, -30], rotate: [0, 35], opacity: [0, 1, 0] }, { duration: 1.4, at: 1.9 }],
      // Cap 404
      ['.nf-stamp', { opacity: [0, 1], scale: [1.6, 1] }, { duration: 0.35, ease: [0.3, 1.4, 0.6, 1], at: 3.4 }],
      ['.nf-paper', { rotate: [0, -2, 1.5, -1, 0] }, { duration: 0.5, at: 3.7 }],
    ]),
  )

  return (
    <svg ref={scope} viewBox="0 0 400 320" role="img" aria-label="404" className={className}>
      <defs>
        <linearGradient id="nf-news-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.navy2} />
          <stop offset="1" stopColor={C.night} />
        </linearGradient>
      </defs>

      <rect width="400" height="320" fill="url(#nf-news-sky)" />
      {STARS.map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} className="nf-star" cx={cx} cy={cy} r={r} fill={C.ice} opacity={0.35} />
      ))}

      {/* Lembaran yang terbang keluar */}
      <rect className="nf-page-l" x="112" y="70" width="40" height="52" rx="2" fill={C.ice} opacity={0} style={origin('center')} />
      <rect className="nf-page-r" x="248" y="90" width="40" height="52" rx="2" fill={C.ice} opacity={0} style={origin('center')} />

      {/* Koran */}
      <g className="nf-paper" style={origin('center')}>
        <rect x="114" y="56" width="180" height="220" rx="4" fill={C.edge} />
        <rect x="110" y="52" width="180" height="220" rx="4" fill={C.paper} />
        <text x="200" y="78" textAnchor="middle" fontSize="15" fontWeight="800" letterSpacing="3" fill={C.navy} style={NF_FONT}>
          MBS NEWS
        </text>
        <line x1="126" y1="86" x2="274" y2="86" stroke={C.navy} strokeWidth="1.5" />
        <line x1="126" y1="90" x2="274" y2="90" stroke={C.navy} strokeWidth="0.75" />

        {BLOCKS.map((b) => (
          <rect key={`${b.x}-${b.y}`} className="nf-block" x={b.x} y={b.y} width={b.w} height={b.h} rx="1.5" fill={b.fill} opacity={0.12} />
        ))}
        <line x1="126" y1="252" x2="274" y2="252" stroke={C.ice} />

        {/* Cap 404 */}
        <g transform="rotate(-12 200 170)">
          <g className="nf-stamp" style={origin('center')}>
            <rect x="138" y="144" width="124" height="52" rx="6" fill={C.paper} fillOpacity="0.85" stroke={C.blue} strokeWidth="4" />
            <rect x="144" y="150" width="112" height="40" rx="3" fill="none" stroke={C.blue} strokeWidth="1.25" />
            <text x="200" y="182" textAnchor="middle" fontSize="30" fontWeight="800" letterSpacing="5" fill={C.blue} style={NF_FONT}>
              404
            </text>
          </g>
        </g>
      </g>

      {/* Kaca pembesar — posisi diam di pojok kanan bawah koran */}
      <g transform="translate(296 248)">
        <g className="nf-glass">
          <line x1="16" y1="16" x2="38" y2="38" stroke={C.mist} strokeWidth="9" strokeLinecap="round" />
          <circle r="24" fill={C.ice} fillOpacity="0.22" stroke={C.sky} strokeWidth="6" />
          <path d="M-13 -6 a14 14 0 0 1 9 -9" fill="none" stroke={C.paper} strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  )
}
