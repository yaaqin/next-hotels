'use client'

import { useAnimate, useReducedMotion } from 'framer-motion'
import { useEffect } from 'react'

// Satu putaran ±5 detik, diulang tiap 20 detik
const REPEAT_MS = 20_000
const FIRST_DELAY_MS = 400

type Animate = ReturnType<typeof useAnimate>[1]

// Jalankan `play` sekali setelah halaman tampil lalu tiap REPEAT_MS.
// prefers-reduced-motion → adegan tetap diam di keadaan awalnya.
export function useLoopedAnimation(play: (animate: Animate) => { stop: () => void }) {
  const [scope, animate] = useAnimate()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) return
    let controls: { stop: () => void } | undefined
    const run = () => {
      controls?.stop()
      controls = play(animate)
    }
    const first = setTimeout(run, FIRST_DELAY_MS)
    const loop = setInterval(run, REPEAT_MS)
    return () => {
      clearTimeout(first)
      clearInterval(loop)
      controls?.stop()
    }
    // play statis per adegan
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate, reduceMotion])

  return scope
}

// Palet public (RLP / home)
export const NF_COLORS = {
  night: '#030D1A',
  navy: '#0A1828',
  navy2: '#0A1E38',
  line: '#2C4E72',
  edge: '#163356',
  blue: '#1A56A0',
  sky: '#5B90C9',
  mist: '#6A9EC5',
  ice: '#C8DCEF',
  paper: '#EEF3FA',
}

export const NF_FONT = { fontFamily: "'Montserrat', sans-serif" }

// Transform SVG berporos di kotak elemen itu sendiri
export const origin = (transformOrigin: string) => ({ transformBox: 'fill-box' as const, transformOrigin })
