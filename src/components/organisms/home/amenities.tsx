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
import { useTranslation } from "react-i18next";



export default function Amenities() {
  const { t } = useTranslation()

  const amenities = [
    { icon: PrinterIcon, label: t("text.home.amenities.businessServices") },
    { icon: CustomerService01Icon, label: t("text.home.amenities.concierge") },
    { icon: Cards01Icon, label: t("text.home.amenities.digitalCheckIn") },
    { icon: Dumbbell01Icon, label: t("text.home.amenities.fitnessCenter") },
    { icon: Wifi01Icon, label: t("text.home.amenities.freeInternet") },
    { icon: HangerIcon, label: t("text.home.amenities.laundry") },
    { icon: PresentationBarChart01Icon, label: t("text.home.amenities.meetingFacilities") },
    { icon: Car01Icon, label: t("text.home.amenities.valetParking") },
    { icon: ParkingAreaCircleIcon, label: t("text.home.amenities.selfParking") },
    { icon: SwimmingIcon, label: t("text.home.amenities.pool") },
    { icon: SpoonAndForkIcon, label: t("text.home.amenities.restaurant") },
    { icon: DeliveryBox01Icon, label: t("text.home.amenities.roomService") },
  ];
  return (
    <section className="w-full py-16 px-8 bg-white relative" style={{ zIndex: 3 }}>
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