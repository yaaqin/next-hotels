'use client'
import { initFunc } from '@/src/libs/initialFunc'
import React from 'react'

interface ActionButtonState {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  label?: string
  className?: string
  disable?: boolean
  style?: 'normal' | 'danger'
}
export default function Buttons({
  onClick = () => initFunc(),
  label = 'Button',
  className,
  disable = false,
  style = 'normal'
}: ActionButtonState) {
  return (
    <button
      disabled={disable}
      onClick={onClick}
      className={`${disable ? 'cursor-not-allowed bg-gray-300 text-white' : 'cursor-pointer'} ${style === 'normal' ? 'border border-black' : style === 'danger' ? 'bg-red-500 text-white' : null} text-xs md:text-sm px-4 md:px-8 py-1 md:py-2 rounded-lg text-nowrap capitalize ${className}`}>
      {label}
    </button>
  )
}
