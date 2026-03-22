"use client";
import { useState } from "react";

export interface FamilyMember {
  id: string;
  name: string;
  spouse: string | null;
  children: FamilyMember[];
}

export const familyData: FamilyMember = {
  id: "mastuni", name: "Mastuni", spouse: "TB Abdurrahman",
  children: [
    { id: "tuasiah", name: "Tuasiah", spouse: "Sadiran", children: [
      { id: "suarsih", name: "Suarsih", spouse: "Bekti", children: [
        { id: "anita", name: "Anita Maharani", spouse: null, children: [] },
        { id: "pradiptia", name: "Pradiptia Ningrum Pramesti", spouse: null, children: [] },
      ]},
      { id: "masturinah", name: "Masturinah", spouse: "Junaedi", children: [
        { id: "asfa", name: "Asfa Andarina Pramudita", spouse: null, children: [] },
        { id: "qizza", name: "Qizza Amara Azzilah", spouse: null, children: [] },
        { id: "muizz", name: "Al Mu'izz Rafassya", spouse: null, children: [] },
      ]},
      { id: "rusmiyati", name: "Rusmiyati", spouse: "Ardi Firmansyah", children: [
        { id: "nizam", name: "Muhammad Nizam Fairuz", spouse: null, children: [] },
        { id: "ashilatun", name: "Ashilatun Nadhifah", spouse: null, children: [] },
        { id: "nabhan", name: "Muhammad Nabhan", spouse: null, children: [] },
      ]},
      { id: "sirojudin", name: "Muhammad Sirojudin", spouse: "Yurnita", children: [
        { id: "fayha", name: "Fayha Raffi Faturifda", spouse: null, children: [] },
        { id: "zelin", name: "Zelin Sashi Kirana", spouse: null, children: [] },
        { id: "zea", name: "Zea", spouse: null, children: [] },
      ]},
      { id: "aprilia", name: "Aprilia", spouse: "Muhammad Rosadi Chaeri", children: [
        { id: "ziyad", name: "Muhammad Khoiru Ziyad", spouse: null, children: [] },
        { id: "zelia", name: "Zelia Nayla", spouse: null, children: [] },
      ]},
    ]},
    { id: "turahmah", name: "Turahmah", spouse: "Hurbi", children: [
      { id: "rahendi", name: "Rahendi", spouse: null, children: [
        { id: "raras", name: "Raras", spouse: null, children: [] },
        { id: "arsyad", name: "Arsyad", spouse: null, children: [] },
      ]},
      { id: "jojon", name: "Jojon", spouse: "Salamah", children: [
        { id: "erfa", name: "Erfa", spouse: null, children: [] },
        { id: "aldiansyah", name: "Aldiansyah", spouse: null, children: [] },
      ]},
      { id: "rahibudin", name: "Rahi Budin", spouse: "Nuryana", children: [
        { id: "boy", name: "Boy", spouse: null, children: [] },
        { id: "raisa", name: "Raisa", spouse: null, children: [] },
      ]},
      { id: "rahman", name: "Rahman Subanda", spouse: "Suliyati", children: [
        { id: "marsya", name: "Marsya", spouse: null, children: [] },
        { id: "panji", name: "Panji", spouse: null, children: [] },
      ]},
      { id: "uwan", name: "Uwan", spouse: "Iren", children: [
        { id: "ikram", name: "Ikram", spouse: null, children: [] },
        { id: "alfi", name: "Alfi", spouse: null, children: [] },
        { id: "rapiya", name: "Rapiya Putri", spouse: null, children: [] },
      ]},
      { id: "rais", name: "Rais Jayanton", spouse: null, children: [
        { id: "jia", name: "Jia Yasmin", spouse: null, children: [] },
      ]},
      { id: "hani", name: "Hani Santika", spouse: "Helmi", children: [] },
    ]},
    { id: "tb-yazid", name: "TB Yazid Bustomi", spouse: "Nurjannah", children: [
      { id: "ernawati", name: "Ernawati", spouse: "Andry Setiawan", children: [
        { id: "ahmanda", name: "Ahmanda Novita Sari", spouse: null, children: [] },
        { id: "eza", name: "Eza Radiya Pratama", spouse: null, children: [] },
        { id: "elmira", name: "El Mira Aiza Adryani", spouse: null, children: [] },
      ]},
      { id: "sarifudin", name: "Sarifudin", spouse: "Mela Sari", children: [
        { id: "rizki", name: "Muhammad Rizki Maulana", spouse: null, children: [] },
      ]},
    ]},
    { id: "tuhadijah", name: "Tuhadijah", spouse: "Aliyudin", children: [
      { id: "andi-suparman", name: "Andi Suparman", spouse: "Tati Aliati", children: [
        { id: "hanan", name: "Muhammad Hanan Taufiqurrahman", spouse: null, children: [] },
        { id: "habil", name: "Muhammad Habil Attamam", spouse: null, children: [] },
      ]},
      { id: "ainul-yakin", name: "Ainul Yakin", spouse: null, children: [] },
    ]},
    { id: "tb-nuhri", name: "TB Muhammad Nuhri", spouse: "Milatuzakiyah", children: [
      { id: "nuriyan", name: "TB Nuriyan Ardho Sholah", spouse: null, children: [] },
      { id: "bilqis", name: "Ratu Bilqis Ramadhani", spouse: null, children: [] },
      { id: "yusuf", name: "TB M Yusuf Al Ardhabilli", spouse: null, children: [] },
    ]},
    { id: "tb-jahri", name: "TB Muhammad Jahri", spouse: "Tukinah", children: [
      { id: "misbahul", name: "TB Misbahul Anam", spouse: null, children: [] },
      { id: "khoirul", name: "TB Khoirul Abror", spouse: null, children: [] },
      { id: "hasna", name: "Ratu Hasna Azkiya", spouse: null, children: [] },
    ]},
    { id: "tb-fattah", name: "TB Abdul Fattah", spouse: "Pipit Karlina", children: [
      { id: "dayyan", name: "Muhammad Dayyan Fatah", spouse: null, children: [] },
    ]},
  ],
};

// ── Helpers ────────────────────────────────────────────────────────────────
function countDescendants(m: FamilyMember): number {
  let n = m.children.length;
  for (const c of m.children) n += countDescendants(c);
  return n;
}

function collectDescendants(m: FamilyMember, depth = 0): { member: FamilyMember; depth: number }[] {
  const result: { member: FamilyMember; depth: number }[] = [];
  for (const c of m.children) {
    result.push({ member: c, depth });
    result.push(...collectDescendants(c, depth + 1));
  }
  return result;
}

const depthLabel = ["Anak", "Cucu", "Cicit", "Canggah", "Wareng"];
const depthBadge = [
  "background:#d1fae5;color:#065f46",
  "background:#dbeafe;color:#1e3a8a",
  "background:#ede9fe;color:#4c1d95",
  "background:#fef3c7;color:#78350f",
  "background:#fce7f3;color:#831843",
];

function downloadPDF(member: FamilyMember) {
  const descendants = collectDescendants(member);
  const grouped: Record<number, FamilyMember[]> = {};
  for (const { member: m, depth } of descendants) {
    if (!grouped[depth]) grouped[depth] = [];
    grouped[depth].push(m);
  }

  const rows = Object.entries(grouped).map(([dep, members]) => {
    const d = Number(dep);
    const label = depthLabel[d] ?? `Keturunan ${d + 1}`;
    const names = members.map(m =>
      `<div style="padding:3px 0;">${m.name}${m.spouse ? ` <span style="color:#16a34a;font-size:12px;">+ ${m.spouse}</span>` : ""}</div>`
    ).join("");
    return `<tr><td style="padding:10px 14px;font-weight:600;color:#374151;vertical-align:top;white-space:nowrap;border:1px solid #e5e7eb;">${label}</td><td style="padding:10px 14px;color:#111827;border:1px solid #e5e7eb;">${names}</td></tr>`;
  }).join("");

  const total = countDescendants(member);
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Silsilah – ${member.name}</title>
<style>
  body{font-family:'Georgia',serif;padding:48px;color:#111827;max-width:640px;margin:auto;background:#fff;}
  h1{font-size:24px;margin:0 0 4px;color:#111827;}
  .spouse{color:#16a34a;}
  .sub{color:#6b7280;font-size:13px;margin:0 0 24px;}
  table{width:100%;border-collapse:collapse;margin-top:16px;}
  thead td{background:#f0fdf4;font-weight:700;color:#15803d;padding:10px 14px;border:1px solid #e5e7eb;}
  tr:nth-child(even) td{background:#f9fafb;}
  .footer{margin-top:36px;font-size:11px;color:#9ca3af;text-align:center;border-top:1px solid #f3f4f6;padding-top:12px;}
</style></head><body>
<h1>${member.name}${member.spouse ? ` <span class="spouse">+ ${member.spouse}</span>` : ""}</h1>
<p class="sub">Silsilah Keluarga Besar Mastuni · ${total} keturunan tercatat</p>
<table>
  <thead><tr><td>Tingkat</td><td>Nama</td></tr></thead>
  <tbody>${rows || '<tr><td colspan="2" style="padding:12px;color:#9ca3af;text-align:center;border:1px solid #e5e7eb;">Belum ada data keturunan</td></tr>'}</tbody>
</table>
<div class="footer">Dicetak dari Silsilah Keluarga Mastuni</div>
</body></html>`;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  }
}

// ── Popup ─────────────────────────────────────────────────────────────────
function PopupModal({ member, onClose }: { member: FamilyMember; onClose: () => void }) {
  const descendants = collectDescendants(member);
  const grouped: Record<number, FamilyMember[]> = {};
  for (const { member: m, depth } of descendants) {
    if (!grouped[depth]) grouped[depth] = [];
    grouped[depth].push(m);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm flex flex-col overflow-hidden"
        style={{ border: "1.5px solid #16a34a", maxHeight: "80vh", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* header */}
        <div className="px-5 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 16, color: "#111827", margin: 0 }}>
                {member.name}
              </h2>
              {member.spouse && (
                <p style={{ fontSize: 13, color: "#16a34a", margin: "4px 0 0" }}>♥ {member.spouse}</p>
              )}
            </div>
            <button onClick={onClose} style={{ fontSize: 22, color: "#9ca3af", background: "none", border: "none", cursor: "pointer", lineHeight: 1, marginTop: 2 }}>×</button>
          </div>
          <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 8 }}>{countDescendants(member)} keturunan tercatat</p>
        </div>

        {/* body */}
        <div className="overflow-y-auto flex-1 px-5 py-4" style={{ gap: 16, display: "flex", flexDirection: "column" }}>
          {Object.keys(grouped).length === 0 ? (
            <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", padding: "16px 0" }}>Belum ada data keturunan</p>
          ) : (
            Object.entries(grouped).map(([dep, members]) => {
              const d = Number(dep);
              const label = depthLabel[d] ?? `Keturunan ${d + 1}`;
              const badgeStyle = depthBadge[d] ?? depthBadge[4];
              return (
                <div key={dep}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 999, ...Object.fromEntries(badgeStyle.split(";").map(s => { const [k,v]=s.split(":"); return [k?.trim(), v?.trim()]; })) }}>
                    {label}
                  </span>
                  <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none" }}>
                    {members.map(m => (
                      <li key={m.id} style={{ fontSize: 13, color: "#111827", padding: "3px 0", display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {m.name}
                        {m.spouse && <span style={{ color: "#16a34a", fontSize: 11 }}>+ {m.spouse}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })
          )}
        </div>

        {/* footer */}
        <div style={{ padding: "12px 20px 20px", borderTop: "1px solid #f3f4f6" }}>
          <button
            onClick={() => downloadPDF(member)}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#16a34a", color: "#fff", fontSize: 13, fontWeight: 700, padding: "10px 0", borderRadius: 14, border: "none", cursor: "pointer" }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 1v9M5 7l3 3 3-3M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────
const depthCardStyle = [
  { border: "#fbbf24", bg: "#fffbeb" },
  { border: "#6ee7b7", bg: "#ffffff" },
  { border: "#93c5fd", bg: "#eff6ff" },
  { border: "#c4b5fd", bg: "#f5f3ff" },
  { border: "#fca5a5", bg: "#fff1f2" },
];

function MemberCard({ member, depth }: { member: FamilyMember; depth: number }) {
  const [open, setOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const hasChildren = member.children.length > 0;
  const style = depthCardStyle[Math.min(depth, depthCardStyle.length - 1)];

  return (
    <>
      {showPopup && <PopupModal member={member} onClose={() => setShowPopup(false)} />}

      <div style={{ marginLeft: depth === 0 ? 0 : 16 }}>
        {/* card */}
        <div style={{
          border: `1.5px solid ${style.border}`,
          background: style.bg,
          borderRadius: 16,
          padding: "10px 12px",
          marginBottom: 8,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "Georgia,serif", fontWeight: 700, fontSize: 14, color: "#111827", margin: 0, lineHeight: 1.3 }}>
              {member.name}
            </p>
            {member.spouse && (
              <p style={{ fontSize: 12, color: "#16a34a", margin: "3px 0 0" }}>♥ {member.spouse}</p>
            )}
            {hasChildren && (
              <p style={{ fontSize: 10, color: "#9ca3af", margin: "5px 0 0" }}>
                {member.children.length} anak · {countDescendants(member)} keturunan
              </p>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
            <button
              onClick={() => setShowPopup(true)}
              style={{ fontSize: 10, padding: "4px 8px", borderRadius: 8, border: "1px solid #16a34a", color: "#16a34a", background: "none", cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}
            >
              Ringkasan
            </button>
            {hasChildren && (
              <button
                onClick={() => setOpen(o => !o)}
                style={{ fontSize: 10, padding: "4px 8px", borderRadius: 8, border: "1px solid #d1d5db", color: "#6b7280", background: "none", cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}
              >
                {open ? "Tutup ▲" : "Anak ▼"}
              </button>
            )}
          </div>
        </div>

        {/* children */}
        {hasChildren && open && (
          <div style={{ marginLeft: 20, borderLeft: "2px dashed #e5e7eb", paddingLeft: 12, marginBottom: 4 }}>
            {member.children.map(child => (
              <MemberCard key={child.id} member={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ── App ───────────────────────────────────────────────────────────────────
export default function FamilyTree2() {
  return (
    <div style={{ minHeight: "100vh", background: "#f7f6f3", fontFamily: "Georgia,serif" }}>
      {/* header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #f3f4f6", padding: "16px", textAlign: "center", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "#f59e0b", fontFamily: "sans-serif", fontWeight: 700, margin: "0 0 2px" }}>Silsilah Keluarga</p>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>Keluarga Besar Mastuni</h1>
        <p style={{ fontSize: 12, color: "#9ca3af", fontFamily: "sans-serif", margin: "2px 0 0" }}>& TB Abdurrahman</p>
      </div>

      {/* legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", padding: "10px 16px" }}>
        {[
          { label: "Leluhur", bg: "#fef3c7", color: "#92400e" },
          { label: "Anak", bg: "#d1fae5", color: "#065f46" },
          { label: "Cucu", bg: "#dbeafe", color: "#1e3a8a" },
          { label: "Cicit", bg: "#ede9fe", color: "#4c1d95" },
        ].map(g => (
          <span key={g.label} style={{ fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 999, background: g.bg, color: g.color, fontFamily: "sans-serif" }}>{g.label}</span>
        ))}
        <span style={{ fontSize: 10, color: "#9ca3af", fontFamily: "sans-serif", alignSelf: "center" }}>· Tap Ringkasan untuk detail & PDF</span>
      </div>

      {/* tree */}
      <div style={{ padding: "8px 16px 60px", maxWidth: 480, margin: "0 auto" }}>
        <MemberCard member={familyData} depth={0} />
      </div>
    </div>
  );
}