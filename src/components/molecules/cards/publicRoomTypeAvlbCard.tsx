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
      return <RulerIcon size={16} />
    case "bar":
      return <MarketingIcon size={16} />
    case "bath":
      return <Bathtub01Icon size={16} />
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
    <div
      className="p-5 rounded-2xl"
      style={{
        background: "#DDE8F5",
        border: "0.5px solid #B5CDE8",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* ── IMAGE ── */}
        <div className="lg:col-span-5 relative">
          {collectionLabel && (
            <div
              className="absolute top-3 left-3 text-[0.52rem] tracking-[0.18em] uppercase px-3 py-1.5 rounded-full"
              style={{
                background: "#05111F",
                color: "#5B90C9",
                border: "0.5px solid #1A56A0",
              }}
            >
              {collectionLabel}
            </div>
          )}
          <img
            src={image}
            alt={title}
            className="w-full h-72 lg:h-full object-cover rounded-xl"
            style={{ minHeight: 240 }}
          />
        </div>

        {/* ── INFO ── */}
        <div className="lg:col-span-4 flex flex-col justify-between py-1">
          <div className="space-y-3">

            {/* Title */}
            <div>
              <p
                className="text-[0.52rem] tracking-[0.2em] uppercase mb-1"
                style={{ color: "#1A56A0" }}
              >
                {floorLabel}
              </p>
              <div className="w-6 h-px mb-3" style={{ background: "#1A56A0", opacity: 0.4 }} />
              <h2
                className="text-[1.35rem] font-light tracking-[0.1em] uppercase leading-tight"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#0A1828",
                }}
              >
                {title}
              </h2>
            </div>

            {/* Availability & guests */}
            <div className="space-y-1 pt-1">
              <p
                className="text-[0.68rem] tracking-[0.05em]"
                style={{ color: "#1A56A0" }}
              >
                {bookedInfo}
              </p>
              <p
                className="text-[0.68rem]"
                style={{ color: "#2C4E72" }}
              >
                Maksimal {maxGuest} tamu
              </p>
            </div>

            {/* Features */}
            <div className="space-y-2.5 pt-3">
              <div
                className="flex items-center gap-3 text-[0.65rem] tracking-[0.12em] uppercase"
                style={{ color: "#2C4E72" }}
              >
                <RulerIcon size={14} style={{ color: "#1A56A0", flexShrink: 0 }} />
                <span>Luas rata-rata {size}</span>
              </div>

              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-[0.65rem] tracking-[0.12em] uppercase"
                  style={{ color: "#2C4E72" }}
                >
                  <span style={{ color: "#1A56A0", flexShrink: 0 }}>
                    {renderIcon(feature.icon)}
                  </span>
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* View detail link */}
          <button
            onClick={onViewDetail}
            className="mt-6 text-left text-[0.63rem] tracking-[0.18em] uppercase transition-colors duration-200 w-fit"
            style={{ color: "#1A56A0", textDecoration: "underline", textUnderlineOffset: "4px" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0A1828")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#1A56A0")}
          >
            Lihat Perincian Kamar
          </button>
        </div>

        {/* ── PRICE ── */}
        <div
          className="lg:col-span-3 p-6 flex flex-col justify-between rounded-xl"
          style={{ background: "#0A1E38" }}
        >
          <div>
            <p
              className="text-[0.55rem] tracking-[0.18em] uppercase mb-1"
              style={{ color: "#5B90C9" }}
            >
              Dari
            </p>
            <div className="w-5 h-px mb-3" style={{ background: "#1A56A0", opacity: 0.5 }} />
            <h3
              className="font-light leading-none"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#C8DCEF",
                fontSize: "1.6rem",
              }}
            >
              {formatCurrency(price, currency)}
              <span
                className="text-sm ml-1"
                style={{ color: "#6A9EC5", fontFamily: "'Montserrat', sans-serif" }}
              >
                /malam
              </span>
            </h3>

            <p
              className="text-[0.63rem] mt-3 leading-relaxed"
              style={{ color: "#3A6A96" }}
            >
              Dikenakan pajak dan biaya tambahan.
            </p>

            <p
              className="text-[0.65rem] mt-4 leading-relaxed"
              style={{ color: "#6A9EC5" }}
            >
              {bedInfo}
            </p>
          </div>

          <button
            onClick={onViewPackage}
            className="mt-6 py-3.5 rounded-xl text-[0.65rem] tracking-[0.18em] uppercase font-normal transition-all duration-300"
            style={{ background: "#EEF3FA", color: "#0A1828" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#C8DCEF"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#EEF3FA"
            }}
          >
            Reserve Now
          </button>
        </div>

      </div>
    </div>
  )
}