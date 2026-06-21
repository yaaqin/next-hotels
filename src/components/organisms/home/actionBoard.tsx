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
    <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-300 bg-white">
      {/* Left panel: check-in form content */}
      <div className="flex-1 border-r border-gray-300 p-6">
        {activeTab === "check-in" ? (
          <div className="flex h-full flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Check-in details
            </h2>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="roomType"
                className="text-sm font-medium text-gray-700"
              >
                Room type
              </label>
              <select
                id="roomType"
                value={form.roomType}
                onChange={(e) => handleFormChange("roomType", e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
                className="text-sm font-medium text-gray-700"
              >
                Guest name
              </label>
              <input
                id="guestName"
                type="text"
                value={form.guestName}
                onChange={(e) => handleFormChange("guestName", e.target.value)}
                placeholder="Full name"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="checkInDate"
                  className="text-sm font-medium text-gray-700"
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
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="nights"
                  className="text-sm font-medium text-gray-700"
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
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="mt-auto rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
            >
              Confirm check-in
            </button>
          </div>
        ) : null}
      </div>

      {/* Right panel: tab selector + location */}
      <div className="flex w-64 flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
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

        <div className="flex flex-col gap-1">
          <label
            htmlFor="location"
            className="text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value as LocationValue)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.value} value={loc.value}>
                {loc.label}
              </option>
            ))}
          </select>
        </div>
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
      className={`rounded-lg px-4 py-2 text-left text-base font-medium transition-colors ${
        isActive
          ? "bg-gray-900 text-white"
          : "text-gray-800 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}