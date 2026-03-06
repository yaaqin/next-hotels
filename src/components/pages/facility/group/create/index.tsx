"use client";

import { useFacilityItemList } from "@/src/hooks/query/facilities/listItems";
import { forwardRef, useState, useCallback, type InputHTMLAttributes } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Input Component (pure Tailwind)
// ─────────────────────────────────────────────────────────────────────────────
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    label: string;
    value: string;
    onChange?: (value: string) => void;
    error?: string;
    helperText?: string;
    numberOnly?: boolean;
    containerClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    required?: boolean;
}

const Inputs = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            value,
            onChange,
            error,
            helperText,
            numberOnly = false,
            containerClassName,
            labelClassName,
            inputClassName,
            placeholder = "Type here...",
            maxLength,
            readOnly = false,
            disabled = false,
            required = false,
            type = "text",
            ...restProps
        },
        ref
    ) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newVal = e.target.value;
            if (maxLength && newVal.length > maxLength) return;
            if (numberOnly && !/^\d*$/.test(newVal)) return;
            onChange?.(newVal);
        };

        const isDisabled = disabled || readOnly;
        const hasError = !!error;

        return (
            <div className={containerClassName || "w-full"}>
                <label className={labelClassName || "block text-sm font-semibold text-gray-700 mb-1.5"}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="relative">
                    <input
                        ref={ref}
                        type={numberOnly ? "text" : type}
                        inputMode={numberOnly ? "numeric" : undefined}
                        value={value}
                        onChange={handleChange}
                        readOnly={readOnly}
                        disabled={disabled}
                        maxLength={maxLength}
                        placeholder={placeholder}
                        aria-invalid={hasError}
                        aria-describedby={error ? `${label}-error` : helperText ? `${label}-helper` : undefined}
                        className={[
                            "w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 transition-colors duration-200",
                            hasError
                                ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                : isDisabled
                                    ? "bg-gray-100 border-gray-300 cursor-not-allowed outline-none"
                                    : "border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none",
                            maxLength && !readOnly && !disabled ? "pr-16" : "",
                            inputClassName || "",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                        {...restProps}
                    />
                    {maxLength && !readOnly && !disabled && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <span className={`text-xs ${value.length >= maxLength ? "text-red-500" : "text-gray-400"}`}>
                                {value.length}/{maxLength}
                            </span>
                        </div>
                    )}
                </div>
                {error && (
                    <p id={`${label}-error`} className="mt-1 text-xs text-red-600" role="alert">
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p id={`${label}-helper`} className="mt-1 text-xs text-gray-500">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);
Inputs.displayName = "Input";

// ─────────────────────────────────────────────────────────────────────────────
// Types & Data
// ─────────────────────────────────────────────────────────────────────────────
interface FacilityType { id: string; code: string; name: string; }
interface Facility { id: string; code: string; name: string; note?: string; type: FacilityType; }


const CATEGORY_META: Record<string, { icon: string }> = {
    WIRED: { icon: "📡" },
    FOODS: { icon: "🍽️" },
    SFSEC: { icon: "🔒" },
    VVIEW: { icon: "🌅" },
    BTHRM: { icon: "🚿" },
    FRNTR: { icon: "🛋️" },
};

function groupFacilities(data: Facility[]) {

    const map = new Map<string, { type: FacilityType; items: Facility[] }>();
    for (const f of data) {
        if (!map.has(f.type.id)) map.set(f.type.id, { type: f.type, items: [] });
        map.get(f.type.id)!.items.push(f);
    }
    return Array.from(map.values());
}


// ─────────────────────────────────────────────────────────────────────────────
// Selected Items Modal
// ─────────────────────────────────────────────────────────────────────────────
function SelectedModal({ selected, onClose }: { selected: Set<string>; onClose: () => void }) {

    const { data } = useFacilityItemList()

    const RAW = data?.data || []
    const GROUPS = groupFacilities(RAW);
    const selectedItems = RAW.filter((f) => selected.has(f.id));

    const byCategory = new Map<string, { type: FacilityType; items: Facility[] }>();
    for (const f of selectedItems) {
        if (!byCategory.has(f.type.id)) byCategory.set(f.type.id, { type: f.type, items: [] });
        byCategory.get(f.type.id)!.items.push(f);
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Panel */}
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">Fasilitas Dipilih</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{selected.size} item terpilih</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors text-sm font-bold"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {selected.size === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <p className="text-3xl mb-2">🗂️</p>
                            <p className="text-sm">Belum ada fasilitas dipilih</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-5">
                            {Array.from(byCategory.values()).map(({ type, items }) => {
                                const meta = CATEGORY_META[type.code] ?? { icon: "🏷️" };
                                return (
                                    <div key={type.id}>
                                        {/* Category label */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-base">{meta.icon}</span>
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{type.name}</span>
                                            <span className="ml-auto text-xs font-semibold text-blue-400 bg-blue-50 px-2 py-0.5 rounded-full">
                                                {items.length}
                                            </span>
                                        </div>
                                        {/* Items */}
                                        <div className="flex flex-col gap-1.5">
                                            {items.map((f) => (
                                                <div key={f.id} className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 rounded-lg">
                                                    <span className="text-[10px] font-bold font-mono bg-blue-400 text-white px-1.5 py-0.5 rounded shrink-0">
                                                        {f.code}
                                                    </span>
                                                    <span className="text-xs text-gray-700 font-medium">{f.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sticky Mini Badge (top-right)
// ─────────────────────────────────────────────────────────────────────────────
function StickyBadge({ count, onView }: { count: number; onView: () => void }) {
    if (count === 0) return null;
    return (
        <div className="absolute top-4 right-4 z-40 flex items-center gap-2 bg-white border border-gray-200 shadow-lg rounded-full px-3 py-1.5">
            <span className="text-xs font-bold text-gray-800">{count} dipilih</span>
            <button
                onClick={onView}
                className="text-[11px] font-semibold text-white bg-blue-400 hover:bg-blue-500 transition-colors px-2 py-0.5 rounded-full"
            >
                Lihat
            </button>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function HotelFacilitiesForm() {

    const { data } = useFacilityItemList()

    const RAW = data?.data || []
    const GROUPS = groupFacilities(RAW);
    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState("");
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [openGroups, setOpenGroups] = useState<Set<string>>(new Set([GROUPS[0]?.type.id]));
    const [showModal, setShowModal] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const toggle = useCallback((id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }, []);

    const toggleGroup = (typeId: string) => {
        setOpenGroups((prev) => {
            const next = new Set(prev);
            next.has(typeId) ? next.delete(typeId) : next.add(typeId);
            return next;
        });
    };

    const selectAll = (items: Facility[]) => {
        setSelected((prev) => {
            const next = new Set(prev);
            items.forEach((i) => next.add(i.id));
            return next;
        });
    };

    const deselectAll = (items: Facility[]) => {
        setSelected((prev) => {
            const next = new Set(prev);
            items.forEach((i) => next.delete(i.id));
            return next;
        });
    };

    const handleSubmit = () => {
        if (!title.trim()) {
            setTitleError("Judul tidak boleh kosong");
            return;
        }
        setTitleError("");
        const result = {
            title: title.trim(),
            facilityIds: Array.from(selected),
        };
        console.log("Form submitted:", result);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2500);
    };

    return (
        <div className="relative">
            {/* Google Font */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');
        body { font-family: 'DM Sans', sans-serif; background: #f5f4f0; min-height: 100vh; }
      `}</style>

            {/* Sticky mini badge */}
            <StickyBadge count={selected.size} onView={() => setShowModal(true)} />

            {/* Modal */}
            {showModal && <SelectedModal selected={selected} onClose={() => setShowModal(false)} />}

            <div className="max-w-2xl mx-auto px-5 pt-10 pb-20">

                {/* Page header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.4px" }}>
                        Fasilitas Kamar
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Isi judul dan pilih fasilitas yang tersedia</p>
                </div>

                {/* Title input */}
                <div className="bg-white rounded-2xl border border-gray-200 px-5 py-5 mb-5 shadow-sm">
                    <Inputs
                        label="Judul"
                        value={title}
                        onChange={(v) => {
                            setTitle(v);
                            if (v.trim()) setTitleError("");
                        }}
                        placeholder="Contoh: Deluxe Room with Sea View"
                        maxLength={80}
                        required
                        error={titleError}
                        helperText="Nama atau judul kamar / fasilitas grup ini"
                    />
                </div>

                {/* Accordion */}
                <div className="flex flex-col gap-3">
                    {GROUPS.map(({ type, items }) => {
                        const meta = CATEGORY_META[type.code] ?? { icon: "🏷️" };
                        const isOpen = openGroups.has(type.id);
                        const selectedInGroup = items.filter((i) => selected.has(i.id)).length;

                        return (
                            <div
                                key={type.id}
                                className={`bg-white rounded-2xl border-2 overflow-hidden transition-all duration-200 shadow-sm ${selectedInGroup > 0 ? "border-gray-900" : "border-gray-200"
                                    }`}
                            >
                                {/* Accordion header */}
                                <div
                                    className="flex items-center gap-3 px-4 py-3.5 cursor-pointer select-none hover:bg-gray-50 transition-colors"
                                    onClick={() => toggleGroup(type.id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === "Enter" && toggleGroup(type.id)}
                                >
                                    <div className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-xl text-lg shrink-0">
                                        {meta.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: "'Sora', sans-serif" }}>
                                            {type.name}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">{items.length} fasilitas</p>
                                    </div>
                                    <span
                                        className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${selectedInGroup > 0
                                            ? "bg-gray-900 text-white"
                                            : "bg-gray-100 text-gray-400"
                                            }`}
                                        style={{ fontFamily: "'Sora', sans-serif" }}
                                    >
                                        {selectedInGroup} dipilih
                                    </span>
                                    <svg
                                        className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                {/* Accordion body */}
                                {isOpen && (
                                    <div className="border-t border-gray-100 px-4 pb-4">
                                        {/* Quick actions */}
                                        <div className="flex gap-2 pt-3 pb-3">
                                            <button
                                                className="text-xs font-medium px-3 py-1 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
                                                onClick={() => selectAll(items)}
                                            >
                                                Pilih semua
                                            </button>
                                            <button
                                                className="text-xs font-medium px-3 py-1 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
                                                onClick={() => deselectAll(items)}
                                            >
                                                Hapus semua
                                            </button>
                                        </div>

                                        {/* Grid */}
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {items.map((facility) => {
                                                const isChecked = selected.has(facility.id);
                                                return (
                                                    <div
                                                        key={facility.id}
                                                        onClick={() => toggle(facility.id)}
                                                        role="checkbox"
                                                        aria-checked={isChecked}
                                                        tabIndex={0}
                                                        onKeyDown={(e) => e.key === "Enter" && toggle(facility.id)}
                                                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 cursor-pointer select-none transition-all duration-150 ${isChecked
                                                            ? "border-blue-400 bg-blue-400"
                                                            : "border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-white"
                                                            }`}
                                                    >
                                                        {/* Checkbox */}
                                                        <div
                                                            className={`w-4 h-4 rounded-[4px] border-2 shrink-0 flex items-center justify-center transition-all ${isChecked
                                                                ? "bg-white border-white"
                                                                : "bg-white border-gray-300"
                                                                }`}
                                                        >
                                                            {isChecked && (
                                                                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                                                    <path d="M1 3.5l2.2 2.2L8 1" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <span className={`text-xs font-medium leading-tight ${isChecked ? "text-white" : "text-gray-700"}`}>
                                                            {facility.name}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Submit button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                        onClick={handleSubmit}
                        className={`w-full py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${submitted
                            ? "bg-green-500 text-white"
                            : "bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.99]"
                            }`}
                        style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "0.01em" }}
                    >
                        {submitted
                            ? "✓ Tersimpan!"
                            : `Simpan${selected.size > 0 ? ` (${selected.size} fasilitas)` : ""} →`}
                    </button>
                    {selected.size === 0 && !submitted && (
                        <p className="text-center text-xs text-gray-400 mt-2">Belum ada fasilitas yang dipilih</p>
                    )}
                </div>
            </div>
        </div>
    );
}