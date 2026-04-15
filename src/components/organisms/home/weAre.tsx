"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Images from "../../atoms/images";
import Image from "next/image";

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
      <path d="M30 85 Q55 40 90 35" stroke="#C8DCEF" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M25 75 Q52 35 88 28" stroke="#C8DCEF" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.45" />
      <path d="M35 92 Q60 50 92 44" stroke="#C8DCEF" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.35" />
      <path d="M40 98 Q65 58 95 52" stroke="#C8DCEF" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.25" />
    </svg>
  );
}

export default function WhoWeAre() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { t } = useTranslation()

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
              {t("text.home.weare.inNumbers")}
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
                {t("text.home.weare.suppliersLabel")}
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
                {t("text.home.weare.yearsLabel").split('\n').map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}
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
            {t("text.home.weare.ourStory")}
          </p>
          <h2
            className="text-[2rem] md:text-[2.4rem] font-light text-[#0A1828] mb-2 tracking-tight leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {t("text.home.weare.visionTitle")}{" "}
            <em className="text-[#1A56A0]">Marina by Sand</em>
          </h2>
          <div className="w-8 h-px bg-[#1A56A0] opacity-40 mb-5" />
          <p className="text-[0.73rem] text-[#2C4E72] leading-relaxed mb-4 font-light max-w-sm">
            {t("text.home.weare.text1")}
          </p>
          <p className="text-[0.73rem] text-[#2C4E72] leading-relaxed font-light max-w-sm">
            {t("text.home.weare.text2")}
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
            <Image
              width={200}
              height={200}
              src="https://cdn.yaaqin.xyz/hotel/1771948246446-amnts.jpg"
              alt="Marina by Sand Team"
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/5" />
        </div>
      </div>
    </section>
  );
}