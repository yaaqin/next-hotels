"use client";

import { useEffect, useRef, useState } from "react";

interface Project {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

const projects: Project[] = [
  {
    id: "Gym",
    title: "Fitness Sanctuary",
    subtitle: "Wellness & Recreation",
    imageUrl: "https://i.pinimg.com/1200x/2a/2d/8a/2a2d8abaaeb7d6ac4b76a77843e07a25.jpg",
  },
  {
    id: "restaurant",
    title: "The Grand Dining",
    subtitle: "Culinary Excellence",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
  },
  {
    id: "hotel",
    title: "Signature Suites",
    subtitle: "Curated Hospitality",
    imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
  },
  {
    id: "house",
    title: "Private Retreats",
    subtitle: "Exclusive Residences",
    imageUrl: "https://cdn.yaaqin.xyz/hotel/1771903990760-balkon2.jpg",
  },
];

function ProjectCard({
  project,
  delay,
  visible,
  className = "",
  style = {},
}: {
  project: Project;
  delay: number;
  visible: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`
        relative rounded-[20px] overflow-hidden cursor-pointer group
        transition-all duration-700
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        ${className}
      `}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={project.imageUrl}
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-700"
        style={{ transform: hovered ? "scale(1.07)" : "scale(1)" }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030D1A]/80 via-[#030D1A]/10 to-transparent transition-opacity duration-500" />
      {/* Hover tint */}
      <div
        className="absolute inset-0 bg-[#1A56A0]/10 transition-opacity duration-500"
        style={{ opacity: hovered ? 1 : 0 }}
      />

      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {/* Subtitle badge */}
        <p
          className="text-[0.52rem] tracking-[0.18em] uppercase text-[#5B90C9] mb-1 transition-all duration-500"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            opacity: hovered ? 1 : 0.75,
            transform: hovered ? "translateY(0)" : "translateY(4px)",
          }}
        >
          {project.subtitle}
        </p>
        <div className="w-5 h-px bg-[#1A56A0] opacity-60 mb-2" />
        <span
          className="text-[#C8DCEF] text-sm font-medium tracking-wide"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }}
        >
          {project.title}
        </span>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const headingAnim = `transition-all duration-700 ${
    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
  }`;

  return (
    <section
      ref={ref}
      className="bg-[#EEF3FA] px-5 py-12 md:px-14 lg:px-24"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="w-full mx-auto">

        {/* ══════════════════════════════════════════
            MOBILE LAYOUT  (< md)
        ══════════════════════════════════════════ */}
        <div className="md:hidden flex flex-col gap-4">

          {/* Heading */}
          <div className={headingAnim}>
            <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[#1A56A0] mb-2">
              Marina by Sand — Our Works
            </p>
            <h2
              className="text-[2rem] font-light text-[#0A1828] leading-tight mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Spaces Crafted for<br />
              <em className="text-[#1A56A0]">Extraordinary Living</em>
            </h2>
            <p className="text-[0.72rem] text-[#2C4E72] leading-relaxed font-light">
              A curated selection of our most distinguished interiors — each one a testament to refined craftsmanship, purposeful design, and the enduring art of hospitality.
            </p>
          </div>

          {/* 2-col row */}
          <div className="grid grid-cols-2 gap-3">
            <ProjectCard project={projects[0]} delay={100} visible={visible} style={{ height: 180 }} />
            <ProjectCard project={projects[1]} delay={150} visible={visible} style={{ height: 180 }} />
          </div>

          {/* Full-width cards */}
          <ProjectCard project={projects[2]} delay={200} visible={visible} style={{ height: 210 }} />
          <ProjectCard project={projects[3]} delay={250} visible={visible} style={{ height: 220 }} />

          {/* CTA Button */}
          <div
            className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: "300ms" }}
          >
            <button
              className="w-full py-4 rounded-full border border-[#0A1828] text-[#0A1828] text-[0.7rem] tracking-[0.18em] uppercase font-normal active:bg-[#0A1828] active:text-[#EEF3FA] transition-all duration-300"
            >
              Reserve Your Experience
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            DESKTOP LAYOUT  (≥ md)
        ══════════════════════════════════════════ */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-4">

          {/* Col 1: Heading + Gym */}
          <div className="flex flex-col gap-4">
            <div className={headingAnim}>
              <p className="text-[0.58rem] tracking-[0.2em] uppercase text-[#1A56A0] mb-2">
                Marina by Sand — Our Works
              </p>
              <h2
                className="text-[2.2rem] lg:text-[2.6rem] font-light text-[#0A1828] leading-tight mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Spaces Crafted for{" "}
                <em className="text-[#1A56A0]">Extraordinary Living</em>
              </h2>
              <div className="w-8 h-px bg-[#1A56A0] opacity-40 mb-3" />
              <p className="text-[0.72rem] text-[#2C4E72] leading-relaxed font-light max-w-xs">
                A curated selection of our most distinguished interiors — each one a testament to refined craftsmanship, purposeful design, and the enduring art of hospitality.
              </p>
            </div>
            <ProjectCard
              project={projects[0]}
              delay={150}
              visible={visible}
              className="flex-1"
              style={{ minHeight: 230 }}
            />
          </div>

          {/* Col 2: Restaurant + Hotel */}
          <div className="flex flex-col gap-4">
            <ProjectCard project={projects[1]} delay={250} visible={visible} className="flex-1" />
            <ProjectCard project={projects[2]} delay={350} visible={visible} className="flex-1" />
          </div>

          {/* Col 3: Private Retreat + Button */}
          <div className="flex flex-col gap-4">
            <ProjectCard project={projects[3]} delay={300} visible={visible} className="flex-1" />
            <div
              className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: "500ms" }}
            >
              <button className="w-full py-4 rounded-full border border-[#0A1828] text-[#0A1828] text-[0.68rem] tracking-[0.18em] uppercase font-normal hover:bg-[#0A1828] hover:text-[#EEF3FA] transition-all duration-300">
                Reserve Your Experience
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}