// ─── Types ────────────────────────────────────────────────────────────────────
//
// Panduan pengguna (/user-guide). Isi mengikuti flow & aturan yang berlaku di BE —
// kalau aturan berubah (batas bayar, masa berlaku credit, syarat check-in, dll),
// update teksnya di semua file bahasa (idn, eng, jpn, chn).

export type GuideBlock =
    // Langkah bernomor
    | { type: "steps"; title?: string; items: string[] }
    // Poin tanpa urutan
    | { type: "list"; title?: string; items: string[] }
    | { type: "note" | "tip" | "warning"; text: string };

export interface GuideTopic {
    id: string;
    title: string;
    summary: string;
    blocks: GuideBlock[];
    // Tombol menuju halaman terkait
    cta?: { label: string; href: string };
}

export interface GuideCategory {
    id: string;
    title: string;
    topics: GuideTopic[];
}
