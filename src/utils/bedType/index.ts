import { SelectOption } from '@/src/components/molecules/inputs/selects';
import { bedTypeListProps, bedTypeListState, Translation } from '@/src/models/bedType/list';

interface MapBedTypeOptionsConfig {
  currentLang?: string;
  useCodeAsValue?: boolean;
  includeSize?: boolean;
  includeDescription?: boolean;
}

export const mapBedTypeToOptions = (
  response: bedTypeListState[] | undefined,
  config?: MapBedTypeOptionsConfig
): SelectOption[] => {
  if (!response) return [];

  const {
    currentLang,
    useCodeAsValue = false,
    includeSize = false,
    includeDescription = false,
  } = config || {};

  return response.map((bed: bedTypeListState) => {
    // pilih translation sesuai lang
    let translation: Translation | undefined;

    if (currentLang) {
      translation = bed.translations.find(
        (t) => t.lang === currentLang
      );
    }

    // fallback kalau tidak ada
    if (!translation) {
      translation = bed.translations[0];
    }

    let label = translation?.name || bed.code;

    if (includeSize && translation?.size) {
      label += ` - ${translation.size}`;
    }

    if (includeDescription && translation?.description) {
      label += ` (${translation.description})`;
    }

    return {
      id: bed.id,
      value: useCodeAsValue ? bed.code : bed.id,
      label,
    };
  });
};