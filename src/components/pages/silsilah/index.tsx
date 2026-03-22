"use client"
import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
interface FamilyMember {
  id: string;
  name: string;
  spouse: string | null;
  children: FamilyMember[];
}

// ── Data ───────────────────────────────────────────────────────────────────
const familyData: FamilyMember = {
  id: "mastuni",
  name: "Mastuni",
  spouse: "TB Abdurrahman",
  children: [
    {
      id: "tuasiah",
      name: "Tuasiah",
      spouse: "Sadiran",
      children: [],
    },
    {
      id: "turahmah",
      name: "Turahmah",
      spouse: "Hurbi",
      children: [],
    },
    {
      id: "tb-yazid",
      name: "TB Yazid Bustomi",
      spouse: "Nurjannah",
      children: [],
    },
    {
      id: "tuhadijah",
      name: "Tuhadijah",
      spouse: "Aliyudin",
      children: [
        {
          id: "andi-suparman",
          name: "Andi Suparman",
          spouse: "Tati Aliati",
          children: [
            {
              id: "hanan",
              name: "Muhammad Hanan Taufiqurrahman",
              spouse: null,
              children: [],
            },
            {
              id: "habil",
              name: "Muhammad Habil Attamam",
              spouse: null,
              children: [],
            },
          ],
        },
        {
          id: "ainul-yakin",
          name: "Ainul Yakin",
          spouse: null,
          children: [],
        },
      ],
    },
    {
      id: "tb-nuhri",
      name: "TB Muhammad Nuhri",
      spouse: "Milatuzakiyah",
      children: [],
    },
    {
      id: "tb-jahri",
      name: "TB Muhammad Jahri",
      spouse: "Tukinah",
      children: [],
    },
    {
      id: "tb-fattah",
      name: "TB Abdul Fattah",
      spouse: "Pipit Karlina",
      children: [],
    },
  ],
};

// ── Colour palette by generation ─────────────────────────────────────────
const genStyles: Record<
  number,
  { card: string; badge: string; dot: string }
> = {
  0: {
    card: "bg-amber-50 border-amber-400 shadow-amber-200",
    badge: "bg-amber-400 text-white",
    dot: "bg-amber-400",
  },
  1: {
    card: "bg-emerald-50 border-emerald-400 shadow-emerald-100",
    badge: "bg-emerald-500 text-white",
    dot: "bg-emerald-400",
  },
  2: {
    card: "bg-sky-50 border-sky-400 shadow-sky-100",
    badge: "bg-sky-500 text-white",
    dot: "bg-sky-400",
  },
  3: {
    card: "bg-violet-50 border-violet-400 shadow-violet-100",
    badge: "bg-violet-500 text-white",
    dot: "bg-violet-400",
  },
};

const genLabel: Record<number, string> = {
  0: "Leluhur",
  1: "Generasi 1",
  2: "Generasi 2",
  3: "Generasi 3",
};

// ── Card component ─────────────────────────────────────────────────────────
function MemberCard({
  member,
  generation,
}: {
  member: FamilyMember;
  generation: number;
}) {
  const g = genStyles[generation] ?? genStyles[3];
  const label = genLabel[generation] ?? `Gen ${generation}`;

  return (
    <div
      className={`relative border-2 rounded-2xl px-4 py-3 shadow-md w-56 flex-shrink-0 ${g.card}`}
    >
      {/* generation badge */}
      <span
        className={`absolute -top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${g.badge}`}
      >
        {label}
      </span>

      {/* name */}
      <p className="font-bold text-gray-800 text-sm leading-snug mt-1">
        {member.name}
      </p>

      {/* spouse */}
      {member.spouse && (
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-pink-400 text-xs">♥</span>
          <p className="text-xs text-emerald-700 font-semibold">
            {member.spouse}
          </p>
        </div>
      )}

      {/* children count pill */}
      {member.children.length > 0 && (
        <div className="mt-2 flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${g.dot}`} />
          <span className="text-[10px] text-gray-500">
            {member.children.length} anak
          </span>
        </div>
      )}
    </div>
  );
}

// ── Recursive tree node ────────────────────────────────────────────────────
function TreeNode({
  member,
  generation,
}: {
  member: FamilyMember;
  generation: number;
}) {
  const [open, setOpen] = useState(true);
  const hasChildren = member.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Card + toggle */}
      <div className="relative">
        <MemberCard member={member} generation={generation} />
        {hasChildren && (
          <button
            onClick={() => setOpen((o) => !o)}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-gray-500 hover:border-amber-400 hover:text-amber-500 transition-colors text-xs z-10 shadow"
          >
            {open ? "−" : "+"}
          </button>
        )}
      </div>

      {/* Connector + children */}
      {hasChildren && open && (
        <div className="flex flex-col items-center">
          {/* vertical line down from card */}
          <div className="w-px h-8 bg-gray-300 mt-3" />

          {/* horizontal bar */}
          <div className="flex items-start gap-6">
            {member.children.map((child, idx) => (
              <div key={child.id} className="flex flex-col items-center">
                {/* vertical line up to bar */}
                <div className="w-px h-5 bg-gray-300" />
                <TreeNode member={child} generation={generation + 1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Legend ─────────────────────────────────────────────────────────────────
function Legend() {
  return (
    <div className="flex flex-wrap gap-3 justify-center mt-6">
      {Object.entries(genStyles).map(([gen, s]) => (
        <div key={gen} className="flex items-center gap-1.5">
          <div className={`w-3 h-3 rounded-full ${s.dot}`} />
          <span className="text-xs text-gray-500">{genLabel[Number(gen)]}</span>
        </div>
      ))}
      <div className="flex items-center gap-1.5">
        <span className="text-pink-400 text-xs">♥</span>
        <span className="text-xs text-gray-500">Pasangan</span>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function FamilyTree() {
  return (
    <div className="min-h-screen bg-stone-50 font-serif">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 py-6 px-4 text-center shadow-sm">
        <p className="text-xs uppercase tracking-widest text-amber-500 font-sans font-semibold mb-1">
          Silsilah Keluarga
        </p>
        <h1 className="text-3xl font-bold text-gray-800">
          Keluarga Besar Mastuni
        </h1>
        <p className="text-sm text-gray-400 mt-1 font-sans">
          & TB Abdurrahman
        </p>
      </header>

      {/* Hint */}
      <p className="text-center text-xs text-gray-400 mt-4 font-sans">
        Klik <strong>−/+</strong> pada kartu untuk buka/tutup cabang
      </p>

      {/* Tree canvas */}
      <div className="overflow-auto px-8 py-10">
        <div className="inline-flex justify-center min-w-full pb-10">
          <TreeNode member={familyData} generation={0} />
        </div>
      </div>

      {/* Legend */}
      <Legend />

      <footer className="text-center text-[10px] text-gray-300 py-6 font-sans">
        Data dummy — contoh silsilah keluarga
      </footer>
    </div>
  );
}