import { SelectOption } from "@/src/components/molecules/inputs/selects"
import { adminRestoListState } from "@/src/models/adminResto/list"
import { foodCategoryListState } from "@/src/models/foodCategory/list"
import { restaurantListState } from "@/src/models/restaurant/list"
import { Staff } from "@/src/models/restaurant/restoDashboard/adminResto/list"
import { BranchRestoListState } from "@/src/models/restaurant/restoDashboard/branch/list"

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

export const mapRestoStaffToOptions = (data: Staff[]): SelectOption[] => {
  return data
    .filter((s) => s.role === 'UNASSIGNED')
    .map((item) => ({
      id: item.id,
      value: item.id,
      label: `${item.name} - ${item.email}`,
    }))
}

export const mapBranchToOptions = (data: BranchRestoListState[]): SelectOption[] => {
  return data
    .filter((b) => b.isActive)
    .map((item) => ({
      id: item.id,
      value: item.siteCode,
      label: `${item.siteCode} — ${item.site.nama}`,
    }))
}

export const mapFoodCategoryToOptions = (data: foodCategoryListState[]): SelectOption[] => {
  return data
    .filter((item) => item.status === 'ACTIVE' && item.isActive)
    .map((item) => ({
      id: item.id,
      value: item.id,
      label: `${item.code} - ${item.name}`,
    }))
}