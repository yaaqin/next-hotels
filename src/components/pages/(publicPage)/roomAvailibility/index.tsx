"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type RoomStatus = "available" | "booked" | "selected";

interface Room {
  id: string;
  number: string;
  floor: string;
  roomType: number; // angka tipe kamar
  isAvailable: boolean;
  pricing: {
    basePrice: number;
    effectivePrice: number;
    appliedRule: string | null;
    nights: number;
    totalPrice: number;
  } | null;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const dummyRooms: Room[] = [
  // Row atas (lantai 05 kiri ke kanan)
  { id: "r01", number: "0401", floor: "04", roomType: 4, isAvailable: true, pricing: { basePrice: 450000, effectivePrice: 450000, appliedRule: null, nights: 1, totalPrice: 450000 } },
  { id: "r02", number: "0501", floor: "05", roomType: 0, isAvailable: false, pricing: null }, // td = tdk tersedia
  { id: "r03", number: "0502", floor: "05", roomType: 2, isAvailable: true, pricing: { basePrice: 320000, effectivePrice: 320000, appliedRule: null, nights: 1, totalPrice: 320000 } },
  { id: "r04", number: "0601", floor: "06", roomType: 2, isAvailable: true, pricing: { basePrice: 320000, effectivePrice: 350000, appliedRule: "WEEKEND", nights: 1, totalPrice: 350000 } },
  { id: "r05", number: "0701", floor: "07", roomType: 2, isAvailable: false, pricing: null },

  // Row bawah kiri
  { id: "r06", number: "0301", floor: "03", roomType: 4, isAvailable: true, pricing: { basePrice: 450000, effectivePrice: 450000, appliedRule: null, nights: 1, totalPrice: 450000 } },
  { id: "r07", number: "0201", floor: "02", roomType: 1, isAvailable: true, pricing: { basePrice: 250000, effectivePrice: 250000, appliedRule: null, nights: 1, totalPrice: 250000 } },
  { id: "r08", number: "0101", floor: "01", roomType: 1, isAvailable: true, pricing: { basePrice: 250000, effectivePrice: 275000, appliedRule: "WEEKEND", nights: 1, totalPrice: 275000 } },

  // Row kanan atas (08)
  { id: "r09", number: "0801", floor: "08", roomType: 1, isAvailable: true, pricing: { basePrice: 250000, effectivePrice: 250000, appliedRule: null, nights: 1, totalPrice: 250000 } },

  // Row kanan bawah (09, 10)
  { id: "r10", number: "0901", floor: "09", roomType: 3, isAvailable: true, pricing: { basePrice: 380000, effectivePrice: 380000, appliedRule: null, nights: 1, totalPrice: 380000 } },
  { id: "r11", number: "0902", floor: "09", roomType: 3, isAvailable: false, pricing: null },
  { id: "r12", number: "1001", floor: "10", roomType: 3, isAvailable: true, pricing: { basePrice: 380000, effectivePrice: 400000, appliedRule: "DATE_RANGE", nights: 1, totalPrice: 400000 } },
  { id: "r13", number: "1002", floor: "10", roomType: 3, isAvailable: true, pricing: { basePrice: 380000, effectivePrice: 380000, appliedRule: null, nights: 1, totalPrice: 380000 } },
];

// ─── Layout config — mirror dari gambar ──────────────────────────────────────

const floorLayout = [
  // [row, col, roomId, label kolom atas]
  { row: 0, col: 0, id: "r01", colLabel: "04" },
  { row: 0, col: 1, id: "r02", colLabel: "05" },
  { row: 0, col: 2, id: "r03", colLabel: "" },
  { row: 0, col: 3, id: "r04", colLabel: "06" },
  { row: 0, col: 4, id: "r05", colLabel: "07" },

  { row: 1, col: 0, id: "r06", colLabel: "" },
  { row: 1, col: 1, id: "r07", colLabel: "" },
  { row: 1, col: 2, id: "r08", colLabel: "" },
  // lift ada di col 3 row 1 — special cell
  { row: 1, col: 4, id: "r09", colLabel: "08" },

  { row: 2, col: 3, id: "r10", colLabel: "" },
  { row: 2, col: 4, id: "r11", colLabel: "09" },

  { row: 3, col: 3, id: "r12", colLabel: "" },
  { row: 3, col: 4, id: "r13", colLabel: "10" },
];

const rowLabels = ["", "03", "02", "01", "12", "11"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const roomMap = Object.fromEntries(dummyRooms.map((r) => [r.id, r]));

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

const typeColors: Record<number, { bg: string; border: string; text: string }> = {
  0: { bg: "#e5e7eb", border: "#9ca3af", text: "#6b7280" },       // td / tidak tersedia
  1: { bg: "#dbeafe", border: "#3b82f6", text: "#1d4ed8" },       // tipe 1
  2: { bg: "#d1fae5", border: "#10b981", text: "#065f46" },       // tipe 2
  3: { bg: "#fef3c7", border: "#f59e0b", text: "#92400e" },       // tipe 3
  4: { bg: "#ede9fe", border: "#8b5cf6", text: "#4c1d95" },       // tipe 4
};

// ─── Room Cell Component ──────────────────────────────────────────────────────

function RoomCell({
  room,
  isSelected,
  onClick,
}: {
  room: Room;
  isSelected: boolean;
  onClick: () => void;
}) {
  const colors = typeColors[room.isAvailable ? room.roomType : 0];
  const isBooked = !room.isAvailable;

  return (
    <button
      onClick={isBooked ? undefined : onClick}
      disabled={isBooked}
      style={{
        width: "90px",
        height: "80px",
        borderRadius: "12px",
        border: `2px solid ${isSelected ? "#0f172a" : colors.border}`,
        backgroundColor: isSelected ? "#0f172a" : isBooked ? "#f3f4f6" : colors.bg,
        color: isSelected ? "#fff" : isBooked ? "#9ca3af" : colors.text,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: isBooked ? "not-allowed" : "pointer",
        position: "relative",
        transition: "all 0.15s ease",
        boxShadow: isSelected
          ? "0 4px 14px rgba(15,23,42,0.3)"
          : isBooked
          ? "none"
          : "0 2px 6px rgba(0,0,0,0.07)",
        transform: isSelected ? "scale(1.06)" : "scale(1)",
        outline: "none",
      }}
      title={isBooked ? `Room ${room.number} — Tidak Tersedia` : `Room ${room.number}`}
    >
      {/* Tipe kamar */}
      <span style={{ fontSize: "22px", fontWeight: "700", lineHeight: 1 }}>
        {isBooked ? "td" : room.roomType}
      </span>
      {/* Nomor kamar */}
      <span style={{ fontSize: "10px", marginTop: "4px", opacity: 0.7, fontWeight: 500 }}>
        {room.number}
      </span>

      {/* Badge harga kalau ada rule */}
      {room.pricing?.appliedRule && !isBooked && (
        <span
          style={{
            position: "absolute",
            top: "4px",
            right: "4px",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#ef4444",
          }}
        />
      )}
    </button>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({
  room,
  onBook,
  onClose,
}: {
  room: Room;
  onBook: (room: Room) => void;
  onClose: () => void;
}) {
  const p = room.pricing!;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "20px",
        width: "260px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
        position: "relative",
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
          color: "#94a3b8",
          lineHeight: 1,
        }}
      >
        ×
      </button>

      {/* Header */}
      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: typeColors[room.roomType].bg,
            border: `1px solid ${typeColors[room.roomType].border}`,
            borderRadius: "8px",
            padding: "4px 10px",
            marginBottom: "8px",
          }}
        >
          <span style={{ fontSize: "12px", fontWeight: "600", color: typeColors[room.roomType].text }}>
            Tipe {room.roomType}
          </span>
        </div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>
          Room {room.number}
        </h3>
        <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#94a3b8" }}>
          Lantai {room.floor}
        </p>
      </div>

      {/* Harga */}
      <div
        style={{
          background: "#f8fafc",
          borderRadius: "10px",
          padding: "12px 14px",
          marginBottom: "14px",
        }}
      >
        {p.appliedRule && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>Harga dasar</span>
            <span style={{ fontSize: "12px", color: "#94a3b8", textDecoration: "line-through" }}>
              {formatRupiah(p.basePrice)}
            </span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>Per malam</span>
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>
            {formatRupiah(p.effectivePrice)}
          </span>
        </div>
        {p.appliedRule && (
          <div
            style={{
              marginTop: "8px",
              padding: "4px 8px",
              background: "#fef2f2",
              borderRadius: "6px",
              fontSize: "11px",
              color: "#ef4444",
              fontWeight: 500,
            }}
          >
            🔥 Harga {p.appliedRule === "WEEKEND" ? "Weekend" : p.appliedRule === "DATE_RANGE" ? "Spesial" : "Khusus"}
          </div>
        )}
        {p.nights > 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "12px", color: "#64748b" }}>{p.nights} malam</span>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
              {formatRupiah(p.totalPrice)}
            </span>
          </div>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={() => onBook(room)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "none",
          background: "#0f172a",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#1e293b")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#0f172a")}
      >
        Pilih Kamar Ini
      </button>
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function Legend() {
  const items = [
    { label: "Tipe 1", ...typeColors[1] },
    { label: "Tipe 2", ...typeColors[2] },
    { label: "Tipe 3", ...typeColors[3] },
    { label: "Tipe 4", ...typeColors[4] },
    { label: "Tidak Tersedia", ...typeColors[0] },
  ];

  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
      {items.map((item) => (
        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "4px",
              backgroundColor: item.bg,
              border: `1.5px solid ${item.border}`,
            }}
          />
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
            {item.label}
          </span>
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
        <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>Harga spesial</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RoomMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bookedRoom, setBookedRoom] = useState<Room | null>(null);

  const selectedRoom = selectedId ? roomMap[selectedId] : null;

  const handleSelect = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleBook = (room: Room) => {
    setBookedRoom(room);
    setSelectedId(null);
    // TODO: pass room ke booking form
    alert(`Room ${room.number} dipilih!\nTotal: ${formatRupiah(room.pricing!.totalPrice)}\n\nIntegrasikan dengan form booking.`);
  };

  // Build grid — 4 rows x 5 cols
  const grid: (string | "lift" | null)[][] = Array.from({ length: 4 }, () =>
    Array(5).fill(null)
  );

  floorLayout.forEach(({ row, col, id }) => {
    grid[row][col] = id;
  });

  // Lift ada di row 1 col 3
  grid[1][3] = "lift";

  const colLabels = ["04", "05", "", "06", "07"];
  const rowLabelMap: Record<number, string> = { 0: "", 1: "08", 2: "09", 3: "10" };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        padding: "32px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>
          Denah Kamar
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#94a3b8" }}>
          Klik kamar untuk melihat detail & harga
        </p>
      </div>

      <Legend />

      <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
        {/* Floor Map */}
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
            border: "1px solid #e2e8f0",
          }}
        >
          {/* Col labels atas */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px", paddingLeft: "32px" }}>
            {colLabels.map((label, i) => (
              <div
                key={i}
                style={{
                  width: "90px",
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#94a3b8",
                  letterSpacing: "0.05em",
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Grid */}
          {grid.map((row, rowIdx) => (
            <div
              key={rowIdx}
              style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" }}
            >
              {/* Row label kanan */}
              <div
                style={{
                  width: "24px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#94a3b8",
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {rowLabelMap[rowIdx]}
              </div>

              {row.map((cellId, colIdx) => {
                if (cellId === null) {
                  return (
                    <div key={colIdx} style={{ width: "90px", height: "80px" }} />
                  );
                }

                if (cellId === "lift") {
                  return (
                    <div
                      key={colIdx}
                      style={{
                        width: "90px",
                        height: "80px",
                        borderRadius: "12px",
                        border: "2px dashed #cbd5e1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        color: "#94a3b8",
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        background: "#f8fafc",
                      }}
                    >
                      LIFT
                    </div>
                  );
                }

                const room = roomMap[cellId];
                return (
                  <RoomCell
                    key={cellId}
                    room={room}
                    isSelected={selectedId === cellId}
                    onClick={() => handleSelect(cellId)}
                  />
                );
              })}
            </div>
          ))}

          {/* Row labels bawah */}
          <div style={{ display: "flex", gap: "8px", marginTop: "8px", paddingLeft: "32px" }}>
            {["03", "02", "01", "12", "11"].map((label, i) => (
              <div
                key={i}
                style={{
                  width: "90px",
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#94a3b8",
                  letterSpacing: "0.05em",
                }}
              >
                {i < 3 ? label : ""}
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedRoom && selectedRoom.isAvailable && (
          <div style={{ position: "sticky", top: "32px" }}>
            <DetailPanel
              room={selectedRoom}
              onBook={handleBook}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}
      </div>

      {/* Info kamar terpilih */}
      {bookedRoom && (
        <div
          style={{
            marginTop: "24px",
            padding: "14px 18px",
            background: "#f0fdf4",
            border: "1px solid #86efac",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            maxWidth: "400px",
          }}
        >
          <span style={{ fontSize: "18px" }}>✅</span>
          <div>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#166534" }}>
              Room {bookedRoom.number} dipilih
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: "#4ade80" }}>
              {formatRupiah(bookedRoom.pricing!.totalPrice)} · {bookedRoom.pricing!.nights} malam
            </p>
          </div>
          <button
            onClick={() => setBookedRoom(null)}
            style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#86efac", fontSize: "16px" }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}