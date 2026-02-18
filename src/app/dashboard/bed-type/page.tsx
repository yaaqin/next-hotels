import BedTypePage from "@/src/components/pages/bedType"
import { getBedTypes } from "@/src/services/servers/bed-types/bed-types.type"

export default async function page() {
    const { data: bedTypes } = await getBedTypes()
  return (
    <BedTypePage data={bedTypes}/>
  )
}
