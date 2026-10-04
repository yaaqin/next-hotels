import type { SupportedLang } from "@/src/utils/languageCookie";
import type { GuideCategory } from "./types";
import idn from "./idn";
import eng from "./eng";
import jpn from "./jpn";
import chn from "./chn";

export * from "./types";

// Satu file per bahasa dengan id kategori & topik yang sama, supaya deep link
// /user-guide?topic=... tetap jalan di semua bahasa
export const USER_GUIDE: Record<SupportedLang, GuideCategory[]> = { idn, eng, jpn, chn };

export function getGuideTopics(lang: SupportedLang) {
    return USER_GUIDE[lang].flatMap((c) =>
        c.topics.map((t) => ({ ...t, categoryId: c.id, categoryTitle: c.title })),
    );
}
