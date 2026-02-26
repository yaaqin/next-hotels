import { RoomTypeFormInitialData } from "@/src/components/organisms/roomTypes/updateTranslation";
import { TranslationDetailRoomType } from "@/src/models/roomTypes/detailAllLang";
import { SelectOption } from '@/src/components/molecules/inputs/selects';
import { roomTypeLIstProps, roomTypeListState } from "@/src/models/roomTypes/list";

type Lang = "idn" | "eng" | "jpn" | "chn";

interface MapRoomTypeOptionsConfig {
  useNameAsValue?: boolean;
  includeDescription?: boolean;
  includeLang?: boolean;
}

export const mapRoomTypeToOptions = (
  response: roomTypeLIstProps | undefined,
  config?: MapRoomTypeOptionsConfig
): SelectOption[] => {
  if (!response?.data) return [];

  const {
    useNameAsValue = false,
    includeDescription = false,
    includeLang = false,
  } = config || {};

  return response.data.map((room: roomTypeListState) => {
    let label = room.name;

    if (includeDescription && room.desk) {
      label += ` - ${room.desk}`;
    }

    if (includeLang && room.lang) {
      label += ` (${room.lang})`;
    }

    return {
      id: room.id,
      value: useNameAsValue ? room.name : room.id,
      label,
    };
  });
};

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
