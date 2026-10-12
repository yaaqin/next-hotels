'use client'

import { stagger } from 'framer-motion'
import { NF_COLORS as C, NF_FONT, origin, useLoopedAnimation } from './useLoopedAnimation'

const STARS = [
  [36, 42, 1.4], [78, 88, 1], [108, 30, 1.2], [250, 34, 1.1], [300, 96, 1], [372, 120, 1.2],
  [60, 150, 0.9], [130, 120, 0.8], [24, 210, 1.1], [376, 200, 0.9], [216, 70, 0.8],
] as const

// Orang tersesat: jalan sambil pegang peta → celingak-celinguk → tanda tanya muncul,
// papan petunjuk berputar-putar → balik badan dan kembali ke tempat semula.
export default function LostScene({ className }: { className?: string }) {
  const scope = useLoopedAnimation((animate) =>
    animate([
      ['.nf-star', { opacity: [0.35, 1, 0.35] }, { duration: 1.6, delay: stagger(0.08), at: 0 }],
      // Jalan ke kanan
      ['.nf-walker', { x: [0, 40] }, { duration: 1.2, ease: 'easeInOut', at: 0 }],
      ['.nf-bob', { y: [0, -3, 0, -3, 0, -3, 0] }, { duration: 1.2, at: 0 }],
      ['.nf-leg-l', { rotate: [0, 18, -18, 18, -18, 0] }, { duration: 1.2, at: 0 }],
      ['.nf-leg-r', { rotate: [0, -18, 18, -18, 18, 0] }, { duration: 1.2, at: 0 }],
      // Celingak-celinguk
      ['.nf-face', { scaleX: -1 }, { duration: 0.15, at: 1.35 }],
      ['.nf-face', { scaleX: 1 }, { duration: 0.15, at: 1.95 }],
      // Buka peta, garuk kepala, tanda tanya
      ['.nf-map', { rotate: [0, -22, -14, -22, 0] }, { duration: 1.3, at: 2.2 }],
      ['.nf-head', { rotate: [0, -12, 10, -6, 0] }, { duration: 1.2, at: 2.4 }],
      ['.nf-qm', { opacity: [0, 1, 1, 0], y: [8, -6, -10, -18], scale: [0.4, 1.15, 1, 1] }, { duration: 1.7, delay: stagger(0.2), at: 2.3 }],
      // Papan petunjuk ikut bingung
      ['.nf-sign-a', { rotate: [0, -32, 26, -12, 0] }, { duration: 1.3, at: 2.6 }],
      ['.nf-sign-b', { rotate: [0, 32, -26, 12, 0] }, { duration: 1.3, at: 2.7 }],
      // Balik badan, kembali
      ['.nf-face', { scaleX: -1 }, { duration: 0.15, at: 3.9 }],
      ['.nf-walker', { x: 0 }, { duration: 1.0, ease: 'easeInOut', at: 4.0 }],
      ['.nf-bob', { y: [0, -3, 0, -3, 0] }, { duration: 1.0, at: 4.0 }],
      ['.nf-leg-l', { rotate: [0, -18, 18, -18, 0] }, { duration: 1.0, at: 4.0 }],
      ['.nf-leg-r', { rotate: [0, 18, -18, 18, 0] }, { duration: 1.0, at: 4.0 }],
      ['.nf-face', { scaleX: 1 }, { duration: 0.15, at: 5.0 }],
    ]),
  )

  return (
    <svg ref={scope} viewBox="0 0 400 320" role="img" aria-label="404" className={className}>
      <defs>
        <linearGradient id="nf-lost-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.navy2} />
          <stop offset="1" stopColor={C.night} />
        </linearGradient>
      </defs>

      {/* Langit malam */}
      <rect width="400" height="320" fill="url(#nf-lost-sky)" />
      {STARS.map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} className="nf-star" cx={cx} cy={cy} r={r} fill={C.ice} opacity={0.35} />
      ))}
      <circle cx="338" cy="58" r="18" fill={C.ice} />
      <circle cx="346" cy="52" r="16" fill={C.navy2} />

      {/* Tanah + jalan setapak yang bercabang */}
      <rect x="0" y="262" width="400" height="58" fill={C.night} />
      <line x1="0" y1="262" x2="400" y2="262" stroke={C.line} strokeWidth="1.5" />
      <g fill="none" stroke={C.line} strokeWidth="2" strokeDasharray="6 8" strokeLinecap="round">
        <path d="M0 296 C 80 280, 150 300, 230 286" />
        <path d="M230 286 C 280 276, 330 268, 400 272" />
        <path d="M230 286 C 270 296, 320 306, 400 312" />
        <path d="M230 286 C 220 300, 190 312, 160 320" />
      </g>

      {/* Papan petunjuk */}
      <rect x="288" y="182" width="6" height="80" rx="2" fill={C.line} />
      <g className="nf-sign-a" style={origin('left center')}>
        <polygon points="291,188 335,188 345,197 335,206 291,206" fill={C.sky} />
        <text x="318" y="202" textAnchor="middle" fontSize="13" fontWeight="800" fill={C.navy} style={NF_FONT}>
          ?
        </text>
      </g>
      <g className="nf-sign-b" style={origin('right center')}>
        <polygon points="291,212 247,212 237,221 247,230 291,230" fill={C.mist} />
        <text x="264" y="226" textAnchor="middle" fontSize="13" fontWeight="800" fill={C.navy} style={NF_FONT}>
          ?
        </text>
      </g>
      <circle cx="291" cy="182" r="4" fill={C.mist} />

      {/* Orangnya */}
      <g className="nf-walker">
        {/* Tanda tanya di atas kepala */}
        {[
          [150, 152, 18, C.sky],
          [172, 140, 26, C.ice],
          [196, 152, 16, C.mist],
        ].map(([x, y, size, fill]) => (
          <text
            key={x}
            className="nf-qm"
            x={x}
            y={y}
            textAnchor="middle"
            fontSize={size}
            fontWeight="800"
            fill={fill as string}
            opacity={0}
            style={{ ...NF_FONT, ...origin('center') }}
          >
            ?
          </text>
        ))}

        <g className="nf-face" style={origin('center')}>
          <g className="nf-bob">
            {/* Ransel */}
            <rect x="153" y="197" width="12" height="28" rx="4" fill={C.sky} />
            {/* Kaki */}
            <rect className="nf-leg-l" x="163" y="230" width="7" height="32" rx="3.5" fill={C.line} style={origin('center top')} />
            <rect className="nf-leg-r" x="172" y="230" width="7" height="32" rx="3.5" fill={C.edge} style={origin('center top')} />
            {/* Badan */}
            <rect x="160" y="192" width="22" height="42" rx="9" fill={C.blue} />
            {/* Kepala + topi */}
            <g className="nf-head" style={origin('center bottom')}>
              <circle cx="171" cy="179" r="12" fill={C.ice} />
              <path d="M159 176 a12 12 0 0 1 24 0 z" fill={C.sky} />
              <rect x="178" y="173" width="11" height="3.5" rx="1.75" fill={C.sky} />
              <circle cx="177" cy="181" r="1.6" fill={C.navy} />
            </g>
            {/* Tangan + peta */}
            <g className="nf-map" style={origin('left center')}>
              <line x1="176" y1="204" x2="190" y2="211" stroke={C.ice} strokeWidth="5" strokeLinecap="round" />
              <rect x="186" y="199" width="27" height="21" rx="2" fill={C.paper} />
              <line x1="195" y1="199" x2="195" y2="220" stroke={C.ice} />
              <line x1="204" y1="199" x2="204" y2="220" stroke={C.ice} />
              <path d="M189 216 l6 -6 l5 4 l7 -9" fill="none" stroke={C.blue} strokeWidth="1.5" strokeDasharray="2 2" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}
