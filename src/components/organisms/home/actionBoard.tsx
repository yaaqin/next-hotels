"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type TabValue = "check-in" | "food";

type LocationValue = "jakarta" | "merak" | "singapore" | "australia-nsw";

const LOCATIONS: { value: LocationValue; label: string }[] = [
  { value: "jakarta", label: "Jakarta" },
  { value: "merak", label: "Merak" },
  { value: "singapore", label: "Singapore" },
  { value: "australia-nsw", label: "Australia, NSW" },
];

const ROOM_TYPES = [
  { value: "standard", label: "Standard" },
  { value: "deluxe", label: "Deluxe" },
  { value: "suite", label: "Suite" },
  { value: "executive", label: "Executive Suite" },
];

interface CheckInFormState {
  roomType: string;
  guestName: string;
  checkInDate: string;
  nights: number;
}

const INITIAL_FORM_STATE: CheckInFormState = {
  roomType: "",
  guestName: "",
  checkInDate: "",
  nights: 1,
};

export default function HotelBookingSelector() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabValue>("check-in");
  const [location, setLocation] = useState<LocationValue>("jakarta");
  const [form, setForm] = useState<CheckInFormState>(INITIAL_FORM_STATE);

  const handleTabChange = (tab: TabValue) => {
    if (tab === "food") {
      router.push("/food");
      return;
    }
    setActiveTab(tab);
  };

  const handleFormChange = <K extends keyof CheckInFormState>(
    key: K,
    value: CheckInFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    // TODO: hook up to actual check-in mutation
    console.log("Check-in submitted:", { ...form, location });
  };

  return (
    <div
      className="flex w-full flex-col overflow-hidden p-4 rounded-[20px] border border-[#1A56A0]/20 bg-[#EEF3FA] md:flex-row"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* ══════════════════════════════════════════
          Tab selector + location
          Mobile: shown first, full width, horizontal row
          Desktop: right panel, fixed width, stacked
      ══════════════════════════════════════════ */}
      <div className="order-1 rounded-r-ml flex flex-col gap-5 border-b border-[#1A56A0]/15 bg-[#0A1828] p-5 md:order-2 md:w-64 md:border-b-0 md:border-l">
        <div className="flex flex-row gap-2 md:flex-col">
          <TabButton
            label="check in"
            isActive={activeTab === "check-in"}
            onClick={() => handleTabChange("check-in")}
          />
          <TabButton
            label="food"
            isActive={activeTab === "food"}
            onClick={() => handleTabChange("food")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="location"
            className="text-[0.6rem] tracking-[0.18em] uppercase text-[#5B90C9]"
          >
            Location
          </label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value as LocationValue)}
            className="rounded-lg border border-[#1A56A0]/40 bg-[#030D1A] px-3 py-2 text-sm text-[#C8DCEF] focus:border-[#1A56A0] focus:outline-none focus:ring-2 focus:ring-[#1A56A0]/30"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.value} value={loc.value}>
                {loc.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          Check-in form content
          Mobile: shown second, full width
          Desktop: left panel, flexible width
      ══════════════════════════════════════════ */}
      <div className="order-2 flex-1 p-6 md:order-1">
        {activeTab === "check-in" ? (
          <div className="flex h-full flex-col gap-4">
            <div>
              <p className="text-[0.6rem] tracking-[0.18em] uppercase text-[#1A56A0] mb-1">
                Reservation
              </p>
              <h2
                className="text-xl font-light text-[#0A1828]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Check-in details
              </h2>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="roomType"
                className="text-xs font-medium text-[#2C4E72]"
              >
                Room type
              </label>
              <select
                id="roomType"
                value={form.roomType}
                onChange={(e) => handleFormChange("roomType", e.target.value)}
                className="rounded-lg border border-[#1A56A0]/30 bg-white px-3 py-2 text-sm text-[#0A1828] focus:border-[#1A56A0] focus:outline-none focus:ring-2 focus:ring-[#1A56A0]/20"
              >
                <option value="" disabled>
                  Select room type
                </option>
                {ROOM_TYPES.map((room) => (
                  <option key={room.value} value={room.value}>
                    {room.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="guestName"
                className="text-xs font-medium text-[#2C4E72]"
              >
                Guest name
              </label>
              <input
                id="guestName"
                type="text"
                value={form.guestName}
                onChange={(e) => handleFormChange("guestName", e.target.value)}
                placeholder="Full name"
                className="rounded-lg border border-[#1A56A0]/30 bg-white px-3 py-2 text-sm text-[#0A1828] placeholder:text-[#2C4E72]/40 focus:border-[#1A56A0] focus:outline-none focus:ring-2 focus:ring-[#1A56A0]/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="checkInDate"
                  className="text-xs font-medium text-[#2C4E72]"
                >
                  Check-in date
                </label>
                <input
                  id="checkInDate"
                  type="date"
                  value={form.checkInDate}
                  onChange={(e) =>
                    handleFormChange("checkInDate", e.target.value)
                  }
                  className="rounded-lg border border-[#1A56A0]/30 bg-white px-3 py-2 text-sm text-[#0A1828] focus:border-[#1A56A0] focus:outline-none focus:ring-2 focus:ring-[#1A56A0]/20"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="nights"
                  className="text-xs font-medium text-[#2C4E72]"
                >
                  Nights
                </label>
                <input
                  id="nights"
                  type="number"
                  min={1}
                  value={form.nights}
                  onChange={(e) =>
                    handleFormChange("nights", Number(e.target.value))
                  }
                  className="rounded-lg border border-[#1A56A0]/30 bg-white px-3 py-2 text-sm text-[#0A1828] focus:border-[#1A56A0] focus:outline-none focus:ring-2 focus:ring-[#1A56A0]/20"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="mt-auto rounded-full bg-[#0A1828] px-4 py-3 text-[0.7rem] tracking-[0.14em] uppercase font-normal text-[#EEF3FA] transition-colors hover:bg-[#1A56A0]"
            >
              Confirm check-in
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-lg px-4 py-2 text-center text-sm font-medium tracking-wide transition-colors md:text-left ${
        isActive
          ? "bg-[#1A56A0] text-[#EEF3FA]"
          : "text-[#5B90C9] hover:bg-[#1A56A0]/15"
      }`}
    >
      {label}
    </button>
  );
}