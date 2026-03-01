"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BookingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingOverlay({ isOpen, onClose }: BookingOverlayProps) {
  const [checkin, setCheckin] = useState("");
  const [adults, setAdults] = useState("");

  const handleBook = () => {
    if (!checkin) return;
    const params = new URLSearchParams({ checkin });
    if (adults) params.set("adult", adults);
    window.location.href = `/booking?${params.toString()}`;
  };

  const today = new Date().toISOString().split("T")[0];

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
          <div className="w-full max-w-5xl mx-auto px-8 h-[75vh] flex gap-6">
            {/* Left — Image / Mood */}
            <motion.div
              className="w-1/2 rounded-3xl overflow-hidden relative bg-gray-100 flex items-end"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {/* Replace src with your actual image */}
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
              className="w-1/2 rounded-3xl border border-blue-100 flex flex-col justify-center px-10 py-12"
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
                <input
                  type="date"
                  min={today}
                  value={checkin}
                  onChange={(e) => setCheckin(e.target.value)}
                  className="w-full border border-blue-200 rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
                />
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
                  ${
                    checkin
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