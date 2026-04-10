"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Room } from "@/src/models/public/roomTypeDetail/publicRoomTypeDetail";
import { useRoomTypeDetailPublic } from "@/src/hooks/query/roomTypes/publicDetail";

// ─── Date Utilities ───────────────────────────────────────────────────────────

const today = new Date().toISOString().slice(0, 10);

function nightsBetween(ci: string, co: string) {
  return Math.max(0, Math.round((new Date(co).getTime() - new Date(ci).getTime()) / 86400000));
}

// ─── Date Picker Modal ────────────────────────────────────────────────────────

function DatePickerModal({ onConfirm }: { onConfirm: (checkin: string, checkout: string) => void }) {
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const nights = checkin && checkout ? nightsBetween(checkin, checkout) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#030D1A]/70 backdrop-blur-sm px-4">
      <div
        className="w-full max-w-sm rounded-3xl p-6 space-y-5"
        style={{ background: "#DDE8F5", border: "0.5px solid #B5CDE8", fontFamily: "'Montserrat', sans-serif" }}
      >
        {/* Header */}
        <div>
          <p className="text-[0.52rem] tracking-[0.2em] uppercase" style={{ color: "#1A56A0" }}>
            Marina by Sand
          </p>
          <div className="w-6 h-px my-2" style={{ background: "#1A56A0", opacity: 0.4 }} />
          <h2
            className="text-[1.6rem] font-light leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#0A1828" }}
          >
            Kapan Anda Menginap?
          </h2>
        </div>

        {/* Check-in */}
        <div className="space-y-1.5">
          <label className="text-[0.58rem] tracking-[0.18em] uppercase" style={{ color: "#2C4E72" }}>
            Check-in
          </label>
          <input
            type="date"
            min={today}
            value={checkin}
            onChange={(e) => {
              setCheckin(e.target.value);
              if (checkout && checkout <= e.target.value) setCheckout("");
            }}
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
            style={{
              background: "#EEF3FA",
              border: "0.5px solid #B5CDE8",
              color: "#0A1828",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#1A56A0")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#B5CDE8")}
          />
        </div>

        {/* Check-out */}
        <div className="space-y-1.5">
          <label className="text-[0.58rem] tracking-[0.18em] uppercase" style={{ color: "#2C4E72" }}>
            Check-out
          </label>
          <input
            type="date"
            min={checkin || today}
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
            disabled={!checkin}
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all disabled:opacity-40"
            style={{
              background: "#EEF3FA",
              border: "0.5px solid #B5CDE8",
              color: "#0A1828",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#1A56A0")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#B5CDE8")}
          />
        </div>

        {/* Nights badge */}
        {nights > 0 && (
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: "#0A1E38" }}
          >
            <span
              className="text-[1.8rem] font-light leading-none"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "#C8DCEF" }}
            >
              {nights}
            </span>
            <span className="text-[0.65rem] tracking-[0.12em] uppercase" style={{ color: "#5B90C9" }}>
              malam
            </span>
          </div>
        )}

        <button
          disabled={!checkin || !checkout || nights < 1}
          onClick={() => onConfirm(checkin, checkout)}
          className="w-full rounded-xl py-3.5 text-[0.65rem] tracking-[0.18em] uppercase font-normal transition-all duration-200 disabled:opacity-40"
          style={{ background: "#0A1828", color: "#C8DCEF" }}
          onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = "#163356" }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#0A1828" }}
        >
          Cari Kamar
        </button>
      </div>
    </div>
  );
}

// ─── Room Card ────────────────────────────────────────────────────────────────

function RoomCard({
  room,
  checkin,
  checkout,
  onSelect,
}: {
  room: Room;
  checkin: string;
  checkout: string;
  onSelect: (room: Room) => void;
}) {
  return (
    <div
      className="relative rounded-2xl transition-all duration-200"
      style={{
        background: room.isAvailable ? "#EEF3FA" : "#E8EEF6",
        border: `0.5px solid ${room.isAvailable ? "#B5CDE8" : "#D0DCE8"}`,
        opacity: room.isAvailable ? 1 : 0.55,
        cursor: room.isAvailable ? "pointer" : "not-allowed",
      }}
      onClick={() => room.isAvailable && onSelect(room)}
      onMouseEnter={(e) => {
        if (room.isAvailable) {
          e.currentTarget.style.background = "#DDE8F5";
          e.currentTarget.style.borderColor = "#1A56A0";
        }
      }}
      onMouseLeave={(e) => {
        if (room.isAvailable) {
          e.currentTarget.style.background = "#EEF3FA";
          e.currentTarget.style.borderColor = "#B5CDE8";
        }
      }}
    >
      {/* Availability dot */}
      <div
        className="absolute top-3 right-3 w-2 h-2 rounded-full"
        style={{ background: room.isAvailable ? "#4CAF8A" : "#C45A5A" }}
      />

      <div className="p-4 space-y-3">
        {/* Room number + floor */}
        <div className="flex items-start justify-between pr-4">
          <div>
            <p className="text-[0.5rem] tracking-[0.18em] uppercase mb-0.5" style={{ color: "#1A56A0" }}>
              Lantai {room.floorId}
            </p>
            <p
              className="text-[1.15rem] font-light leading-none"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "#0A1828" }}
            >
              {room.number}
            </p>
          </div>
          {!room.isAvailable && (
            <span
              className="text-[0.48rem] tracking-[0.1em] uppercase rounded-full px-2 py-0.5"
              style={{ background: "#F5E0E0", color: "#A04040", border: "0.5px solid #D09090" }}
            >
              Tidak Tersedia
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: "#B5CDE8", opacity: 0.5 }} />

        {/* Bed type */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "#DDE8F5" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "#1A56A0" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 12V8a2 2 0 012-2h14a2 2 0 012 2v4M3 12v4a2 2 0 002 2h14a2 2 0 002-2v-4" />
            </svg>
          </div>
          <div>
            <p className="text-[0.65rem] font-medium" style={{ color: "#0A1828" }}>{room.bedType.name}</p>
            <p className="text-[0.55rem]" style={{ color: "#5B90C9" }}>{room.bedType.size}</p>
          </div>
        </div>

        {/* Facility group */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "#DDE8F5" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "#1A56A0" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-[0.65rem] font-medium" style={{ color: "#0A1828" }}>{room.facilityGroup.code}</p>
            {room.facilityGroup.note && (
              <p className="text-[0.55rem] truncate max-w-[110px]" style={{ color: "#5B90C9" }}>{room.facilityGroup.note}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="min-h-screen animate-pulse" style={{ background: "#EEF3FA" }}>
      {/* Hero skeleton */}
      <div className="w-full h-64 md:h-screen" style={{ background: "#DDE8F5" }} />
      <div className="px-5 pt-6 space-y-4">
        <div className="h-3 w-20 rounded-full" style={{ background: "#DDE8F5" }} />
        <div className="h-7 w-44 rounded-xl" style={{ background: "#DDE8F5" }} />
        <div className="h-4 w-60 rounded-full" style={{ background: "#DDE8F5" }} />
        <div className="h-px" style={{ background: "#DDE8F5" }} />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl" style={{ background: "#DDE8F5" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RoomTypeDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const searchParams = useSearchParams();

  const checkin = searchParams.get("checkIn") ?? "";
  const checkout = searchParams.get("checkOut") ?? "";
  const showDatePicker = !checkin;

  const { data, isLoading, error } = useRoomTypeDetailPublic(id);
  const roomType = data?.data;

  const [filter, setFilter] = useState<"all" | "available">("all");

  const handleDateConfirm = (ci: string, co: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("checkin", ci);
    url.searchParams.set("checkout", co);
    router.replace(url.pathname + url.search);
  };

  const handleSelectRoom = (room: Room) => {
    router.push(`/booking/room/${room.id}?checkin=${checkin}&checkout=${checkout}`);
  };

  const filteredRooms =
    roomType?.rooms.filter((r) => (filter === "available" ? r.isAvailable : true)) ?? [];

  const availableCount = roomType?.rooms.filter((r) => r.isAvailable).length ?? 0;
  const nights = checkin && checkout ? nightsBetween(checkin, checkout) : 0;

  if (isLoading) return <Skeleton />;
  if (error || !roomType) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "#EEF3FA" }}>
        <div className="text-center space-y-3">
          <p className="text-4xl">🏨</p>
          <p
            className="text-lg font-light"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#0A1828" }}
          >
            Kamar tidak ditemukan
          </p>
          <p className="text-xs" style={{ color: "#5B90C9" }}>Coba kembali atau pilih tipe lain</p>
          <button
            onClick={() => router.back()}
            className="mt-2 text-xs tracking-[0.15em] uppercase underline underline-offset-4"
            style={{ color: "#1A56A0" }}
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {showDatePicker && <DatePickerModal onConfirm={handleDateConfirm} />}

      <div className="min-h-screen" style={{ background: "#EEF3FA", fontFamily: "'Montserrat', sans-serif" }}>

        {/* ══════════════════════════════════════════
            DESKTOP LAYOUT (≥ md) — side by side
        ══════════════════════════════════════════ */}
        <div className="hidden md:flex h-screen">

          {/* Left — sticky hero image */}
          <div className="w-1/2 relative sticky top-0 h-screen overflow-hidden" style={{ background: "#0A1E38" }}>
            {roomType.image?.url ? (
              <img
                src={roomType.image.url}
                alt={roomType.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#1A56A0", opacity: 0.3 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                </svg>
              </div>
            )}
            {/* Overlay gradient */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, #030D1A 10%, transparent 60%)" }}
            />
            {/* Back button */}
            <button
              onClick={() => router.back()}
              className="absolute top-6 left-6 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
              style={{ background: "#05111F80", border: "0.5px solid #1A56A0" }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "#C8DCEF" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            {/* Hero text overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-[0.52rem] tracking-[0.2em] uppercase mb-2" style={{ color: "#5B90C9" }}>
                Tipe Kamar
              </p>
              <div className="w-6 h-px mb-3" style={{ background: "#1A56A0", opacity: 0.6 }} />
              <h1
                className="text-[2rem] font-light leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "#C8DCEF" }}
              >
                {roomType.name}
              </h1>
              {roomType.desk && (
                <p className="text-[0.68rem] mt-2 leading-relaxed max-w-xs" style={{ color: "#6A9EC5" }}>
                  {roomType.desk}
                </p>
              )}
            </div>
          </div>

          {/* Right — scrollable content */}
          <div className="w-1/2 overflow-y-auto h-screen pb-10">
            <div className="px-8 pt-8 space-y-6">

              {/* Date bar */}
              {checkin && checkout && (
                <button
                  onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.delete("checkin");
                    url.searchParams.delete("checkout");
                    router.replace(url.pathname);
                  }}
                  className="w-full flex items-center justify-between rounded-2xl px-5 py-3.5 transition-all"
                  style={{ background: "#DDE8F5", border: "0.5px solid #B5CDE8" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#1A56A0")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#B5CDE8")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#EEF3FA" }}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "#1A56A0" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-[0.5rem] tracking-[0.18em] uppercase" style={{ color: "#5B90C9" }}>Tanggal Menginap</p>
                      <p className="text-xs font-medium" style={{ color: "#0A1828" }}>
                        {checkin} <span style={{ color: "#1A56A0" }}>→</span> {checkout}
                        <span className="ml-2 font-normal" style={{ color: "#5B90C9" }}>({nights} malam)</span>
                      </p>
                    </div>
                  </div>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "#5B90C9" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                  </svg>
                </button>
              )}

              {/* Divider */}
              <div className="h-px" style={{ background: "#B5CDE8", opacity: 0.5 }} />

              {/* Availability header + filter */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[0.52rem] tracking-[0.18em] uppercase" style={{ color: "#1A56A0" }}>
                    Ketersediaan Kamar
                  </p>
                  <p className="text-sm font-light mt-0.5" style={{ color: "#0A1828" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>{availableCount}</span>
                    {" "}dari {roomType.rooms.length} tersedia
                  </p>
                </div>
                <button
                  onClick={() => setFilter(f => f === "all" ? "available" : "all")}
                  className="text-[0.6rem] tracking-[0.12em] uppercase px-3.5 py-1.5 rounded-full transition-colors duration-200"
                  style={
                    filter === "available"
                      ? { background: "#0A1828", color: "#C8DCEF", border: "0.5px solid #0A1828" }
                      : { background: "#EEF3FA", color: "#2C4E72", border: "0.5px solid #B5CDE8" }
                  }
                >
                  {filter === "available" ? "Semua" : "Tersedia saja"}
                </button>
              </div>

              {/* Room grid */}
              {filteredRooms.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <p className="text-3xl">🛏️</p>
                  <p className="text-sm font-light" style={{ color: "#0A1828" }}>Tidak ada kamar tersedia</p>
                  <p className="text-xs" style={{ color: "#5B90C9" }}>Coba ubah tanggal menginap</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {filteredRooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      checkin={checkin}
                      checkout={checkout}
                      onSelect={handleSelectRoom}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            MOBILE LAYOUT (< md)
        ══════════════════════════════════════════ */}
        <div className="md:hidden">

          {/* Hero image — tall, full bleed */}
          <div className="relative w-full overflow-hidden" style={{ height: "65vw", minHeight: 240, maxHeight: 360, background: "#0A1E38" }}>
            {roomType.image?.url ? (
              <img
                src={roomType.image.url}
                alt={roomType.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#1A56A0", opacity: 0.3 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159" />
                </svg>
              </div>
            )}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, #030D1A 15%, transparent 65%)" }}
            />
            {/* Back button */}
            <button
              onClick={() => router.back()}
              className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm"
              style={{ background: "#05111F80", border: "0.5px solid #1A56A0" }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "#C8DCEF" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
              <p className="text-[0.48rem] tracking-[0.18em] uppercase mb-1" style={{ color: "#5B90C9" }}>
                Tipe Kamar
              </p>
              <h1
                className="text-[1.5rem] font-light leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "#C8DCEF" }}
              >
                {roomType.name}
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="px-5 pt-5 pb-10 space-y-5">

            {/* Description */}
            {roomType.desk && (
              <p className="text-[0.72rem] leading-relaxed" style={{ color: "#2C4E72" }}>
                {roomType.desk}
              </p>
            )}

            {/* Date row */}
            {checkin && checkout && (
              <button
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.delete("checkin");
                  url.searchParams.delete("checkout");
                  router.replace(url.pathname);
                }}
                className="w-full flex items-center justify-between rounded-2xl px-4 py-3 transition-all"
                style={{ background: "#DDE8F5", border: "0.5px solid #B5CDE8" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#EEF3FA" }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "#1A56A0" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-[0.48rem] tracking-[0.18em] uppercase" style={{ color: "#5B90C9" }}>Tanggal Menginap</p>
                    <p className="text-[0.7rem] font-medium" style={{ color: "#0A1828" }}>
                      {checkin} <span style={{ color: "#1A56A0" }}>→</span> {checkout}
                      <span className="ml-1 font-normal" style={{ color: "#5B90C9" }}>({nights} malam)</span>
                    </p>
                  </div>
                </div>
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "#5B90C9" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
              </button>
            )}

            {/* Divider */}
            <div className="h-px" style={{ background: "#B5CDE8", opacity: 0.5 }} />

            {/* Availability header + filter */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[0.5rem] tracking-[0.18em] uppercase" style={{ color: "#1A56A0" }}>
                  Ketersediaan
                </p>
                <p className="text-sm font-light mt-0.5" style={{ color: "#0A1828" }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem" }}>{availableCount}</span>
                  {" "}dari {roomType.rooms.length} tersedia
                </p>
              </div>
              <button
                onClick={() => setFilter(f => f === "all" ? "available" : "all")}
                className="text-[0.58rem] tracking-[0.1em] uppercase px-3 py-1.5 rounded-full transition-colors duration-200"
                style={
                  filter === "available"
                    ? { background: "#0A1828", color: "#C8DCEF", border: "0.5px solid #0A1828" }
                    : { background: "#EEF3FA", color: "#2C4E72", border: "0.5px solid #B5CDE8" }
                }
              >
                {filter === "available" ? "Semua" : "Tersedia saja"}
              </button>
            </div>

            {/* Room grid */}
            {filteredRooms.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <p className="text-3xl">🛏️</p>
                <p className="text-sm font-light" style={{ color: "#0A1828" }}>Tidak ada kamar tersedia</p>
                <p className="text-xs" style={{ color: "#5B90C9" }}>Coba ubah tanggal menginap</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    checkin={checkin}
                    checkout={checkout}
                    onSelect={handleSelectRoom}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}