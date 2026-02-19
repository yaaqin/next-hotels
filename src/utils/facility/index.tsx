import { SelectOption } from "@/src/components/molecules/inputs/selects";
import { facilityTypeState } from "@/src/models/facilities/listType";

export const mapFacilityTypeToOptions = (data: facilityTypeState[]): SelectOption[] => {
  return data.map((item) => ({
    id: item.id,
    value: item.id,
    label: `${item.code} - ${item.name}`,
  }));
};