"use client";

import { useEffect, useRef, useState } from "react";

function DecorativeOrb() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="mbs-orb-grad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#5B90C9" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#1A56A0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#030D1A" stopOpacity="0.2" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="55" fill="url(#mbs-orb-grad)" opacity="0.5" />
      <path d="M30 85 Q55 40 90 35" stroke="#C8DCEF" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M25 75 Q52 35 88 28" stroke="#C8DCEF" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.45"/>
      <path d="M35 92 Q60 50 92 44" stroke="#C8DCEF" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.35"/>
      <path d="M40 98 Q65 58 95 52" stroke="#C8DCEF" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.25"/>
    </svg>
  );
}

function TeamIllustration() {
  return (
    <svg viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background navy */}
      <rect width="320" height="280" fill="#0A1E38" />
      {/* Floor */}
      <rect x="0" y="160" width="320" height="120" fill="#05111F" />
      <rect x="0" y="155" width="320" height="10" fill="#0D2645" />
      {/* Ambient glow */}
      <ellipse cx="160" cy="120" rx="140" ry="80" fill="#1A56A0" opacity="0.06" />
      {/* Laptop */}
      <rect x="80" y="130" width="80" height="52" rx="4" fill="#071A30" opacity="0.9" />
      <rect x="84" y="134" width="72" height="40" rx="2" fill="#040E1C" />
      <rect x="84" y="134" width="72" height="40" rx="2" fill="#1A56A0" opacity="0.08" />
      <rect x="70" y="182" width="100" height="6" rx="3" fill="#071A30" opacity="0.7" />
      {/* Notebook */}
      <rect x="180" y="145" width="50" height="38" rx="3" fill="#D6E6F7" opacity="0.9" />
      <line x1="188" y1="155" x2="222" y2="155" stroke="#1A56A0" strokeWidth="1" opacity="0.5" />
      <line x1="188" y1="162" x2="222" y2="162" stroke="#1A56A0" strokeWidth="1" opacity="0.5" />
      <line x1="188" y1="169" x2="210" y2="169" stroke="#1A56A0" strokeWidth="1" opacity="0.5" />
      {/* Person 1 */}
      <ellipse cx="60" cy="108" rx="22" ry="22" fill="#2C6496" />
      <rect x="38" y="128" width="44" height="60" rx="8" fill="#163356" />
      <path d="M38 155 Q60 148 82 155" fill="#112840" />
      <rect x="75" y="148" width="28" height="12" rx="6" fill="#2C6496" transform="rotate(-20 75 148)" />
      {/* Person 2 */}
      <ellipse cx="160" cy="95" rx="20" ry="20" fill="#1A56A0" />
      <rect x="140" y="113" width="40" height="55" rx="8" fill="#0D2645" />
      <rect x="152" y="148" width="30" height="11" rx="5" fill="#1A56A0" transform="rotate(15 152 148)" />
      {/* Person 3 */}
      <ellipse cx="255" cy="100" rx="21" ry="21" fill="#3A7AC0" />
      <rect x="234" y="119" width="42" height="58" rx="8" fill="#0A1E38" />
      {/* Overlay */}
      <rect width="320" height="280" fill="#0A1E38" opacity="0.12" />
      {/* Light leak top right */}
      <ellipse cx="290" cy="20" rx="80" ry="60" fill="#1A56A0" opacity="0.15" />
      {/* Accent line on table edge */}
      <line x1="0" y1="155" x2="320" y2="155" stroke="#1A56A0" strokeWidth="0.7" opacity="0.3" />
    </svg>
  );
}

export default function WhoWeAre() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="bg-[#EEF3FA] px-5 py-12 md:px-14 lg:px-24"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div
        className={`
          flex flex-col md:flex-row gap-4 items-stretch
          rounded-3xl overflow-hidden max-w-6xl mx-auto
          transition-all duration-700
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
      >
        {/* ── Left Card — Stats ── */}
        <div
          className="relative flex flex-col justify-between p-7 rounded-3xl overflow-hidden min-w-[220px] md:w-[260px] shrink-0"
          style={{ background: "linear-gradient(145deg, #1A56A0 0%, #0D2645 60%, #05111F 100%)" }}
        >
          {/* Label */}
          <div>
            <p className="text-[0.55rem] uppercase tracking-[0.2em] text-[#C8DCEF] opacity-70 leading-relaxed"
              style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Marina by Sand<br />In Numbers
            </p>
          </div>

          {/* Orb */}
          <div className="absolute top-4 right-4 w-24 h-24 opacity-70">
            <DecorativeOrb />
          </div>

          {/* Divider */}
          <div className="w-8 h-px bg-[#5B90C9] opacity-40 mt-6" />

          {/* Stats */}
          <div className="flex gap-8 mt-auto pt-10">
            <div>
              <p
                className="text-[42px] font-light text-[#C8DCEF] leading-none tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                150+
              </p>
              <p className="text-[0.65rem] text-[#6A9EC5] mt-1 leading-tight">
                Premier Suppliers
              </p>
            </div>
            <div>
              <p
                className="text-[26px] font-light text-[#C8DCEF] leading-none tracking-tight mt-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                15+
              </p>
              <p className="text-[0.65rem] text-[#6A9EC5] mt-1 leading-tight">
                Years of Hospitality<br />Excellence
              </p>
            </div>
          </div>
        </div>

        {/* ── Middle — Text Content ── */}
        <div
          className={`
            flex-1 bg-[#DDE8F5] rounded-3xl px-8 py-8 flex flex-col justify-center
            transition-all duration-700 delay-150
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          <p className="text-[0.58rem] tracking-[0.2em] uppercase text-[#1A56A0] mb-3">
            Our Story
          </p>
          <h2
            className="text-[2rem] md:text-[2.4rem] font-light text-[#0A1828] mb-2 tracking-tight leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            The Vision Behind{" "}
            <em className="text-[#1A56A0]">Marina by Sand</em>
          </h2>
          <div className="w-8 h-px bg-[#1A56A0] opacity-40 mb-5" />
          <p className="text-[0.73rem] text-[#2C4E72] leading-relaxed mb-4 font-light max-w-sm">
            Born from a belief that every great stay begins with a thoughtfully furnished space, Marina by Sand was founded to bridge the gap between extraordinary design and flawless execution.
          </p>
          <p className="text-[0.73rem] text-[#2C4E72] leading-relaxed font-light max-w-sm">
            As a premier hospitality furnishing partner, we have made it our purpose to elevate every room, lobby, and suite — delivering spaces that guests remember long after they depart.
          </p>
        </div>

        {/* ── Right — Illustration ── */}
        <div
          className={`
            relative rounded-3xl overflow-hidden md:w-[260px] shrink-0 min-h-[220px]
            transition-all duration-700 delay-300
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          <div className="absolute inset-0">
            <TeamIllustration />
          </div>
          <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/5" />
        </div>
      </div>
    </section>
  );
}