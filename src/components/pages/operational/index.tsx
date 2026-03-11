"use client";

import { useState } from "react";
import NeedConfirmSection from "../../organisms/operational/needConfirm";
import CheckInOperationalSection from "../../organisms/operational/checkinOperational";
import DueCheckoutOperationalSection from "../../organisms/operational/checkoutOperational";

type Tab = {
  id: string;
  label: string;
};

const TABS: Tab[] = [
  { id: "confirm", label: "Need Confirm" },
  { id: "checkin", label: "Check In" },
  { id: "checkout", label: "Need CheckOut" },
];

export default function OperationalPage() {
  const [active, setActive] = useState("confirm");

  return (
    <>
      <div className="flex items-center w-full">
        {TABS.map((tab, i) => {
          const isActive = active === tab.id;
          const isLast = i === TABS.length - 1;

          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className="flex-1 flex flex-col items-center gap-2 group"
            >
              <span
                className={`text-sm font-medium transition-colors duration-200 ${isActive ? "text-blue-500" : "text-gray-500 group-hover:text-gray-800"
                  }`}
              >
                {tab.label}
              </span>
              <div className="w-full flex items-center">
                <div
                  className={`h-[2px] w-full transition-colors duration-200 ${isActive ? "bg-blue-500" : "bg-gray-800"
                    }`}
                />
                {!isLast && (
                  <div className="w-1 h-[2px] bg-gray-200 shrink-0" />
                )}
              </div>
            </button>
          );
        })}

      </div>
      <section className="mt-4">
        {active === 'confirm' ? (
          <NeedConfirmSection />
        ) : active === 'checkin' ? (
          <CheckInOperationalSection />
        ) : active === 'checkout' && (
          <DueCheckoutOperationalSection />
        )}
      </section>
    </>
  );
}