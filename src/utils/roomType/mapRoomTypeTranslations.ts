import { RoomTypeFormInitialData } from "@/src/components/organisms/roomTypes/updateTranslation";
import { TranslationDetailRoomType } from "@/src/models/roomTypes/detailAllLang";

type Lang = "idn" | "eng" | "jpn" | "chn";

export const mapToRoomTypeFormInitialData = (
  data?: TranslationDetailRoomType[]
): RoomTypeFormInitialData | undefined => {
  if (!data || data.length === 0) return undefined;

  return {
    translations: data
      .filter((t): t is TranslationDetailRoomType & { lang: Lang } =>
        ["idn", "eng", "jpn", "chn"].includes(t.lang)
      )
      .map((t) => ({
        lang: t.lang as Lang,
        name: t.name,
        desk: t.desk,
      })),
  };
};
