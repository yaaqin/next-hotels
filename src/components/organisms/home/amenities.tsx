"use client";
import {
  PrinterIcon,
  CustomerService01Icon,
  Dumbbell01Icon,
  Wifi01Icon,
  HangerIcon,
  PresentationBarChart01Icon,
  Car01Icon,
  ParkingAreaCircleIcon,
  SwimmingIcon,
  DeliveryBox01Icon,
  FlowerIcon,
  Cards01Icon,
  SpoonAndForkIcon,
} from "hugeicons-react";

const amenities = [
  { icon: PrinterIcon, label: "Business Services" },
  { icon: CustomerService01Icon, label: "Concierge" },
  { icon: Cards01Icon, label: "Digital Check-In" },
  { icon: Dumbbell01Icon, label: "Fitness Center" },
  { icon: Wifi01Icon, label: "Free Internet Access" },
  { icon: HangerIcon, label: "Laundry" },
  { icon: PresentationBarChart01Icon, label: "Meeting Facilities" },
  { icon: Car01Icon, label: "Valet Parking" },
  { icon: ParkingAreaCircleIcon, label: "Self Parking" },
  { icon: SwimmingIcon, label: "Pool" },
  { icon: SpoonAndForkIcon, label: "Restaurant On-Site" },
  { icon: DeliveryBox01Icon, label: "Room Service" },
//   { icon: FlowerIcon, label: "Spa" },
];

export default function Amenities() {
  return (
    <section className="w-full py-16 px-8 bg-white">
      <h2 className="text-center text-3xl font-bold tracking-[0.25em] uppercase text-gray-900 mb-12">
        Amenities
      </h2>

      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-7">
        {amenities.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 group">
            <Icon
              size={28}
              color="#3b82f6"
              strokeWidth={1.5}
              className="shrink-0 transition-transform duration-200 group-hover:scale-110"
            />
            <span className="text-sm text-gray-700 font-medium">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}