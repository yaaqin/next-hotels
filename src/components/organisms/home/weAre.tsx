import { useEffect, useRef, useState } from "react";

function DecorativeOrb() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="orb-grad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#E8D5B7" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#C8A97E" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#8B6040" stopOpacity="0.3" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="55" fill="url(#orb-grad)" opacity="0.5" />
      {/* Swirl lines */}
      <path d="M30 85 Q55 40 90 35" stroke="#F0E0C8" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8"/>
      <path d="M25 75 Q52 35 88 28" stroke="#F0E0C8" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M35 92 Q60 50 92 44" stroke="#F0E0C8" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>
      <path d="M40 98 Q65 58 95 52" stroke="#F0E0C8" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.3"/>
    </svg>
  );
}

function TeamIllustration() {
  return (
    <svg viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background warm tone */}
      <rect width="320" height="280" fill="#C8A97E" />
      {/* Table surface */}
      <rect x="0" y="160" width="320" height="120" fill="#8B6840" />
      <rect x="0" y="155" width="320" height="12" fill="#A07848" />
      {/* Table items - laptop */}
      <rect x="80" y="130" width="80" height="52" rx="4" fill="#2A1F14" opacity="0.8" />
      <rect x="84" y="134" width="72" height="40" rx="2" fill="#1A0E06" />
      <rect x="70" y="182" width="100" height="6" rx="3" fill="#2A1F14" opacity="0.6" />
      {/* Notebook */}
      <rect x="180" y="145" width="50" height="38" rx="3" fill="#F4EDE3" opacity="0.9" />
      <line x1="188" y1="155" x2="222" y2="155" stroke="#C8A97E" strokeWidth="1" />
      <line x1="188" y1="162" x2="222" y2="162" stroke="#C8A97E" strokeWidth="1" />
      <line x1="188" y1="169" x2="210" y2="169" stroke="#C8A97E" strokeWidth="1" />
      {/* Person 1 - left, leaning in */}
      <ellipse cx="60" cy="108" rx="22" ry="22" fill="#D4956A" />
      <rect x="38" y="128" width="44" height="60" rx="8" fill="#8B5E3C" />
      <path d="M38 155 Q60 148 82 155" fill="#7A5030" />
      {/* Person 1 arm */}
      <rect x="75" y="148" width="28" height="12" rx="6" fill="#D4956A" transform="rotate(-20 75 148)" />
      {/* Person 2 - center */}
      <ellipse cx="160" cy="95" rx="20" ry="20" fill="#C87A50" />
      <rect x="140" y="113" width="40" height="55" rx="8" fill="#5C3D28" />
      {/* Person 2 arm */}
      <rect x="152" y="148" width="30" height="11" rx="5" fill="#C87A50" transform="rotate(15 152 148)" />
      {/* Person 3 - right */}
      <ellipse cx="255" cy="100" rx="21" ry="21" fill="#B8724A" />
      <rect x="234" y="119" width="42" height="58" rx="8" fill="#4A3020" />
      {/* Warm overlay for mood */}
      <rect width="320" height="280" fill="#C8A97E" opacity="0.15" />
      {/* Light leak top right */}
      <ellipse cx="290" cy="20" rx="80" ry="60" fill="#F4D4A0" opacity="0.2" />
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
      className="bg-[#F5F0E8] px-6 py-12 md:px-12 lg:px-20 font-serif"
    >
      <div
        className={`
          flex flex-col md:flex-row gap-4 items-stretch
          rounded-3xl overflow-hidden max-w-6xl mx-auto
          transition-all duration-700
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
      >
        {/* Left Card - Stats */}
        <div
          className="relative flex flex-col justify-between p-7 rounded-3xl overflow-hidden min-w-[220px] md:w-[260px] shrink-0"
          style={{ background: "linear-gradient(145deg, #C8A97E 0%, #9B7A52 60%, #7A5C38 100%)" }}
        >
          {/* Label top */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#F4EDE3] opacity-70 leading-tight font-sans">
              OUR COMPANY<br />IN NUMBERS
            </p>
          </div>

          {/* Decorative orb top right */}
          <div className="absolute top-4 right-4 w-24 h-24 opacity-70">
            <DecorativeOrb />
          </div>

          {/* Stats bottom */}
          <div className="flex gap-8 mt-auto pt-16">
            <div>
              <p className="text-[42px] font-light text-[#F4EDE3] leading-none tracking-tight">
                150+
              </p>
              <p className="text-xs text-[#E8D5B7] mt-1 font-sans leading-tight">
                Furniture Suppliers
              </p>
            </div>
            <div>
              <p className="text-2xl font-light text-[#F4EDE3] leading-none tracking-tight mt-2">
                15+
              </p>
              <p className="text-xs text-[#E8D5B7] mt-1 font-sans leading-tight">
                Years of Industry<br />Experience
              </p>
            </div>
          </div>
        </div>

        {/* Middle - Text Content */}
        <div
          className={`
            flex-1 bg-[#F0EBE2] rounded-3xl px-8 py-8 flex flex-col justify-center
            transition-all duration-700 delay-150
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          <h2 className="text-4xl font-light text-[#2C2416] mb-5 tracking-tight leading-tight">
            Who{" "}
            <span className="text-[#C8A97E] italic">We</span>{" "}
            Are
          </h2>
          <p className="text-sm text-[#5C4A35] leading-relaxed mb-4 font-sans max-w-sm">
            At Compatto, we understand the challenges of creating exceptional spaces that blend elegance, quality, and functionality.
          </p>
          <p className="text-sm text-[#5C4A35] leading-relaxed font-sans max-w-sm">
            As Greece's premier furniture solutions provider, we've made it our mission to simplify the furnishing process, ensuring that every project is executed flawlessly from initial consultation to final installation.
          </p>
        </div>

        {/* Right - Image */}
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
          {/* Subtle vignette */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/10" />
        </div>
      </div>
    </section>
  );
}