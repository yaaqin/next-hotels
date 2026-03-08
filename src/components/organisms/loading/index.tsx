export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="relative" style={{ width: 200, height: 60 }}>
        {/* Circles */}
        <div className="circle" />
        <div className="circle" />
        <div className="circle" />
        {/* Shadows */}
        <div className="shadow-dot" />
        <div className="shadow-dot" />
        <div className="shadow-dot" />
      </div>

      <style>{`
        .circle {
          width: 20px;
          height: 20px;
          position: absolute;
          border-radius: 50%;
          background-color: #000;
          left: 15%;
          transform-origin: 50%;
          animation: circle7124 .5s alternate infinite ease;
        }
        .circle:nth-child(2) { left: 45%; animation-delay: .2s; }
        .circle:nth-child(3) { left: auto; right: 15%; animation-delay: .3s; }

        @keyframes circle7124 {
          0%   { top: 60px; height: 5px; border-radius: 50px 50px 25px 25px; transform: scaleX(1.7); }
          40%  { height: 20px; border-radius: 50%; transform: scaleX(1); }
          100% { top: 0%; }
        }

        .shadow-dot {
          width: 20px;
          height: 4px;
          border-radius: 50%;
          background-color: rgba(0,0,0,0.2);
          position: absolute;
          top: 62px;
          transform-origin: 50%;
          z-index: -1;
          left: 15%;
          filter: blur(1px);
          animation: shadow046 .5s alternate infinite ease;
        }
        .shadow-dot:nth-child(4) { left: 45%; animation-delay: .2s; }
        .shadow-dot:nth-child(5) { left: auto; right: 15%; animation-delay: .3s; }

        @keyframes shadow046 {
          0%   { transform: scaleX(1.5); }
          40%  { transform: scaleX(1); opacity: .7; }
          100% { transform: scaleX(.2); opacity: .4; }
        }
      `}</style>
    </div>
  )
}