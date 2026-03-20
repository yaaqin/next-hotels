"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Room } from "@/src/models/public/roomTypeDetail/publicRoomTypeDetail";
import { useRoomTypeDetailPublic } from "@/src/hooks/query/roomTypes/publicDetail";
import Images from "@/src/components/atoms/images";

// ─── Date Picker Modal ────────────────────────────────────────────────────────
function DatePickerModal({ onConfirm }: { onConfirm: (checkin: string, checkout: string) => void }) {
    const [checkin, setCheckin] = useState("");
    const [checkout, setCheckout] = useState("");
    const today = new Date().toISOString().slice(0, 10);

    const nights =
        checkin && checkout
            ? Math.max(0, Math.round((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000))
            : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="w-full max-w-sm bg-[#F7F4EF] rounded-3xl p-6 shadow-2xl space-y-5">
                {/* Header */}
                <div>
                    <p className="text-xs font-semibold tracking-widest text-[#A89070] uppercase">Pilih Tanggal</p>
                    <h2 className="text-2xl font-bold text-[#1A1512] mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Kapan kamu menginap?
                    </h2>
                </div>

                {/* Checkin */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold tracking-widest text-[#A89070] uppercase">Check-in</label>
                    <input
                        type="date"
                        min={today}
                        value={checkin}
                        onChange={(e) => {
                            setCheckin(e.target.value);
                            if (checkout && checkout <= e.target.value) setCheckout("");
                        }}
                        className="w-full bg-white border border-[#E8E0D5] rounded-xl px-4 py-3 text-[#1A1512] text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A882]"
                    />
                </div>

                {/* Checkout */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold tracking-widest text-[#A89070] uppercase">Check-out</label>
                    <input
                        type="date"
                        min={checkin || today}
                        value={checkout}
                        onChange={(e) => setCheckout(e.target.value)}
                        disabled={!checkin}
                        className="w-full bg-white border border-[#E8E0D5] rounded-xl px-4 py-3 text-[#1A1512] text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A882] disabled:opacity-40"
                    />
                </div>

                {/* Nights badge */}
                {nights > 0 && (
                    <div className="flex items-center gap-2 bg-[#1A1512] text-[#F7F4EF] rounded-xl px-4 py-3">
                        <span className="text-2xl font-bold">{nights}</span>
                        <span className="text-sm text-[#A89070]">malam</span>
                    </div>
                )}

                <button
                    disabled={!checkin || !checkout || nights < 1}
                    onClick={() => onConfirm(checkin, checkout)}
                    className="w-full bg-[#1A1512] text-[#F7F4EF] font-semibold rounded-xl py-3.5 text-sm tracking-wide disabled:opacity-40 transition-opacity hover:opacity-90"
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
            className={`relative rounded-2xl border transition-all duration-200 ${room.isAvailable
                    ? "border-[#E8E0D5] bg-white hover:border-[#C4A882] hover:shadow-md cursor-pointer"
                    : "border-[#F0EBE3] bg-[#FAF8F5] opacity-60 cursor-not-allowed"
                }`}
            onClick={() => room.isAvailable && onSelect(room)}
        >
            {/* Availability dot */}
            <div
                className={`absolute top-3 right-3 w-2 h-2 rounded-full ${room.isAvailable ? "bg-emerald-400" : "bg-red-300"
                    }`}
            />

            <div className="p-4 space-y-3">
                {/* Room number + floor */}
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-[10px] font-semibold tracking-widest text-[#A89070] uppercase">Lantai {room.floorId}</p>
                        <p className="text-lg font-bold text-[#1A1512]" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {room.number}
                        </p>
                    </div>
                    {!room.isAvailable && (
                        <span className="text-[10px] font-semibold bg-red-50 text-red-400 border border-red-100 rounded-full px-2 py-0.5">
                            Tidak Tersedia
                        </span>
                    )}
                </div>

                {/* Bed type */}
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#F7F4EF] flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#A89070]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 12V8a2 2 0 012-2h14a2 2 0 012 2v4M3 12v4a2 2 0 002 2h14a2 2 0 002-2v-4" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-[#1A1512]">{room.bedType.name}</p>
                        <p className="text-[10px] text-[#A89070]">{room.bedType.size}</p>
                    </div>
                </div>

                {/* Facility group */}
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#F7F4EF] flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#A89070]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-[#1A1512]">{room.facilityGroup.code}</p>
                        {room.facilityGroup.note && (
                            <p className="text-[10px] text-[#A89070] truncate max-w-[120px]">{room.facilityGroup.note}</p>
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
        <div className="min-h-screen bg-[#F7F4EF] animate-pulse">
            <div className="w-full h-56 bg-[#E8E0D5]" />
            <div className="px-5 pt-6 space-y-4">
                <div className="h-5 w-24 bg-[#E8E0D5] rounded-full" />
                <div className="h-8 w-48 bg-[#E8E0D5] rounded-xl" />
                <div className="h-4 w-64 bg-[#E8E0D5] rounded-full" />
                <div className="h-px bg-[#E8E0D5] my-4" />
                <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-28 bg-[#E8E0D5] rounded-2xl" />
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

    if (isLoading) return <Skeleton />;
    if (error || !roomType) {
        return (
            <div className="min-h-screen bg-[#F7F4EF] flex items-center justify-center px-6">
                <div className="text-center space-y-3">
                    <p className="text-4xl">🏨</p>
                    <p className="text-lg font-bold text-[#1A1512]" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Kamar tidak ditemukan
                    </p>
                    <p className="text-sm text-[#A89070]">Coba kembali atau pilih tipe lain</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-2 text-sm font-semibold text-[#C4A882] underline underline-offset-4"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    const nights =
        checkin && checkout
            ? Math.max(0, Math.round((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000))
            : 0;

    return (
        <>
            {showDatePicker && <DatePickerModal onConfirm={handleDateConfirm} />}

            <div className="min-h-screen bg-[#F7F4EF]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {/* ── Hero Image ── */}
                <div className="relative w-full h-56 bg-[#D5C9B8] overflow-hidden">
                    {roomType.image?.url ? (
                        <Images
                            src={roomType.image.url}
                            alt={roomType.name}
                            height={2000}
                            width={2000}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-16 h-16 text-[#A89070]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 17.25V21h3.75M3 17.25h18" />
                            </svg>
                        </div>
                    )}

                    {/* Back button */}
                    <button
                        onClick={() => router.back()}
                        className="absolute top-4 left-4 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow"
                    >
                        <svg className="w-4 h-4 text-[#1A1512]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                </div>

                {/* ── Content ── */}
                <div className="px-5 pt-6 pb-10 space-y-5">

                    {/* Room type name + desk */}
                    <div>
                        <p className="text-[10px] font-semibold tracking-widest text-[#A89070] uppercase">Tipe Kamar</p>
                        <h1 className="text-2xl font-bold text-[#1A1512] mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {roomType.name}
                        </h1>
                        {roomType.desk && (
                            <p className="text-sm text-[#7A6A5A] mt-1 leading-relaxed">{roomType.desk}</p>
                        )}
                    </div>

                    {/* Check-in / checkout row */}
                    {checkin && checkout && (
                        <button
                            onClick={() => {
                                const url = new URL(window.location.href);
                                url.searchParams.delete("checkin");
                                url.searchParams.delete("checkout");
                                router.replace(url.pathname);
                            }}
                            className="w-full flex items-center justify-between bg-white border border-[#E8E0D5] rounded-2xl px-4 py-3"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-[#F7F4EF] flex items-center justify-center">
                                    <svg className="w-4 h-4 text-[#A89070]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] text-[#A89070] font-semibold tracking-wider uppercase">Tanggal Menginap</p>
                                    <p className="text-xs font-semibold text-[#1A1512]">
                                        {checkin} → {checkout}
                                        <span className="ml-2 text-[#A89070] font-normal">({nights} malam)</span>
                                    </p>
                                </div>
                            </div>
                            <svg className="w-4 h-4 text-[#A89070]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                            </svg>
                        </button>
                    )}

                    {/* Divider */}
                    <div className="h-px bg-[#E8E0D5]" />

                    {/* Room availability header + filter */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold tracking-widest text-[#A89070] uppercase">Ketersediaan Kamar</p>
                            <p className="text-sm font-bold text-[#1A1512] mt-0.5">
                                {availableCount} dari {roomType.rooms.length} tersedia
                            </p>
                        </div>
                        <button
                            onClick={() => setFilter(f => f === "all" ? "available" : "all")}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${filter === "available"
                                    ? "bg-[#1A1512] text-[#F7F4EF] border-[#1A1512]"
                                    : "bg-white text-[#7A6A5A] border-[#E8E0D5]"
                                }`}
                        >
                            {filter === "available" ? "Semua" : "Tersedia saja"}
                        </button>
                    </div>

                    {/* Room grid */}
                    {filteredRooms.length === 0 ? (
                        <div className="py-10 text-center space-y-2">
                            <p className="text-3xl">🛏️</p>
                            <p className="text-sm font-semibold text-[#1A1512]">Tidak ada kamar tersedia</p>
                            <p className="text-xs text-[#A89070]">Coba ubah tanggal menginap</p>
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
        </>
    );
}