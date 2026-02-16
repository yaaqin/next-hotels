'use client'

import TranslationTable from "@/src/components/organisms/roomTypes/translationTable";
import { useRoomTypeDetailAllLang } from "@/src/hooks/query/roomTypes/detailAllLang"
import { useParams } from "next/navigation"

export default function DetailRoomType() {
  const params = useParams<{ id: string }>();
  const id = params.id;
    
    const {data, isLoading} = useRoomTypeDetailAllLang(id || '')
    console.log('data semua bahasa ==>', data)
  return (
    <div>
      detailnya disini yaa
      {isLoading ? (
        <p>Loading</p>
      ) : data && (
          <TranslationTable data={data?.data.translations}/>
      )}
    </div>
  )
}
