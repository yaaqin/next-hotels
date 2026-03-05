"use client"

import { Bathtub01Icon, MarketingIcon, RulerIcon } from "hugeicons-react"

export interface RoomFeature {
  icon: "size" | "bar" | "bath"
  label: string
}

export interface RoomCardProps {
  image: string
  collectionLabel?: string
  title: string
  floorLabel: string
  bookedInfo: string
  maxGuest: number
  size: string
  features: RoomFeature[]
  price: number
  currency?: string
  bedInfo: string
  onViewDetail?: () => void
  onViewPackage?: () => void
}

const formatCurrency = (value: number, currency = "IDR") => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

const renderIcon = (type: RoomFeature["icon"]) => {
  switch (type) {
    case "size":
      return <RulerIcon size={18} />
    case "bar":
      return <MarketingIcon size={18} />
    case "bath":
      return <Bathtub01Icon size={18} />
    default:
      return null
  }
}

export default function RoomAvlbCard({
  image,
  collectionLabel,
  title,
  floorLabel,
  bookedInfo,
  maxGuest,
  size,
  features,
  price,
  currency = "IDR",
  bedInfo,
  onViewDetail,
  onViewPackage,
}: RoomCardProps) {
  return (
    <div className="border bg-[#d7d6cf] p-6 rounded-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* IMAGE */}
        <div className="lg:col-span-5 relative">
          {collectionLabel && (
            <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-3 py-1">
              {collectionLabel}
            </div>
          )}
          <img
            src={image}
            alt={title}
            className="w-full h-120 object-cover rounded-xl"
          />
        </div>

        {/* INFO */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-2xl tracking-[0.15em] uppercase">
            {title}
          </h2>

          <p className="uppercase tracking-[0.25em] text-sm">
            {floorLabel}
          </p>

          <p className="text-sm text-gray-700">{bookedInfo}</p>
          <p className="text-sm">Maksimal {maxGuest} tamu</p>

          <div className="space-y-3 pt-4 text-sm tracking-[0.2em] uppercase">
            <div className="flex items-center gap-3">
              <RulerIcon size={18} />
              <span>Luas rata-rata {size}</span>
            </div>

            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                {renderIcon(feature.icon)}
                <span>{feature.label}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onViewDetail}
            className="pt-6 underline tracking-[0.2em] uppercase text-sm"
          >
            Lihat Perincian Kamar
          </button>
        </div>

        {/* PRICE */}
        <div className="lg:col-span-3 bg-[#cfcfc4] p-6 flex flex-col justify-between rounded-xl">
          <div>
            <p className="text-sm mb-2">Dari</p>
            <h3 className="text-3xl font-light">
              {formatCurrency(price, currency)}
              <span className="text-base">/malam</span>
            </h3>

            <p className="text-sm mt-3 text-gray-700">
              Dikenakan pajak dan biaya tambahan.
            </p>

            <p className="text-sm mt-4">{bedInfo}</p>
          </div>

          <button
            onClick={onViewPackage}
            className="mt-6 bg-black text-white py-3 uppercase tracking-[0.2em] text-sm hover:opacity-90 transition rounded-md"
          >
            Reservation
          </button>
        </div>

      </div>
    </div>
  )
}