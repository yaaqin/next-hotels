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
          className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-8 text-gray-400 hover:text-gray-900 transition-colors duration-200 text-2xl font-light"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Inner Content */}
          <div className="w-full max-w-5xl mx-auto px-4 md:px-8 flex gap-6">

            {/* Left — Image / Mood — hidden on mobile */}
            <motion.div
              className="hidden md:flex w-1/2 h-[75vh] rounded-3xl overflow-hidden relative bg-gray-100 items-end"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80"
                alt="Resort"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="relative z-10 p-8 bg-gradient-to-t from-black/60 to-transparent w-full">
                <p className="text-white/70 text-xs tracking-widest uppercase mb-1">
                  Marina Bay Suites
                </p>
                <h2 className="text-white text-2xl font-semibold leading-tight">
                  Your perfect stay <br /> starts here.
                </h2>
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              className="w-full md:w-1/2 rounded-3xl border border-blue-100 flex flex-col justify-center px-6 md:px-10 py-10 md:py-12"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              <p className="text-xs tracking-widest uppercase text-blue-400 mb-2">
                Reserve
              </p>
              <h3 className="text-2xl font-semibold text-gray-900 mb-8">
                Plan your visit
              </h3>

              {/* Check-in */}
              <div className="mb-5">
                <label className="block text-xs tracking-widest uppercase text-gray-400 mb-2">
                  Check-in Date <span className="text-blue-400">*</span>
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border border-blue-200 rounded-xl px-4 py-3 h-auto text-sm hover:bg-transparent focus:ring-2 focus:ring-blue-300 focus:border-transparent",
                        !checkin && "text-gray-400"
                      )}
                    >
                      <Calendar01Icon className="mr-2 h-4 w-4 text-blue-400" />
                      {checkin ? format(checkin, "PPP") : "Pilih tanggal check-in"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[200]" align="start">
                    <Calendar
                      mode="single"
                      selected={checkin}
                      onSelect={setCheckin}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                      className="rounded-lg border"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Adults */}
              <div className="mb-10">
                <label className="block text-xs tracking-widest uppercase text-gray-400 mb-2">
                  Adults{" "}
                  <span className="text-gray-300 normal-case tracking-normal">
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
                  className="w-full border border-blue-200 rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
                />
              </div>

              {/* Book Button */}
              <button
                onClick={handleBook}
                disabled={!checkin}
                className={`w-full py-4 rounded-xl text-sm tracking-widest uppercase font-medium transition-all duration-300
                  ${checkin
                    ? "bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-200 hover:shadow-blue-300"
                    : "bg-gray-100 text-gray-300 cursor-not-allowed"
                  }
                `}
              >
                Book Now
              </button>

              {!checkin && (
                <p className="text-center text-xs text-gray-300 mt-3">
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