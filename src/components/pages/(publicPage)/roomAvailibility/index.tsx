'use client';

import { useState, useMemo } from "react";
import type { Floor, Room, TypeMapping, GridMeta, SpecialCell } from "@/src/models/public/roomPlan/list";
import { usePublicRoomPlan } from "@/src/hooks/query/roomPlan/list";

// ─── Constants ────────────────────────────────────────────────────────────────

const SITE_CODE = "MERAK";

// Warna per gridType (1-4), di-assign berdasarkan urutan di typeMapping per lantai
// gridType 1 = tipe paling mahal, dst
const TYPE_COLORS = [
  { bg: "#fdf2ff", border: "#c026d3", text: "#701a75" }, // gridType 1
  { bg: "#fff7ed", border: "#f97316", text: "#7c2d12" }, // gridType 2
  { bg: "#eff6ff", border: "#3b82f6", text: "#1e3a8a" }, // gridType 3
  { bg: "#f5f3ff", border: "#8b5cf6", text: "#3b0764" }, // gridType 4
];
const NA_COLOR = { bg: "#f8fafc", border: "#e2e8f0", text: "#c0ccd8" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDateStr(d: Date) {
  return d.toISOString().split("T")[0];
}

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
}

function getTypeColor(gridType: number) {
  return TYPE_COLORS[gridType - 1] ?? NA_COLOR;
}

// ─── Sub Components ───────────────────────────────────────────────────────────

function RoomCell({
  room,
  isSelected,
  onClick,
}: {
  room: Room;
  isSelected: boolean;
  onClick: () => void;
}) {
  const isUnavailable = room.status !== "AVAILABLE";
  const isBooked = room.status === "BOOKED";
  const colors = isUnavailable ? NA_COLOR : getTypeColor(room.gridType);

  return (
    <button
      onClick={isUnavailable ? undefined : onClick}
      disabled={isUnavailable}
      style={{
        width: 88, height: 78, borderRadius: 10, outline: "none",
        border: `2px solid ${isSelected ? "#0f172a" : isUnavailable ? "#e2e8f0" : colors.border}`,
        backgroundColor: isSelected ? "#0f172a" : isUnavailable ? "#f8fafc" : colors.bg,
        color: isSelected ? "#fff" : isUnavailable ? "#c0ccd8" : colors.text,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        cursor: isUnavailable ? "not-allowed" : "pointer",
        position: "relative", transition: "all 0.15s ease",
        boxShadow: isSelected
          ? "0 4px 14px rgba(15,23,42,0.25)"
          : isUnavailable ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
        transform: isSelected ? "scale(1.07)" : "scale(1)",
      }}
    >
      {/* Angka tipe / td */}
      <span style={{ fontSize: 20, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.5px" }}>
        {isUnavailable ? "td" : room.gridType}
      </span>

      {/* Room ID */}
      <span style={{ fontSize: 9, marginTop: 3, opacity: 0.65, fontWeight: 600, letterSpacing: "0.3px" }}>
        {room.roomId}
      </span>

      {/* Nama tipe singkat */}
      {!isUnavailable && room.roomTypeName && (
        <span style={{ fontSize: 8, opacity: 0.6, marginTop: 1 }}>
          {room.roomTypeName.split(" ")[0]}
        </span>
      )}

      {/* Dot harga spesial */}
      {!isUnavailable && room.pricing?.appliedRuleId && (
        <span style={{
          position: "absolute", top: 4, right: 4,
          width: 7, height: 7, borderRadius: "50%", backgroundColor: "#ef4444",
        }} />
      )}

      {/* Badge booked */}
      {isBooked && (
        <span style={{
          position: "absolute", top: 4, right: 4, fontSize: 8,
          background: "#fef2f2", color: "#ef4444", borderRadius: 4,
          padding: "1px 3px", fontWeight: 700,
        }}>
          BOOKED
        </span>
      )}
    </button>
  );
}

function DetailPanel({
  room,
  floor,
  onBook,
  onClose,
}: {
  room: Room;
  floor: Floor;
  onBook: () => void;
  onClose: () => void;
}) {
  const colors = getTypeColor(room.gridType);
  const p = room.pricing;

  return (
    <div style={{
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
      padding: 20, width: 256, boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
      position: "relative",
    }}>
      <button onClick={onClose} style={{
        position: "absolute", top: 10, right: 12, background: "none", border: "none",
        cursor: "pointer", fontSize: 20, color: "#94a3b8", lineHeight: 1,
      }}>×</button>

      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: colors.bg, border: `1px solid ${colors.border}`,
          borderRadius: 8, padding: "3px 10px", marginBottom: 8,
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: colors.text }}>
            {room.roomTypeName}
          </span>
        </div>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#0f172a" }}>
          Room {room.roomId}
        </h3>
        <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
          {floor.floorName} · Wing {room.wing} · {room.bedTypeName}
        </p>
      </div>

      {/* Pricing */}
      {p ? (
        <div style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
          {p.appliedRuleId && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>Harga dasar</span>
              <span style={{ fontSize: 11, color: "#94a3b8", textDecoration: "line-through" }}>
                {formatRp(p.basePrice)}
              </span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>Per malam</span>
            <span style={{ fontSize: 17, fontWeight: 800, color: "#0f172a" }}>
              {formatRp(p.effectivePrice)}
            </span>
          </div>
          {p.appliedRuleId && (
            <div style={{
              marginTop: 8, padding: "4px 8px", background: "#fef2f2",
              borderRadius: 6, fontSize: 10, color: "#ef4444", fontWeight: 600,
            }}>
              🔥 {p.appliedRuleName}
            </div>
          )}
          {p.nights > 1 && (
            <div style={{
              display: "flex", justifyContent: "space-between",
              marginTop: 10, paddingTop: 10, borderTop: "1px solid #e2e8f0",
            }}>
              <span style={{ fontSize: 11, color: "#64748b" }}>{p.nights} malam</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                {formatRp(p.totalPrice)}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div style={{
          background: "#f8fafc", borderRadius: 10, padding: "12px 14px",
          marginBottom: 14, fontSize: 12, color: "#94a3b8", textAlign: "center",
        }}>
          Harga belum tersedia
        </div>
      )}

      <button
        onClick={onBook}
        style={{
          width: "100%", padding: 11, borderRadius: 10, border: "none",
          background: "#0f172a", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "#334155")}
        onMouseLeave={e => (e.currentTarget.style.background = "#0f172a")}
      >
        Pilih Kamar Ini
      </button>
    </div>
  );
}

function Legend({ typeMapping }: { typeMapping: TypeMapping[] }) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
      {typeMapping.map((t) => {
        const c = getTypeColor(t.gridType);
        return (
          <div key={t.gridType} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: c.bg, border: `1.5px solid ${c.border}` }} />
            <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>
              {t.roomTypeName}
            </span>
          </div>
        );
      })}
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <div style={{ width: 12, height: 12, borderRadius: 3, background: "#f8fafc", border: "1.5px solid #e2e8f0" }} />
        <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Tidak Tersedia / Booked</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444" }} />
        <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Harga Spesial</span>
      </div>
    </div>
  );
}

function FloorGrid({
  floor,
  gridMeta,
  selectedId,
  onSelect,
}: {
  floor: Floor;
  gridMeta: GridMeta;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  // Build grid 2D dari gridRow/gridCol yang sudah ada di response API
  const grid = useMemo(() => {
    const g: (Room | SpecialCell | null)[][] = Array.from(
      { length: gridMeta.rows },
      () => Array(gridMeta.cols).fill(null),
    );

    // Isi special cells dulu (LIFT, dll)
    for (const sc of floor.specialCells) {
      g[sc.gridRow][sc.gridCol] = sc;
    }

    // Isi rooms
    for (const room of floor.rooms) {
      if (room.gridRow >= 0 && room.gridCol >= 0) {
        g[room.gridRow][room.gridCol] = room;
      }
    }

    return g;
  }, [floor, gridMeta]);

  const isSpecialCell = (cell: Room | SpecialCell | null): cell is SpecialCell =>
    !!cell && "label" in cell;

  return (
    <div style={{ overflowX: "auto" }}>
      {/* Col labels atas */}
      <div style={{ display: "flex", gap: 8, marginBottom: 6, paddingLeft: 28 }}>
        {gridMeta.colLabels.map((l, i) => (
          <div key={i} style={{ width: 88, textAlign: "center", fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>
            {l}
          </div>
        ))}
      </div>

      {/* Rows */}
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
          {/* Row label kanan */}
          <div style={{ width: 22, fontSize: 11, fontWeight: 700, color: "#94a3b8", textAlign: "right", flexShrink: 0 }}>
            {gridMeta.rowRightLabels[rowIdx as 0 | 1 | 2 | 3] ?? ""}
          </div>

          {row.map((cell, colIdx) => {
            if (!cell) {
              return <div key={colIdx} style={{ width: 88, height: 78 }} />;
            }

            if (isSpecialCell(cell)) {
              return (
                <div key={colIdx} style={{
                  width: 88, height: 78, borderRadius: 10, border: "2px dashed #e2e8f0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, color: "#cbd5e1", fontWeight: 700, background: "#fafafa",
                }}>
                  {cell.label}
                </div>
              );
            }

            return (
              <RoomCell
                key={cell.roomId}
                room={cell}
                isSelected={selectedId === cell.roomId}
                onClick={() => onSelect(cell.roomId)}
              />
            );
          })}
        </div>
      ))}

      {/* Row labels bawah */}
      <div style={{ display: "flex", gap: 8, marginTop: 4, paddingLeft: 28 }}>
        {gridMeta.rowBottomLabels.map((l, i) => (
          <div key={i} style={{ width: 88, textAlign: "center", fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div style={{ padding: "22px 24px" }}>
      {Array.from({ length: 4 }).map((_, rowIdx) => (
        <div key={rowIdx} style={{ display: "flex", gap: 8, marginBottom: 8, paddingLeft: 30 }}>
          {Array.from({ length: 5 }).map((_, colIdx) => (
            <div key={colIdx} style={{
              width: 88, height: 78, borderRadius: 10,
              background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
            }} />
          ))}
        </div>
      ))}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RoomMap() {
  const today = toDateStr(new Date());
  const tomorrow = toDateStr(new Date(Date.now() + 86_400_000));

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [activeFloorId, setActiveFloorId] = useState("01");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ── Fetch data dari API ──
  const { data, isLoading, error, refetch } = usePublicRoomPlan(SITE_CODE, checkIn, checkOut);

  const floors = data?.data.floors ?? [];
  const gridMeta = data?.data.gridMeta;
  const nights = data?.data.nights ?? 1;

  const activeFloor = floors.find(f => f.floorId === activeFloorId) ?? floors[0];

  // Flat map semua rooms untuk lookup selectedRoom
  const allRoomsMap = useMemo(() => {
    const map = new Map<string, { room: Room; floor: Floor }>();
    for (const f of floors) {
      for (const r of f.rooms) {
        map.set(r.roomId, { room: r, floor: f });
      }
    }
    return map;
  }, [floors]);

  const selectedEntry = selectedId ? allRoomsMap.get(selectedId) : null;

  // ── Handlers ──
  const handleDateChange = (field: "in" | "out", val: string) => {
    setSelectedId(null);
    if (field === "in") {
      setCheckIn(val);
      if (val >= checkOut) {
        setCheckOut(toDateStr(new Date(new Date(val).getTime() + 86_400_000)));
      }
    } else {
      setCheckOut(val);
    }
  };

  const handleFloorChange = (floorId: string) => {
    setActiveFloorId(floorId);
    setSelectedId(null);
  };

  const handleBook = () => {
    if (!selectedEntry) return;
    const { room, floor } = selectedEntry;
    // TODO: pass ke booking form / router
    alert(
      `✅ Room ${room.roomId} dipilih!\n` +
      `${floor.floorName} · ${room.roomTypeName}\n` +
      `${checkIn} → ${checkOut} (${nights} malam)\n` +
      (room.pricing ? `Total: ${formatRp(room.pricing.totalPrice)}` : ""),
    );
    setSelectedId(null);
  };

  // ── Render ──
  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "28px 32px", background: "#f8fafc", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>Denah Kamar</h1>
        <p style={{ margin: "3px 0 0", fontSize: 13, color: "#94a3b8" }}>
          Pilih tanggal, lantai, lalu klik kamar untuk detail
        </p>
      </div>

      {/* Date Picker */}
      <div style={{
        display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap",
        background: "#fff", borderRadius: 14, padding: "14px 18px",
        border: "1px solid #e2e8f0", marginBottom: 22,
        boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
      }}>
        <div>
          <label style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>
            CHECK-IN
          </label>
          <input
            type="date" value={checkIn} min={today}
            onChange={e => handleDateChange("in", e.target.value)}
            style={{ border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "7px 10px", fontSize: 13, fontWeight: 600, color: "#0f172a", outline: "none", cursor: "pointer" }}
          />
        </div>
        <div style={{ fontSize: 18, color: "#cbd5e1", alignSelf: "flex-end", paddingBottom: 2 }}>→</div>
        <div>
          <label style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>
            CHECK-OUT
          </label>
          <input
            type="date" value={checkOut} min={checkIn}
            onChange={e => handleDateChange("out", e.target.value)}
            style={{ border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "7px 10px", fontSize: 13, fontWeight: 600, color: "#0f172a", outline: "none", cursor: "pointer" }}
          />
        </div>
        <div style={{ marginLeft: 8, padding: "6px 14px", background: "#f1f5f9", borderRadius: 8 }}>
          <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{nights} malam</span>
        </div>

        {/* Refetch indicator */}
        {isLoading && (
          <div style={{ marginLeft: "auto", fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{
              display: "inline-block", width: 12, height: 12, borderRadius: "50%",
              border: "2px solid #e2e8f0", borderTopColor: "#64748b",
              animation: "spin 0.8s linear infinite",
            }} />
            Memuat...
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12,
          padding: "14px 18px", marginBottom: 22, display: "flex", alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 13, color: "#dc2626", fontWeight: 500 }}>
            Gagal memuat data kamar
          </span>
          <button
            onClick={() => refetch()}
            style={{
              fontSize: 12, fontWeight: 700, color: "#dc2626", background: "none",
              border: "1px solid #fca5a5", borderRadius: 6, padding: "4px 12px", cursor: "pointer",
            }}
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Floor Tabs */}
      {!isLoading && floors.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {floors.map(f => (
            <button
              key={f.floorId}
              onClick={() => handleFloorChange(f.floorId)}
              style={{
                padding: "8px 18px", borderRadius: 10,
                border: `1.5px solid ${activeFloorId === f.floorId ? "#0f172a" : "#e2e8f0"}`,
                background: activeFloorId === f.floorId ? "#0f172a" : "#fff",
                color: activeFloorId === f.floorId ? "#fff" : "#64748b",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                transition: "all 0.12s ease",
              }}
            >
              {f.floorName}
            </button>
          ))}
        </div>
      )}

      {/* Legend */}
      {activeFloor && <Legend typeMapping={activeFloor.typeMapping} />}

      {/* Main Content */}
      <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
        {/* Grid */}
        <div style={{
          background: "#fff", borderRadius: 18,
          boxShadow: "0 2px 14px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0",
          minWidth: 540,
        }}>
          {isLoading || !activeFloor || !gridMeta ? (
            <SkeletonGrid />
          ) : (
            <div style={{ padding: "22px 24px" }}>
              <FloorGrid
                floor={activeFloor}
                gridMeta={gridMeta}
                selectedId={selectedId}
                onSelect={(id) => setSelectedId(prev => prev === id ? null : id)}
              />
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedEntry && selectedEntry.room.status === "AVAILABLE" && (
          <div style={{ position: "sticky", top: 28 }}>
            <DetailPanel
              room={selectedEntry.room}
              floor={selectedEntry.floor}
              onBook={handleBook}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}