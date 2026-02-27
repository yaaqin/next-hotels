import { SelectOption } from "@/src/components/molecules/inputs/selects";
import { facilityGroupListState } from "@/src/models/facilities/listGroups";
import { facilityTypeState } from "@/src/models/facilities/listType";

export const mapFacilityGroupToOptions = (
  data: facilityGroupListState[],
  lang: string = 'en'
): SelectOption[] => {
  return data.map((group) => {
    const facilityNames = group.facility
      .map((f) => {
        const t = f.translations.find((t) => t.lang === lang) ?? f.translations[0];
        return t?.name ?? f.code;
      })
      .join(', ');

    const label = facilityNames
      ? `${group.code} — ${facilityNames}`
      : group.code;

    return {
      id: group.id,
      value: group.id,
      label,
    };
  });
};

export const mapFacilityTypeToOptions = (data: facilityTypeState[]): SelectOption[] => {
  return data.map((item) => ({
    id: item.id,
    value: item.id,
    label: `${item.code} - ${item.name}`,
  }));
};