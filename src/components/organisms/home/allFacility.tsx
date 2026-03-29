import { useEffect, useRef, useState } from "react";

interface Project {
  id: string;
  title: string;
  imageUrl: string;
}

const projects: Project[] = [
  {
    id: "Gym",
    title: "Gym Area",
    imageUrl: "https://i.pinimg.com/1200x/2a/2d/8a/2a2d8abaaeb7d6ac4b76a77843e07a25.jpg",
  },
  {
    id: "restaurant",
    title: "Commercial Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
  },
  {
    id: "hotel",
    title: "Hotel Rooms",
    imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
  },
  {
    id: "house",
    title: "Private Room",
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
        relative rounded-2xl overflow-hidden cursor-pointer
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
        className="w-full h-full object-cover transition-transform duration-500"
        style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className="inline-block bg-black/40 backdrop-blur-sm text-white text-xs font-sans px-3 py-1.5 rounded-full border border-white/10 tracking-wide">
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
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="bg-[#F5F0E8] px-4 py-12 md:px-12 lg:px-20 font-serif"
    >
      <div className="w-full mx-auto">

        {/* ── MOBILE LAYOUT (< md) ── */}
        <div className="md:hidden flex flex-col gap-4">

          {/* Heading */}
          <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <h2 className="text-3xl font-semibold text-[#1A1410] leading-tight mb-2">
              Our Portfolio of<br />Pioneering Design
            </h2>
            <p className="text-sm text-[#6B5B45] font-sans leading-relaxed">
              Explore our selected works that demonstrate our commitment to design excellence, innovation, and client satisfaction
            </p>
          </div>

          {/* 2-col row: Office + Restaurant */}
          <div className="grid grid-cols-2 gap-3">
            <ProjectCard
              project={projects[0]}
              delay={100}
              visible={visible}
              style={{ height: 180 }}
            />
            <ProjectCard
              project={projects[1]}
              delay={150}
              visible={visible}
              style={{ height: 180 }}
            />
          </div>

          {/* Full-width: Hotel */}
          <ProjectCard
            project={projects[2]}
            delay={200}
            visible={visible}
            style={{ height: 200 }}
          />

          {/* Full-width: Private House */}
          <ProjectCard
            project={projects[3]}
            delay={250}
            visible={visible}
            style={{ height: 220 }}
          />

          {/* Button */}
          <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: "300ms" }}
          >
            <button className="w-full py-4 rounded-full border border-[#2C2416] text-[#2C2416] text-sm font-sans tracking-wide active:bg-[#2C2416] active:text-[#F5F0E8] transition-all duration-300">
              See More Projects
            </button>
          </div>
        </div>

        {/* ── DESKTOP LAYOUT (≥ md) ── */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-4">

          {/* Col 1: Heading + Office */}
          <div className="flex flex-col gap-4">
            <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              <h2 className="text-3xl lg:text-4xl font-semibold text-[#1A1410] leading-tight mb-3">
                Our Portfolio of<br />Pioneering Design
              </h2>
              <p className="text-sm text-[#6B5B45] font-sans leading-relaxed max-w-xs">
                Explore our selected works that demonstrate our commitment to design excellence, innovation, and client satisfaction
              </p>
            </div>
            <ProjectCard
              project={projects[0]}
              delay={150}
              visible={visible}
              className="flex-1"
              style={{ minHeight: 220 }}
            />
          </div>

          {/* Col 2: Restaurant + Hotel */}
          <div className="flex flex-col gap-4">
            <ProjectCard project={projects[1]} delay={250} visible={visible} className="flex-1" />
            <ProjectCard project={projects[2]} delay={350} visible={visible} className="flex-1" />
          </div>

          {/* Col 3: Private House + Button */}
          <div className="flex flex-col gap-4">
            <ProjectCard project={projects[3]} delay={300} visible={visible} className="flex-1" />
            <div
              className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: "500ms" }}
            >
              <button className="w-full py-4 rounded-full border border-[#2C2416] text-[#2C2416] text-sm font-sans tracking-wide hover:bg-[#2C2416] hover:text-[#F5F0E8] transition-all duration-300">
                Booking
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}