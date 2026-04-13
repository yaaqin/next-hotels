"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// ─── DATA ────────────────────────────────────────────────────────────────────



// ─── SVG DECORATIONS ─────────────────────────────────────────────────────────

function WaveDecor() {
  return (
    <svg
      className="absolute bottom-4 right-4 w-11 h-11 opacity-30 pointer-events-none"
      viewBox="0 0 64 64"
      fill="none"
    >
      <path
        d="M8 56 Q32 8 56 56"
        stroke="#1A56A0"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M16 56 Q32 20 48 56"
        stroke="#1A56A0"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M24 56 Q32 32 40 56"
        stroke="#1A56A0"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

function SphereDecor() {
  return (
    <svg
      className="absolute top-4 right-4 w-9 h-9 pointer-events-none"
      viewBox="0 0 48 48"
      fill="none"
    >
      <defs>
        <radialGradient id="mbs-sphere" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#5B90C9" />
          <stop offset="55%" stopColor="#1A56A0" />
          <stop offset="100%" stopColor="#030D1A" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#mbs-sphere)" />
      <ellipse
        cx="18"
        cy="17"
        rx="5"
        ry="4"
        fill="white"
        opacity="0.18"
        transform="rotate(-30 18 17)"
      />
    </svg>
  );
}

function DiningRoomSVG() {
  return (
    <svg
      viewBox="0 0 600 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="600" height="240" fill="#030D1A" />
      {/* floor */}
      <rect x="0" y="175" width="600" height="65" fill="#05111F" />
      <line x1="0" y1="175" x2="600" y2="175" stroke="#0A1E38" strokeWidth="1" />
      {/* faint vertical lines */}
      {[100, 200, 300, 400, 500].map((x, i) => (
        <line
          key={i}
          x1={x}
          y1="0"
          x2={x}
          y2="240"
          stroke="#0A1E38"
          strokeWidth="0.7"
          opacity="0.5"
        />
      ))}
      {/* pendant glow */}
      <ellipse cx="300" cy="100" rx="90" ry="75" fill="#1A56A0" opacity="0.05" />
      <circle
        cx="300"
        cy="100"
        r="62"
        stroke="#1A56A0"
        strokeWidth="1.2"
        fill="none"
        opacity="0.22"
      />
      <circle cx="300" cy="100" r="47" fill="#03090F" opacity="0.75" />
      {/* light pool */}
      <ellipse cx="300" cy="176" rx="60" ry="7" fill="#1A56A0" opacity="0.1" />
      {/* table */}
      <ellipse cx="300" cy="176" rx="105" ry="11" fill="#112840" />
      <rect x="288" y="176" width="24" height="30" fill="#0A1E38" />
      {/* chairs left */}
      <ellipse cx="160" cy="182" rx="34" ry="9" fill="#0A1E38" />
      <rect x="144" y="158" width="30" height="24" rx="4" fill="#07152A" />
      <rect x="141" y="147" width="36" height="14" rx="4" fill="#05101F" />
      {/* chairs right */}
      <ellipse cx="440" cy="182" rx="34" ry="9" fill="#0A1E38" />
      <rect x="426" y="158" width="30" height="24" rx="4" fill="#07152A" />
      <rect x="423" y="147" width="36" height="14" rx="4" fill="#05101F" />
      {/* accent line */}
      <line
        x1="50"
        y1="174"
        x2="550"
        y2="174"
        stroke="#1A56A0"
        strokeWidth="0.7"
        opacity="0.3"
      />
    </svg>
  );
}

// ─── REUSABLE DIVIDER ─────────────────────────────────────────────────────────

function Divider({ light = false }: { light?: boolean }) {
  return (
    <div
      className={`w-8 h-px mb-3 ${light ? "bg-[#5B90C9]" : "bg-[#1A56A0]"} opacity-50`}
    />
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function WhyChoose() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { t } = useTranslation()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const anim = (delay: number) =>
    `transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`;

  const delayStyle = (ms: number): React.CSSProperties => ({
    transitionDelay: `${ms}ms`,
  });

  const cards = [
    {
      id: "end-to-end",
      badge: t("text.home.whychoose.cards.endToEnd.badge"),
      title: t("text.home.whychoose.cards.endToEnd.title"),
      desc: t("text.home.whychoose.cards.endToEnd.desc"),
    },
    {
      id: "after-sales",
      badge: t("text.home.whychoose.cards.afterSales.badge"),
      title: t("text.home.whychoose.cards.afterSales.title"),
      desc: t("text.home.whychoose.cards.afterSales.desc"),
    },
    {
      id: "no-variety",
      badge: t("text.home.whychoose.cards.noVariety.badge"),
      title: t("text.home.whychoose.cards.noVariety.title"),
      desc: t("text.home.whychoose.cards.noVariety.desc"),
    },
    {
      id: "superior-quality",
      badge: t("text.home.whychoose.cards.superiorQuality.badge"),
      title: t("text.home.whychoose.cards.superiorQuality.title"),
      desc: t("text.home.whychoose.cards.superiorQuality.desc"),
    },
    {
      id: "bespoke",
      badge: t("text.home.whychoose.cards.bespoke.badge"),
      title: t("text.home.whychoose.cards.bespoke.title"),
      desc: t("text.home.whychoose.cards.bespoke.desc"),
    },
  ];

  return (
    <section
      ref={ref}
      className="bg-[#EEF3FA] px-5 py-12 md:px-14 lg:px-24"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* ── HEADING ── */}
      <div
        className={`mb-10 ${anim(0)}`}
        style={delayStyle(0)}
      >
        <p
          className="text-[0.6rem] tracking-[0.2em] uppercase text-[#1A56A0] mb-2 font-normal"
        >
          {t("text.home.whychoose.diff")}
        </p>
        <h2
          className="text-[2rem] md:text-[2.8rem] lg:text-[3.2rem] font-light text-[#0A1828] leading-tight tracking-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {t("text.home.whychoose.title")}{" "}
          <br className="hidden sm:block" />
          {t("text.home.whychoose.titleChoose")}{" "}
          <em className="text-[#1A56A0] not-italic" style={{ fontStyle: "italic" }}>
            Marina by Sand
          </em>
        </h2>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE LAYOUT  (< md)
      ══════════════════════════════════════════ */}
      <div className="flex flex-col gap-3 md:hidden">

        {/* Card 1 — End-to-End */}
        <div
          className={`relative rounded-[20px] bg-[#DDE8F5] p-6 overflow-hidden ${anim(100)}`}
          style={delayStyle(100)}
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#1A56A0] opacity-[0.07] pointer-events-none" />
          <WaveDecor />
          <p className="text-[0.55rem] tracking-[0.18em] uppercase text-[#1A56A0] mb-2">
            {cards[0].badge}
          </p>
          <Divider />
          <h3
            className="text-[1.15rem] font-medium text-[#0A1828] leading-snug mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {cards[0].title}
          </h3>
          <p className="text-[0.72rem] leading-relaxed text-[#2C4E72] font-light">
            {cards[0].desc}
          </p>
        </div>

        {/* Card 2 — After-Sales */}
        <div
          className={`relative rounded-[20px] bg-[#DDE8F5] p-6 overflow-hidden ${anim(150)}`}
          style={delayStyle(150)}
        >
          <SphereDecor />
          <p className="text-[0.55rem] tracking-[0.18em] uppercase text-[#1A56A0] mb-2">
            {cards[1].badge}
          </p>
          <Divider />
          <h3
            className="text-[1.15rem] font-medium text-[#0A1828] leading-snug mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {cards[1].title}
          </h3>
          <p className="text-[0.72rem] leading-relaxed text-[#2C4E72] font-light">
            {cards[1].desc}
          </p>
        </div>

        {/* Card 3 — Superior Quality (image) */}
        <div
          className={`relative rounded-[20px] overflow-hidden ${anim(200)}`}
          style={{ ...delayStyle(200), minHeight: 220 }}
        >
          <div className="absolute inset-0">
            <DiningRoomSVG />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#030D1A] via-[#030D1A]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <p className="text-[0.55rem] tracking-[0.18em] uppercase text-[#5B90C9] mb-2">
              {cards[3].badge}
            </p>
            <div className="w-6 h-px bg-[#5B90C9] opacity-50 mb-3" />
            <h3
              className="text-[1.15rem] font-medium text-[#C8DCEF] leading-snug mb-2"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {cards[3].title}
            </h3>
            <p className="text-[0.7rem] leading-relaxed text-[#6A9EC5] font-light max-w-xs">
              {cards[3].desc}
            </p>
          </div>
        </div>

        {/* Card 4 — No Variety */}
        <div
          className={`relative rounded-[20px] bg-[#0A1E38] p-6 overflow-hidden ${anim(250)}`}
          style={delayStyle(250)}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#1A56A0] opacity-[0.08] pointer-events-none" />
          <p className="text-[0.55rem] tracking-[0.18em] uppercase text-[#5B90C9] mb-2">
            {cards[2].badge}
          </p>
          <Divider light />
          <h3
            className="text-[1.15rem] font-medium text-[#C8DCEF] leading-snug mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {cards[2].title}
          </h3>
          <p className="text-[0.72rem] leading-relaxed text-[#6A9EC5] font-light">
            {cards[2].desc}
          </p>
        </div>

        {/* Card 5 — Bespoke */}
        <div
          className={`relative rounded-[20px] bg-[#112840] p-6 overflow-hidden ${anim(300)}`}
          style={delayStyle(300)}
        >
          <p className="text-[0.55rem] tracking-[0.18em] uppercase text-[#5B90C9] mb-2">
            {cards[4].badge}
          </p>
          <Divider light />
          <h3
            className="text-[1.15rem] font-medium text-[#C8DCEF] leading-snug mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {cards[4].title}
          </h3>
          <p className="text-[0.72rem] leading-relaxed text-[#6A9EC5] font-light">
            {cards[4].desc}
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          DESKTOP LAYOUT  (≥ md)
      ══════════════════════════════════════════ */}
      <div
        className="hidden md:grid gap-4"
        style={{
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "auto auto",
        }}
      >
        {/* Col 1, Row 1 — End-to-End */}
        <div
          className={`relative rounded-[20px] bg-[#DDE8F5] p-7 overflow-hidden min-h-[190px] ${anim(100)}`}
          style={delayStyle(100)}
        >
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[#1A56A0] opacity-[0.07] pointer-events-none" />
          <WaveDecor />
          <p className="text-[0.55rem] tracking-[0.18em] uppercase text-[#1A56A0] mb-2">
            {cards[0].badge}
          </p>
          <Divider />
          <h3
            className="text-[1.2rem] font-medium text-[#0A1828] leading-snug mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {cards[0].title}
          </h3>
          <p className="text-[0.73rem] leading-relaxed text-[#2C4E72] font-light max-w-[200px]">
            {cards[0].desc}
          </p>
        </div>

        {/* Col 2, Row 1 — After-Sales */}
        <div
          className={`relative rounded-[20px] bg-[#DDE8F5] p-7 overflow-hidden min-h-[190px] ${anim(200)}`}
          style={delayStyle(200)}
        >
          <SphereDecor />
          <p className="text-[0.55rem] tracking-[0.18em] uppercase text-[#1A56A0] mb-2">
            {cards[1].badge}
          </p>
          <Divider />
          <h3
            className="text-[1.2rem] font-medium text-[#0A1828] leading-snug mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {cards[1].title}
          </h3>
          <p className="text-[0.73rem] leading-relaxed text-[#2C4E72] font-light">
            {cards[1].desc}
          </p>
        </div>

        {/* Col 3, Row 1–2 — No Variety (tall) + Bespoke nested */}
        <div
          className={`relative rounded-[20px] bg-[#0A1E38] p-7 overflow-hidden row-span-2 flex flex-col justify-between ${anim(300)}`}
          style={{ ...delayStyle(300), minHeight: 400 }}
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#1A56A0] opacity-[0.07] pointer-events-none" />
          <div>
            <p className="text-[0.55rem] tracking-[0.18em] uppercase text-[#5B90C9] mb-2">
              {cards[2].badge}
            </p>
            <Divider light />
            <h3
              className="text-[1.4rem] font-medium text-[#C8DCEF] leading-snug mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {cards[2].title}
            </h3>
            <p className="text-[0.73rem] leading-relaxed text-[#6A9EC5] font-light">
              {cards[2].desc}
            </p>
          </div>

          {/* Nested Bespoke card */}
          <div className="rounded-[14px] bg-[#112840] p-5 mt-4">
            <p className="text-[0.52rem] tracking-[0.18em] uppercase text-[#5B90C9] mb-2">
              {cards[4].badge}
            </p>
            <div className="w-6 h-px bg-[#5B90C9] opacity-40 mb-3" />
            <h3
              className="text-[1rem] font-medium text-[#C8DCEF] leading-snug mb-2"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {cards[4].title}
            </h3>
            <p className="text-[0.7rem] leading-relaxed text-[#6A9EC5] font-light">
              {cards[4].desc}
            </p>
          </div>
        </div>

        {/* Col 1–2, Row 2 — Superior Quality (image) */}
        <div
          className={`relative rounded-[20px] overflow-hidden col-span-2 ${anim(400)}`}
          style={{ ...delayStyle(400), minHeight: 210 }}
        >
          <div className="absolute inset-0">
            <DiningRoomSVG />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#030D1A] via-[#030D1A]/55 to-transparent" />
          <div className="absolute bottom-0 left-0 p-7">
            <p className="text-[0.55rem] tracking-[0.18em] uppercase text-[#5B90C9] mb-2">
              {cards[3].badge}
            </p>
            <div className="w-6 h-px bg-[#5B90C9] opacity-50 mb-3" />
            <h3
              className="text-[1.3rem] font-medium text-[#C8DCEF] leading-snug mb-2"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {cards[3].title}
            </h3>
            <p className="text-[0.73rem] leading-relaxed text-[#6A9EC5] font-light max-w-sm">
              {cards[3].desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}