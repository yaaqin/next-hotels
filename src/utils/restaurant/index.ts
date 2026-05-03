import { SelectOption } from "@/src/components/molecules/inputs/selects"
import { adminRestoListState } from "@/src/models/adminResto/list"
import { restaurantListState } from "@/src/models/restaurant/list"

export const mapRestoToOptions = (data: restaurantListState[]): SelectOption[] => {
  return data.map((item) => ({
    id: item.id,
    value: item.id,
    label: item.name,
  }))
}

export const mapAdminRestoToOptions = (data: adminRestoListState[]): SelectOption[] => {
  return data.map((item) => ({
    id: item.id,
    value: item.id,
    label: `${item.name} - ${item.email}`,
  }))
}