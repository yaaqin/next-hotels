export function SkeletonDetailBooking() {
  return (
    <div className="min-h-screen" style={{ background: "#EEF3FA" }}>

      {/* ══ DESKTOP (≥ md) ══ */}
      <div className="hidden md:flex h-screen">

        {/* Left — hero shimmer */}
        <div className="w-1/2 h-screen relative overflow-hidden" style={{ background: "#DDE8F5" }}>
          <div className="absolute inset-0 skeleton-shimmer" />
          {/* Back button placeholder */}
          <div className="absolute top-6 left-6 w-9 h-9 rounded-full skeleton-shimmer" />
          {/* Hero text overlay placeholder */}
          <div className="absolute bottom-0 left-0 right-0 p-8 space-y-3">
            <div className="h-2 w-16 rounded-full skeleton-shimmer" />
            <div className="w-6 h-px skeleton-shimmer" />
            <div className="h-7 w-40 rounded-xl skeleton-shimmer" />
            <div className="space-y-1.5">
              <div className="h-2.5 w-3/4 rounded-full skeleton-shimmer" />
              <div className="h-2.5 w-1/2 rounded-full skeleton-shimmer" />
            </div>
          </div>
        </div>

        {/* Right — content shimmer */}
        <div className="w-1/2 h-screen overflow-hidden px-8 pt-8 space-y-6" style={{ background: "#EEF3FA" }}>
          {/* Date bar */}
          <div className="h-14 w-full rounded-2xl skeleton-shimmer" />

          {/* Divider */}
          <div className="h-px w-full" style={{ background: "#B5CDE8", opacity: 0.5 }} />

          {/* Availability header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-2 w-24 rounded-full skeleton-shimmer" />
              <div className="h-3 w-32 rounded-full skeleton-shimmer" />
            </div>
            <div className="h-7 w-24 rounded-full skeleton-shimmer" />
          </div>

          {/* Room grid */}
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl skeleton-shimmer" />
            ))}
          </div>
        </div>
      </div>

      {/* ══ MOBILE (< md) ══ */}
      <div className="md:hidden">

        {/* Hero image */}
        <div
          className="relative w-full skeleton-shimmer"
          style={{ height: "65vw", minHeight: 240, maxHeight: 360 }}
        >
          {/* Back button placeholder */}
          <div className="absolute top-4 left-4 w-9 h-9 rounded-full skeleton-shimmer" style={{ background: "#C8D9EE" }} />
          {/* Title overlay placeholder */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 space-y-2">
            <div className="h-2 w-16 rounded-full skeleton-shimmer" style={{ background: "#C8D9EE" }} />
            <div className="h-6 w-36 rounded-xl skeleton-shimmer" style={{ background: "#C8D9EE" }} />
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pt-5 pb-10 space-y-5">

          {/* Description lines */}
          <div className="space-y-2">
            <div className="h-2.5 w-full rounded-full skeleton-shimmer" />
            <div className="h-2.5 w-4/5 rounded-full skeleton-shimmer" />
          </div>

          {/* Date bar */}
          <div className="h-14 w-full rounded-2xl skeleton-shimmer" />

          {/* Divider */}
          <div className="h-px w-full" style={{ background: "#B5CDE8", opacity: 0.5 }} />

          {/* Availability header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-2 w-20 rounded-full skeleton-shimmer" />
              <div className="h-3 w-28 rounded-full skeleton-shimmer" />
            </div>
            <div className="h-7 w-20 rounded-full skeleton-shimmer" />
          </div>

          {/* Room grid */}
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl skeleton-shimmer" />
            ))}
          </div>
        </div>
      </div>

      {/* Shimmer keyframe via style tag */}
      <style>{`
        @keyframes skeleton-shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            #DDE8F5 25%,
            #C8D9EE 50%,
            #DDE8F5 75%
          );
          background-size: 600px 100%;
          animation: skeleton-shimmer 1.6s infinite linear;
        }
      `}</style>
    </div>
  );
}