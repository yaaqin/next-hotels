"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar01Icon } from "hugeicons-react";

interface BookingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingOverlay({ isOpen, onClose }: BookingOverlayProps) {
  const [checkin, setCheckin] = useState<Date | undefined>(undefined);
  const [adults, setAdults] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Auto-close popover after date selected
  const handleDateSelect = (date: Date | undefined) => {
    setCheckin(date);
    if (date) setCalendarOpen(false);
  };

  const handleBook = () => {
    if (!checkin) return;
    const params = new URLSearchParams({ checkin: format(checkin, "yyyy-MM-dd") });
    if (adults) params.set("adult", adults);
    window.location.href = `/booking?${params.toString()}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "#EEF3FA", fontFamily: "'Montserrat', sans-serif" }}
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-8 transition-colors duration-200 text-xl font-light"
            style={{ color: "#6A9EC5" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0A1828")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6A9EC5")}
            aria-label="Close"
          >
            ✕
          </button>

          {/* Inner Content */}
          <div className="w-full max-w-5xl mx-auto px-4 md:px-8 flex gap-6">

            {/* Left — Image / Mood */}
            <motion.div
              className="hidden md:flex w-1/2 h-[75vh] rounded-3xl overflow-hidden relative items-end"
              style={{ background: "#0A1E38" }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <img
                src="https://cdn.yaaqin.xyz/hotel/1774430263617-book-cover.jpg"
                alt="Resort"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to top, #030D1A 35%, transparent 100%)",
                }}
              />
              {/* Blue tint */}
              <div
                className="absolute inset-0"
                style={{ background: "#1A56A0", opacity: 0.08 }}
              />
              <div className="relative z-10 p-8 w-full">
                <p
                  className="text-[0.55rem] tracking-[0.2em] uppercase mb-2"
                  style={{ color: "#5B90C9" }}
                >
                  Marina by Sand
                </p>
                <div className="w-6 h-px mb-3" style={{ background: "#1A56A0", opacity: 0.6 }} />
                <h2
                  className="text-[1.6rem] font-light leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: "#C8DCEF" }}
                >
                  Where Every Stay<br />Becomes a Memory.
                </h2>
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              className="w-full md:w-1/2 rounded-3xl flex flex-col justify-center px-6 md:px-10 py-10 md:py-12"
              style={{
                background: "#DDE8F5",
                border: "0.5px solid #B5CDE8",
              }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              <p
                className="text-[0.55rem] tracking-[0.2em] uppercase mb-2"
                style={{ color: "#1A56A0" }}
              >
                Reserve
              </p>
              <h3
                className="font-light mb-1 leading-tight"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.9rem",
                  color: "#0A1828",
                }}
              >
                Plan Your Visit
              </h3>
              <div className="w-8 h-px mb-8" style={{ background: "#1A56A0", opacity: 0.4 }} />

              {/* Check-in */}
              <div className="mb-5">
                <label
                  className="block text-[0.58rem] tracking-[0.18em] uppercase mb-2"
                  style={{ color: "#2C4E72" }}
                >
                  Check-in Date <span style={{ color: "#1A56A0" }}>*</span>
                </label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-xl px-4 py-3 h-auto text-sm hover:bg-transparent transition-all duration-200",
                        !checkin && "text-[#6A9EC5]"
                      )}
                      style={{
                        border: "0.5px solid #B5CDE8",
                        background: "#EEF3FA",
                        color: checkin ? "#0A1828" : "#6A9EC5",
                      }}
                    >
                      <Calendar01Icon className="mr-2 h-4 w-4" style={{ color: "#1A56A0" }} />
                      {checkin ? format(checkin, "PPP") : "Select check-in date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[200]" align="start">
                    <Calendar
                      mode="single"
                      selected={checkin}
                      onSelect={handleDateSelect}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                      className="rounded-lg border"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Adults */}
              <div className="mb-10">
                <label
                  className="block text-[0.58rem] tracking-[0.18em] uppercase mb-2"
                  style={{ color: "#2C4E72" }}
                >
                  Guests{" "}
                  <span
                    className="normal-case tracking-normal text-[0.65rem]"
                    style={{ color: "#6A9EC5" }}
                  >
                    (optional)
                  </span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  placeholder="e.g. 2"
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none"
                  style={{
                    border: "0.5px solid #B5CDE8",
                    background: "#EEF3FA",
                    color: "#0A1828",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#1A56A0")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#B5CDE8")}
                />
              </div>

              {/* Book Button */}
              <button
                onClick={handleBook}
                disabled={!checkin}
                className="w-full py-4 rounded-xl text-[0.68rem] tracking-[0.18em] uppercase font-normal transition-all duration-300"
                style={
                  checkin
                    ? {
                        background: "#0A1828",
                        color: "#C8DCEF",
                        cursor: "pointer",
                      }
                    : {
                        background: "#D0DCE8",
                        color: "#8AADC8",
                        cursor: "not-allowed",
                      }
                }
                onMouseEnter={(e) => {
                  if (checkin) e.currentTarget.style.background = "#163356";
                }}
                onMouseLeave={(e) => {
                  if (checkin) e.currentTarget.style.background = "#0A1828";
                }}
              >
                Reserve Your Experience
              </button>

              {!checkin && (
                <p
                  className="text-center text-[0.62rem] mt-3"
                  style={{ color: "#8AADC8" }}
                >
                  Please select a check-in date to continue
                </p>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}