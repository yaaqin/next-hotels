"use client";

import { motion } from "framer-motion";
import { userRecentActivityListState } from "@/src/models/userRecentActivity/list";
import { formatDate, formatPrice, getNights, getRoomName, getStatusCfg } from "./drawer";

interface RecentActivityCardProps {
  booking: userRecentActivityListState;
  index: number;
  onClick: () => void;
}

export function RecentActivityCard({ booking, index, onClick }: RecentActivityCardProps) {
  const cfg = getStatusCfg(booking.status);
  const nights = getNights(booking.checkInDate, booking.checkOutDate);
  const roomName = getRoomName(booking);
  const imageUrl = booking.items?.[0]?.roomType?.image?.url ?? null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: "easeOut" }}
      onClick={onClick}
      className="group flex rounded-2xl border border-gray-100 bg-white overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-blue-50 hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="relative w-36 h-24 shrink-0 overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={roomName}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <span className="text-2xl opacity-30">🏨</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
      </div>

      <div className="flex-1 px-5 py-4 flex flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-gray-400 tracking-widest uppercase truncate">
              {booking.site?.nama ?? booking.siteCode} · {booking.bookingCode}
            </p>
            <h3 className="text-sm font-semibold text-gray-900 truncate mt-0.5">{roomName}</h3>
          </div>
          <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${cfg.badge} ${cfg.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>

        <div className="flex items-end justify-between mt-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{formatDate(booking.checkInDate)}</span>
            <span className="text-gray-300">→</span>
            <span>{formatDate(booking.checkOutDate)}</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-400">{nights}n</span>
          </div>
          <p className="text-sm font-bold text-blue-600 shrink-0">{formatPrice(booking.totalAmount)}</p>
        </div>
      </div>

      <div className="flex items-center pr-4 text-gray-200 group-hover:text-blue-400 transition-colors text-lg shrink-0">→</div>
    </motion.article>
  );
}