"use client";
import { useEffect, useState } from "react";
import { BookingOverlay } from "./bookingOverlay";

interface NavbarProps {
  isMain?: boolean
}

export default function Navbar({
  isMain = true
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = bookingOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [bookingOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
    ${scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          {isMain && (
            <button
              className={`text-xs md:text-sm font-medium tracking-widest uppercase transition-colors duration-500 ease-in-out
          ${scrolled ? "text-gray-900" : "text-white"}`}
            >
              Menu
            </button>
          )}

          <span
            className={`text-2xl md:text-4xl font-semibold tracking-[0.2em] uppercase transition-colors duration-500 ease-in-out
        ${scrolled ? "text-gray-900" : "text-white"}`}
          >
            MBS
          </span>

          {isMain && (
            <button
              onClick={() => setBookingOpen(true)}
              className={`text-xs md:text-sm font-medium cursor-pointer tracking-widest uppercase transition-colors duration-500 ease-in-out
          ${scrolled ? "text-gray-900" : "text-white"}`}
            >
              Booking
            </button>
          )}
        </div>
      </nav>

      <BookingOverlay
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </>
  );
}