import CreateRoomPage from '@/src/components/pages/room/create/page'
import { getBedTypes } from '@/src/services/servers/bed-types/bed-types.type'

export default async function page() {
      const { data: bedTypes } = await getBedTypes()
  return (
    <CreateRoomPage data={bedTypes}/>
  )
}
