"use client";
import { useState, useEffect, useRef, ReactNode, MouseEvent, JSX } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface RevealDivProps {
  className?: string;
  children: ReactNode;
  delay?: number;
}

interface HeaderProps {
  onMenu: () => void;
  onBook: () => void;
}

interface OverlayProps {
  open: boolean;
  onClose: () => void;
}

interface SectionImageTextProps {
  image: string;
  alt: string;
  title: string;
  text: string;
  link?: string;
  linkLabel?: string;
  reverse?: boolean;
}

interface CardItem {
  img: string;
  title: string;
  text: string;
  link: string;
  linkLabel: string;
  tall: boolean;
}

interface SuiteCard {
  img: string;
  label: string;
  href: string;
}

interface SelectField {
  label: string;
  options: string[];
}

interface SectionPromoProps {
  img: string;
  label: string;
  title: string;
  text: string;
  btnLabel: string;
  btnHref: string;
  reverse?: boolean;
}

// ─── Google Fonts ────────────────────────────────────────────────────────────
const FontLoader = (): JSX.Element => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Cormorant:ital,wght@0,300;1,300&family=Jost:wght@300;400&display=swap');

    :root {
      --cream: #f5f0e8;
      --warm-white: #faf8f4;
      --ink: #1a1714;
      --muted: #6b6560;
      --gold: #b8936a;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--warm-white);
      color: var(--ink);
      font-family: 'Jost', sans-serif;
      font-weight: 300;
    }

    .cormorant { font-family: 'Cormorant Garamond', serif; }
    .cormorant-italic { font-family: 'Cormorant', serif; font-style: italic; font-weight: 300; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fade-up { animation: fadeUp 1.2s cubic-bezier(.22,1,.36,1) both; }
    .delay-300 { animation-delay: .3s; }
    .delay-600 { animation-delay: .6s; }
    .delay-900 { animation-delay: .9s; }

    .nav-overlay {
      position: fixed; inset: 0; background: var(--ink);
      transform: translateX(-100%);
      transition: transform .6s cubic-bezier(.76,0,.24,1);
      z-index: 100;
    }
    .nav-overlay.open { transform: translateX(0); }

    .booking-overlay {
      position: fixed; inset: 0; background: var(--cream);
      transform: translateX(100%);
      transition: transform .6s cubic-bezier(.76,0,.24,1);
      z-index: 100;
    }
    .booking-overlay.open { transform: translateX(0); }

    .reveal { opacity: 0; transform: translateY(40px); transition: opacity .9s ease, transform .9s ease; }
    .reveal.visible { opacity: 1; transform: none; }

    hr.ornament {
      border: none;
      border-top: 1px solid rgba(26,23,20,.15);
      margin: 0 auto;
      width: 0;
      transition: width 1.2s ease;
    }
    hr.ornament.visible { width: 100%; }

    .custom-select select {
      appearance: none;
      background: transparent;
      border: none;
      border-bottom: 1px solid var(--muted);
      padding: 8px 28px 8px 0;
      font-family: 'Jost', sans-serif;
      font-weight: 300;
      font-size: 13px;
      letter-spacing: .12em;
      color: var(--ink);
      cursor: pointer;
      width: 100%;
    }
  `}</style>
);

// ─── Scroll Reveal Hook ──────────────────────────────────────────────────────
function useReveal(): React.MutableRefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function RevealDiv({ className = "", children, delay = 0 }: RevealDivProps): JSX.Element {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

function Ornament(): JSX.Element {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal px-8 md:px-16 py-12">
      <hr className="ornament visible" />
    </div>
  );
}

// ─── Hover Button Helper ──────────────────────────────────────────────────────
function handleHoverIn(e: MouseEvent<HTMLAnchorElement>): void {
  e.currentTarget.style.background = "var(--ink)";
  e.currentTarget.style.color = "#fff";
}

function handleHoverOut(e: MouseEvent<HTMLAnchorElement>): void {
  e.currentTarget.style.background = "transparent";
  e.currentTarget.style.color = "var(--ink)";
}

// ─── Header ──────────────────────────────────────────────────────────────────
function Header({ onMenu, onBook }: HeaderProps): JSX.Element {
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textColor = scrolled ? "var(--ink)" : "#fff";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(250,248,244,.95)" : "transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(26,23,20,.08)" : "none",
      }}
    >
      <div className="w-full mx-auto p-4 flex items-center justify-between">
        <button
          onClick={onMenu}
          className="text-xs tracking-[.2em] px-6 p-2 uppercase transition-opacity hover:opacity-60"
          style={{ color: textColor, fontFamily: "'Jost',sans-serif", fontWeight: 300 }}
        >
          About us
        </button>

        <a
          href="/"
          className="cormorant text-4xl tracking-[.3em] uppercase transition-opacity hover:opacity-70"
          style={{ color: textColor, letterSpacing: ".3em" }}
        >
          Passalacqua
        </a>

        <button
          onClick={onBook}
          className="text-xs tracking-[.2em] uppercase transition-opacity hover:opacity-60"
          style={{ color: textColor, fontFamily: "'Jost',sans-serif", fontWeight: 300 }}
        >
          Book now
        </button>
      </div>
    </header>
  );
}

// ─── Nav Overlay ─────────────────────────────────────────────────────────────
const NAV_MOODS: string[] = ["Yesterday", "Villeggiatura", "Interiors", "Gardens", "Taste", "Pool", "Lake"];
const NAV_INSIDE: string[] = ["Today", "Rooms", "Dining", "Spa", "Experiences", "Contacts", "Voices"];

function NavOverlay({ open, onClose }: OverlayProps): JSX.Element {
  return (
    <div className={`nav-overlay ${open ? "open" : ""} flex flex-col`}>
      <div className="max-w-screen-xl mx-auto w-full px-8 py-5 flex items-center justify-between">
        <button
          onClick={onClose}
          className="text-xs tracking-[.2em] uppercase text-white/60 hover:text-white transition-colors"
        >
          Close
        </button>
        <span className="cormorant text-2xl tracking-[.3em] text-white uppercase">Passalacqua</span>
        <div className="w-16" />
      </div>

      <div className="flex-1 flex items-center justify-center px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-2xl w-full">
          <div>
            <p className="text-white/40 text-xs tracking-[.25em] uppercase mb-6 cormorant">
              <span className="text-white/80">Passalacqua</span> Moods
            </p>
            <ul className="space-y-3">
              {NAV_MOODS.map((item) => (
                <li key={item}>
                  <a href="#" className="cormorant text-3xl text-white/70 hover:text-white transition-colors italic">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white/40 text-xs tracking-[.25em] uppercase mb-6 cormorant">
              Inside <span className="text-white/80">Passalacqua</span>
            </p>
            <ul className="space-y-3">
              {NAV_INSIDE.map((item) => (
                <li key={item}>
                  <a href="#" className="cormorant text-3xl text-white/70 hover:text-white transition-colors italic">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 text-center">
        <p className="text-white/30 text-xs tracking-[.15em]">
          <a href="#" className="hover:text-white/60 transition-colors">Sense of Lake</a>
          {" · "}
          <a href="#" className="hover:text-white/60 transition-colors">Buy our book</a>
        </p>
      </div>
    </div>
  );
}

// ─── Booking Overlay ──────────────────────────────────────────────────────────
const BOOKING_FIELDS: SelectField[] = [
  { label: "Rooms",    options: ["1 Room", "2 Rooms", "3 Rooms", "4 Rooms"] },
  { label: "Adults",   options: ["1 Adult", "2 Adults", "3 Adults", "4 Adults"] },
  { label: "Children", options: ["0 Children", "1 Child", "2 Children"] },
];

function BookingOverlay({ open, onClose }: OverlayProps): JSX.Element {
  return (
    <div className={`booking-overlay ${open ? "open" : ""} flex flex-col`}>
      <div className="max-w-screen-xl mx-auto w-full px-8 py-5 flex items-center justify-between">
        <div className="w-16" />
        <span className="cormorant text-2xl tracking-[.3em] uppercase" style={{ color: "var(--ink)" }}>
          Passalacqua
        </span>
        <button
          onClick={onClose}
          className="text-xs tracking-[.2em] uppercase hover:opacity-60 transition-opacity"
          style={{ fontFamily: "'Jost',sans-serif", fontWeight: 300 }}
        >
          Close
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="max-w-xl w-full">
          <h2 className="cormorant text-4xl mb-10 text-center" style={{ fontWeight: 300 }}>
            Reserve your stay
          </h2>

          <div className="space-y-6">
            <div>
              <label className="text-xs tracking-[.2em] uppercase block mb-2" style={{ color: "var(--muted)" }}>
                Check In — Check Out
              </label>
              <div className="border-b flex gap-4 pb-2" style={{ borderColor: "rgba(26,23,20,.2)" }}>
                <input
                  type="text"
                  placeholder="Check-in"
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ fontFamily: "'Jost',sans-serif", fontWeight: 300 }}
                />
                <span style={{ color: "var(--muted)" }}>—</span>
                <input
                  type="text"
                  placeholder="Check-out"
                  className="flex-1 bg-transparent text-sm outline-none text-right"
                  style={{ fontFamily: "'Jost',sans-serif", fontWeight: 300 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {BOOKING_FIELDS.map((field) => (
                <div key={field.label} className="custom-select">
                  <label className="text-xs tracking-[.2em] uppercase block mb-2" style={{ color: "var(--muted)" }}>
                    {field.label}
                  </label>
                  <select>
                    {field.options.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="pt-4 text-center space-y-4">
              <a
                href="#"
                className="block w-full py-4 text-xs tracking-[.25em] uppercase transition-all"
                style={{ border: "1px solid var(--ink)", fontFamily: "'Jost',sans-serif", fontWeight: 300 }}
                onMouseEnter={handleHoverIn}
                onMouseLeave={handleHoverOut}
              >
                Check availability
              </a>
              <a href="#" className="text-xs tracking-[.15em] uppercase" style={{ color: "var(--muted)" }}>
                Modify reservation
              </a>
            </div>
          </div>

          <p className="mt-8 text-xs text-center leading-relaxed" style={{ color: "var(--muted)" }}>
            For multiple rooms or special requests, please contact us directly.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero(): JSX.Element {
  return (
    <section className="relative h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://www.passalacqua.it/media/jf0e3rhx/01-passalacqua-lake-como_bo4a4971-edit.jpg?width=1920&height=1080&format=webp')`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,.25) 0%, rgba(0,0,0,.1) 50%, rgba(0,0,0,.4) 100%)" }}
      />
      <div className="absolute bottom-16 left-0 right-0 text-center px-8">
        <h1
          className="cormorant-italic text-white leading-tight fade-up"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontStyle: "italic" }}
        >
          Oh beloved places,<br />I have found you.
        </h1>
        <p
          className="fade-up delay-300 mt-4 text-white/70 text-sm tracking-[.15em]"
          style={{ fontFamily: "'Jost',sans-serif", fontWeight: 300 }}
        >
          Vincenzo Bellini, <em>La Sonnambula</em>
        </p>
      </div>
    </section>
  );
}

// ─── Section: Intro text ──────────────────────────────────────────────────────
function SectionIntro(): JSX.Element {
  return (
    <section className="py-24 px-8">
      <div className="max-w-3xl mx-auto text-center">
        <RevealDiv>
          <p className="cormorant leading-relaxed" style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 300 }}>
            Passalacqua is unique. Back in the 18<sup>th</sup> century, it was created as a place of the heart on
            Lake Como for friends, for love and leisure, for the pleasures of the table and the Italian art of{" "}
            <em>dolce far niente</em>. It is that same place of the heart today.{" "}
            <span style={{ color: "var(--gold)" }}>Welcome to Passalacqua.</span>
          </p>
        </RevealDiv>
      </div>
    </section>
  );
}

// ─── Section: Image + Text ────────────────────────────────────────────────────
function SectionImageText({
  image, alt, title, text, link, linkLabel, reverse = false,
}: SectionImageTextProps): JSX.Element {
  const dirClass = reverse ? "md:[direction:rtl]" : "";
  const innerClass = reverse ? "[direction:ltr]" : "";

  return (
    <section className="py-16 px-8 md:px-16">
      <div className={`max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${dirClass}`}>
        <RevealDiv className={innerClass}>
          <div className="overflow-hidden">
            <img
              src={image}
              alt={alt}
              className="w-full object-cover transition-transform duration-700 hover:scale-105"
              style={{ aspectRatio: "3/2" }}
            />
          </div>
        </RevealDiv>
        <RevealDiv delay={200} className={innerClass}>
          <div className="space-y-5">
            <h2 className="cormorant leading-snug" style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)", fontWeight: 300 }}>
              {title}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)", lineHeight: "1.9" }}>
              {text}
            </p>
            {link && linkLabel && (
              <a
                href={link}
                className="inline-block text-xs tracking-[.2em] uppercase border-b pb-0.5 transition-colors hover:opacity-60"
                style={{ borderColor: "var(--ink)", fontFamily: "'Jost',sans-serif", fontWeight: 300 }}
              >
                {linkLabel}
              </a>
            )}
          </div>
        </RevealDiv>
      </div>
    </section>
  );
}

// ─── Section: Three Cards ─────────────────────────────────────────────────────
const SUITE_CARDS: SuiteCard[] = [
  {
    img: "https://www.passalacqua.it/media/cszn5hfd/passalacqua-luxury-hotel-lake-como_19.jpg?width=510&height=684&format=webp",
    label: "Palazz",
    href: "#",
  },
  {
    img: "https://www.passalacqua.it/media/4q2no1df/passalacqua-luxury-hotel-lake-como_44.jpg?width=510&height=684&format=webp",
    label: "Villa",
    href: "#",
  },
  {
    img: "https://www.passalacqua.it/media/sund4qmi/passalacqua-luxury-hotel-lake-como_62.jpg?width=510&height=684&format=webp",
    label: "Casa al Lago",
    href: "#",
  },
];

function SectionThreeCards(): JSX.Element {
  return (
    <section className="py-16 px-8 md:px-16">
      <div className="max-w-screen-lg mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUITE_CARDS.map((card, i) => (
            <RevealDiv key={card.label} delay={i * 150}>
              <a href={card.href} className="block group">
                <div className="overflow-hidden">
                  <img
                    src={card.img}
                    alt={card.label}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ aspectRatio: "3/4" }}
                  />
                </div>
                <p className="cormorant-italic mt-4 text-xl text-center group-hover:opacity-60 transition-opacity">
                  {card.label}
                </p>
              </a>
            </RevealDiv>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Voices ─────────────────────────────────────────────────────────
function SectionVoices(): JSX.Element {
  return (
    <section className="py-24 px-8 md:px-16">
      <div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <RevealDiv>
          <div className="space-y-6">
            <p
              className="text-xs tracking-[.25em] uppercase"
              style={{ color: "var(--gold)", fontFamily: "'Jost',sans-serif", fontWeight: 300 }}
            >
              Voices
            </p>
            <h2 className="cormorant" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 300 }}>
              The light changes every minute, every second
            </h2>
            <blockquote className="cormorant-italic text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
              "I've lived here my whole life and I'm out on the water pretty much every day. But I never get tired of looking at the lake."
              <br />
              <cite className="not-italic text-sm tracking-[.1em]">— Beppe the Boatman</cite>
            </blockquote>
            <div className="flex gap-6 items-center">
              <a
                href="#"
                className="text-xs tracking-[.2em] uppercase border-b pb-0.5"
                style={{ borderColor: "var(--ink)", fontFamily: "'Jost',sans-serif", fontWeight: 300 }}
              >
                Read the Story
              </a>
              <a
                href="#"
                className="text-xs tracking-[.2em] uppercase px-6 py-3 border transition-all"
                style={{ border: "1px solid var(--ink)", fontFamily: "'Jost',sans-serif", fontWeight: 300 }}
                onMouseEnter={handleHoverIn}
                onMouseLeave={handleHoverOut}
              >
                Discover all voices
              </a>
            </div>
          </div>
        </RevealDiv>
        <RevealDiv delay={200}>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://www.passalacqua.it/media/5cspq5o4/lake-como-luxury-hotel_passalacqua_77-02.jpg?width=500&height=500&format=webp"
              alt="Lake Como view"
              className="w-full object-cover"
              style={{ aspectRatio: "1/1" }}
            />
            <img
              src="https://www.passalacqua.it/media/tdibarox/stephan-valentin-w5r_meeiudw-unsplash.jpg?width=500&height=500&format=webp"
              alt="Lake Como nature"
              className="w-full object-cover mt-8"
              style={{ aspectRatio: "1/1" }}
            />
          </div>
        </RevealDiv>
      </div>
    </section>
  );
}

// ─── Section: Promo ───────────────────────────────────────────────────────────
function SectionPromo({ img, label, title, text, btnLabel, btnHref, reverse = false }: SectionPromoProps): JSX.Element {
  const dirClass = reverse ? "md:[direction:rtl]" : "";
  const innerClass = reverse ? "[direction:ltr]" : "";

  return (
    <section className="py-16 px-8 md:px-16">
      <div className={`max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${dirClass}`}>
        <RevealDiv className={innerClass}>
          <img src={img} alt={title} className="w-full object-cover" style={{ aspectRatio: "1/1", maxWidth: 380 }} />
        </RevealDiv>
        <RevealDiv delay={200} className={innerClass}>
          <div className="space-y-5">
            <p
              className="text-xs tracking-[.25em] uppercase"
              style={{ color: "var(--gold)", fontFamily: "'Jost',sans-serif", fontWeight: 300 }}
            >
              {label}
            </p>
            <h2 className="cormorant" style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)", fontWeight: 300 }}>
              {title}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)", lineHeight: "1.9" }}>
              {text}
            </p>
            <a
              href={btnHref}
              className="inline-block text-xs tracking-[.25em] uppercase px-6 py-3 border transition-all"
              style={{ border: "1px solid var(--ink)", fontFamily: "'Jost',sans-serif", fontWeight: 300 }}
              onMouseEnter={handleHoverIn}
              onMouseLeave={handleHoverOut}
            >
              {btnLabel}
            </a>
          </div>
        </RevealDiv>
      </div>
    </section>
  );
}

// ─── Feature Cards (Pool & Villeggiatura) ────────────────────────────────────
const FEATURE_CARDS: CardItem[] = [
  {
    img: "https://www.passalacqua.it/media/hzqaqdlg/passalacqua-swimming-pool-lake-como_75.jpg?width=510&height=684&format=webp",
    title: "A dash of La dolce Vita",
    text: "Set on a garden terrace just below the main villa, edged by ancient climbing roses and a magnificent bay tree, la piscina lends itself equally to sporty laps and leisurely dips.",
    link: "#",
    linkLabel: "Take me there",
    tall: true,
  },
  {
    img: "https://www.passalacqua.it/media/boddhokh/passalacqua-luxury-hotel-lake-como_23.jpg?width=1050&height=684&format=webp",
    title: "La villeggiatura is a great Italian tradition…",
    text: "An annual reset, a much-awaited season of joyful encounters, divertissements and opportunities for personal enrichment. At Passalacqua, la villeggiatura lives on.",
    link: "#",
    linkLabel: "Villeggiatura at Passalacqua",
    tall: false,
  },
];

function SectionFeatureCards(): JSX.Element {
  return (
    <section className="py-12 px-8 md:px-16">
      <div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {FEATURE_CARDS.map((card, i) => (
          <RevealDiv key={card.title} delay={i * 200}>
            <a href={card.link} className="block group overflow-hidden">
              <img
                src={card.img}
                alt={card.title}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ aspectRatio: card.tall ? "3/4" : "3/2" }}
              />
            </a>
            <div className="pt-6 space-y-3">
              <h3 className="cormorant" style={{ fontSize: "clamp(1.3rem, 2vw, 1.7rem)", fontWeight: 300 }}>
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)", lineHeight: "1.9" }}>
                {card.text}
              </p>
              <a
                href={card.link}
                className="text-xs tracking-[.2em] uppercase border-b pb-0.5"
                style={{ borderColor: "var(--ink)", fontFamily: "'Jost',sans-serif", fontWeight: 300 }}
              >
                {card.linkLabel}
              </a>
            </div>
          </RevealDiv>
        ))}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
const FOOTER_LINKS: string[] = [
  "Newsletter", "TimeFrames", "Privacy", "Careers",
  "Company Info & Accessibility", "GDS Codes",
];

function Footer(): JSX.Element {
  return (
    <footer className="py-16 px-8 md:px-16 mt-8" style={{ borderTop: "1px solid rgba(26,23,20,.1)" }}>
      <div className="max-w-screen-lg mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <p className="cormorant text-2xl tracking-[.3em] mb-6">Passalacqua</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="text-xs tracking-[.1em] hover:opacity-60 transition-opacity"
                  style={{ color: "var(--muted)", fontFamily: "'Jost',sans-serif", fontWeight: 300 }}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs" style={{ color: "var(--muted)", fontFamily: "'Jost',sans-serif", fontWeight: 300 }}>
            P. IVA IT 00348270133
          </p>
        </div>
        <div className="flex gap-6 items-center opacity-60">
          <span
            className="text-xs tracking-[.1em] uppercase"
            style={{ fontFamily: "'Jost',sans-serif", fontWeight: 300, color: "var(--muted)" }}
          >
            World's 50 Best Hotels
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PassalacquaPage(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [bookOpen, setBookOpen] = useState<boolean>(false);

  return (
    <>
      <FontLoader />
      <NavOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      <BookingOverlay open={bookOpen} onClose={() => setBookOpen(false)} />

      <Header onMenu={() => setMenuOpen(true)} onBook={() => setBookOpen(true)} />

      <Hero />
      <SectionIntro />

      <SectionImageText
        image="https://www.passalacqua.it/media/kydftbun/moltrasio-and-passalacqua-by-night.jpg?width=1050&height=700&format=webp"
        alt="Passalacqua by night"
        title="The best season to visit Lake Como? Every season."
        text="Spring, when blossom scents the air and daubs white brushstrokes on green hillsides above cobalt blue water. Summer, when long lazy days merge into magical nights alive with promise. Fall, when the woods are tinged with russet and copper."
        link="#"
        linkLabel="Discover more"
      />

      <Ornament />
      <SectionFeatureCards />
      <Ornament />

      <SectionImageText
        image="https://www.passalacqua.it/media/w2wbtljs/bed-enrico-costantini.jpg?width=1050&height=700&format=webp"
        alt="Our Suites"
        title="Our Suites"
        text="Passalacqua's three moods: Villa, Palazz, Casa al Lago. A stylish room of your own, its every detail curated, your every need embraced."
        link="#"
        linkLabel="Discover our Suites"
        reverse
      />

      <Ornament />
      <SectionThreeCards />
      <Ornament />

      <SectionVoices />

      <Ornament />

      <SectionPromo
        img="https://www.passalacqua.it/media/nseewfha/pas_assouline_web.jpg?width=509&height=509&format=webp"
        label="Our book"
        title="A Love Letter to Lake Como"
        text='"Dear Passalacqua, We first met you on a September day some years back. It still feels like yesterday." A love letter in book form, published with Assouline.'
        btnLabel="Buy our book"
        btnHref="#"
      />

      <SectionPromo
        img="https://www.passalacqua.it/media/mfnbgw12/0g5a0626.jpg?width=509&height=509&format=webp"
        label="Our Sister Property"
        title="Grand Hotel Tremezzo"
        text="An iconic art nouveau villa on the western shores of Lake Como, with views across the crystalline waters towards Bellagio and the sunset-lit Grigne mountain range."
        btnLabel="Visit the site"
        btnHref="#"
        reverse
      />

      <Footer />
    </>
  );
}