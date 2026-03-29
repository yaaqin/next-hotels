import { useEffect, useRef, useState } from "react";

const cards = [
  {
    id: "end-to-end",
    title: "End-to-End Solutions",
    desc: "We manage every aspect of your furnishing project, saving you time and resources.",
    visual: (
      <div className="absolute bottom-4 right-4 w-16 h-16 opacity-60">
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 56 Q32 8 56 56" stroke="#C8A97E" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M16 56 Q32 20 48 56" stroke="#C8A97E" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>
          <path d="M24 56 Q32 32 40 56" stroke="#C8A97E" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>
        </svg>
      </div>
    ),
    bg: "bg-[#F4F0EA]",
    textColor: "text-[#2C2416]",
    descColor: "text-[#6B5B45]",
  },
  {
    id: "after-sales",
    title: "After-Sales Support",
    desc: "We are committed to providing ongoing support & after-sales service to address any future needs or concerns.",
    visual: null,
    bg: "bg-[#EDE8E0]",
    textColor: "text-[#2C2416]",
    descColor: "text-[#6B5B45]",
  },
  {
    id: "no-variety",
    title: "No Variety Restrictions",
    desc: "We partner with any vendor meeting our quality standards, providing the broadest selection of furniture solutions to suit your needs and preferences.",
    visual: null,
    bg: "bg-[#3D2B1F]",
    textColor: "text-[#F4EDE3]",
    descColor: "text-[#C8A97E]",
  },
  {
    id: "superior-quality",
    title: "Superior Quality",
    desc: "Our partnerships with the best suppliers grant us access to the finest materials, craftsmanship, and quality control processes.",
    visual: null,
    bg: "bg-[#2A1F14]",
    textColor: "text-[#F4EDE3]",
    descColor: "text-[#C8A97E]",
  },
  {
    id: "bespoke",
    title: "Bespoke Furniture",
    desc: "We specialize in sourcing custom-made furniture pieces that perfectly match your unique vision and requirements.",
    visual: null,
    bg: "bg-[#4A3728]",
    textColor: "text-[#F4EDE3]",
    descColor: "text-[#C8A97E]",
  },
];

function DiningRoomSVG() {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="0" y="0" width="400" height="220" fill="#1A1008" />
      {[0, 28, 56, 84, 112, 140, 168, 196, 224, 252, 280, 308, 336, 364, 392].map((x, i) => (
        <rect key={i} x={x} y="0" width="2" height="220" fill="#2A1A0A" opacity="0.7" />
      ))}
      <rect x="0" y="160" width="400" height="60" fill="#3D2B1A" />
      <circle cx="200" cy="80" r="55" stroke="#C8A97E" strokeWidth="2" fill="none" opacity="0.5" />
      <circle cx="200" cy="80" r="50" fill="#1E1208" opacity="0.6" />
      <ellipse cx="200" cy="162" rx="90" ry="10" fill="#F0EAE0" />
      <rect x="190" y="162" width="20" height="30" fill="#C8B89A" />
      <ellipse cx="120" cy="168" rx="30" ry="8" fill="#8B6B4A" />
      <rect x="110" y="150" width="20" height="18" rx="3" fill="#7A5D3E" />
      <rect x="108" y="140" width="24" height="12" rx="4" fill="#6B5035" />
      <ellipse cx="280" cy="168" rx="30" ry="8" fill="#8B6B4A" />
      <rect x="270" y="150" width="20" height="18" rx="3" fill="#7A5D3E" />
      <rect x="268" y="140" width="24" height="12" rx="4" fill="#6B5035" />
      <ellipse cx="200" cy="80" rx="120" ry="60" fill="#C8A97E" opacity="0.04" />
    </svg>
  );
}

function DecorativeSphere() {
  return (
    <div className="absolute top-3 right-3 w-12 h-12">
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="sphere-grad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#D4A574" />
            <stop offset="50%" stopColor="#8B6040" />
            <stop offset="100%" stopColor="#3D2010" />
          </radialGradient>
        </defs>
        <circle cx="24" cy="24" r="20" fill="url(#sphere-grad)" />
        <ellipse cx="18" cy="17" rx="5" ry="4" fill="white" opacity="0.15" transform="rotate(-30 18 17)" />
      </svg>
    </div>
  );
}

export default function WhyChoose() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const fadeIn = (delay: number) =>
    `transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`;

  return (
    <section
      ref={ref}
      className="bg-[#F5F0E8] px-4 py-12 md:px-12 lg:px-20 font-serif"
    >
      {/* Heading */}
      <h2
        className={`text-4xl md:text-5xl font-light text-[#2C2416] mb-8 tracking-tight transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        Why Choose{" "}
        <span className="text-[#C8A97E] italic font-normal">Compatto</span>
      </h2>

      {/* ── MOBILE LAYOUT (< md) ── */}
      <div className="flex flex-col gap-3 md:hidden">

        {/* Row 1: End-to-End + After-Sales side by side */}
        <div className="grid grid-cols-2 gap-3">
          {/* End-to-End */}
          <div
            className={`relative rounded-2xl p-4 overflow-hidden ${fadeIn(100)} ${cards[0].bg}`}
            style={{ transitionDelay: "100ms", minHeight: 160 }}
          >
            {cards[0].visual}
            <h3 className={`text-sm font-semibold mb-1 leading-snug ${cards[0].textColor}`}>
              {cards[0].title}
            </h3>
            <p className={`text-xs leading-relaxed ${cards[0].descColor}`}>
              {cards[0].desc}
            </p>
          </div>

          {/* After-Sales */}
          <div
            className={`relative rounded-2xl p-4 overflow-hidden ${fadeIn(150)} ${cards[1].bg}`}
            style={{ transitionDelay: "150ms", minHeight: 160 }}
          >
            <DecorativeSphere />
            <h3 className={`text-sm font-semibold mb-1 leading-snug ${cards[1].textColor}`}>
              {cards[1].title}
            </h3>
            <p className={`text-xs leading-relaxed ${cards[1].descColor}`}>
              {cards[1].desc}
            </p>
          </div>
        </div>

        {/* Superior Quality — full width with image bg */}
        <div
          className={`relative rounded-2xl overflow-hidden ${fadeIn(200)}`}
          style={{ transitionDelay: "200ms", minHeight: 200 }}
        >
          <div className="absolute inset-0 opacity-70">
            <DiningRoomSVG />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A0E06] via-[#1A0E06]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-5">
            <h3 className={`text-lg font-semibold mb-1 ${cards[3].textColor}`}>
              {cards[3].title}
            </h3>
            <p className={`text-xs leading-relaxed max-w-xs ${cards[3].descColor}`}>
              {cards[3].desc}
            </p>
          </div>
        </div>

        {/* No Variety + Bespoke side by side */}
        <div className="grid grid-cols-2 gap-3">
          {/* No Variety */}
          <div
            className={`relative rounded-2xl p-4 overflow-hidden ${fadeIn(250)} ${cards[2].bg}`}
            style={{ transitionDelay: "250ms", minHeight: 160 }}
          >
            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[#C8A97E] opacity-10 blur-2xl pointer-events-none" />
            <h3 className={`text-sm font-semibold mb-1 leading-snug ${cards[2].textColor}`}>
              {cards[2].title}
            </h3>
            <p className={`text-xs leading-relaxed ${cards[2].descColor}`}>
              {cards[2].desc}
            </p>
          </div>

          {/* Bespoke */}
          <div
            className={`relative rounded-2xl p-4 overflow-hidden ${fadeIn(300)} ${cards[4].bg}`}
            style={{ transitionDelay: "300ms", minHeight: 160 }}
          >
            <h3 className={`text-sm font-semibold mb-1 leading-snug ${cards[4].textColor}`}>
              {cards[4].title}
            </h3>
            <p className={`text-xs leading-relaxed ${cards[4].descColor}`}>
              {cards[4].desc}
            </p>
          </div>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT (≥ md) ── */}
      <div
        className="hidden md:grid gap-4"
        style={{
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "auto auto",
        }}
      >
        {/* Card 1 - End-to-End */}
        <div
          className={`relative rounded-2xl p-6 overflow-hidden min-h-[180px] transition-all duration-700 delay-100 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          } ${cards[0].bg}`}
        >
          {cards[0].visual}
          <h3 className={`text-lg font-semibold mb-2 leading-snug ${cards[0].textColor}`}>
            {cards[0].title}
          </h3>
          <p className={`text-sm leading-relaxed max-w-[200px] ${cards[0].descColor}`}>
            {cards[0].desc}
          </p>
        </div>

        {/* Card 2 - After-Sales */}
        <div
          className={`relative rounded-2xl p-6 overflow-hidden min-h-[180px] transition-all duration-700 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          } ${cards[1].bg}`}
        >
          <DecorativeSphere />
          <h3 className={`text-lg font-semibold mb-2 leading-snug ${cards[1].textColor}`}>
            {cards[1].title}
          </h3>
          <p className={`text-sm leading-relaxed ${cards[1].descColor}`}>
            {cards[1].desc}
          </p>
        </div>

        {/* Card 3 - No Variety (tall, spans 2 rows) */}
        <div
          className={`relative rounded-2xl p-7 overflow-hidden row-span-2 flex flex-col justify-between transition-all duration-700 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          } ${cards[2].bg}`}
          style={{ minHeight: "380px" }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#C8A97E] opacity-10 blur-2xl pointer-events-none" />
          <div>
            <h3 className={`text-2xl font-semibold leading-snug mb-3 ${cards[2].textColor}`}>
              {cards[2].title}
            </h3>
            <p className={`text-sm leading-relaxed ${cards[2].descColor}`}>
              {cards[2].desc}
            </p>
          </div>
          <div className={`rounded-xl p-5 mt-6 ${cards[4].bg}`}>
            <h3 className={`text-base font-semibold mb-1 ${cards[4].textColor}`}>
              {cards[4].title}
            </h3>
            <p className={`text-xs leading-relaxed ${cards[4].descColor}`}>
              {cards[4].desc}
            </p>
          </div>
        </div>

        {/* Row 2: Superior Quality (spans col 1-2) */}
        <div
          className={`relative rounded-2xl overflow-hidden col-span-2 transition-all duration-700 delay-400 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          } ${cards[3].bg}`}
          style={{ minHeight: "200px" }}
        >
          <div className="absolute inset-0 opacity-70">
            <DiningRoomSVG />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A0E06] via-[#1A0E06]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <h3 className={`text-xl font-semibold mb-1 ${cards[3].textColor}`}>
              {cards[3].title}
            </h3>
            <p className={`text-sm leading-relaxed max-w-xs ${cards[3].descColor}`}>
              {cards[3].desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}