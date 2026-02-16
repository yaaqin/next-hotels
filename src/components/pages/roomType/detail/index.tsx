'use client'

import Buttons from "@/src/components/atoms/buttons";
import TranslationTable from "@/src/components/organisms/roomTypes/translationTable";
import RoomTypeMultiTranslationForm from "@/src/components/organisms/roomTypes/updateTranslation";
import { useMultiRoomTypeTranslation } from "@/src/hooks/mutation/roomType/useMultiRoomTypeTranslation";
import { useRoomTypeDetailAllLang } from "@/src/hooks/query/roomTypes/detailAllLang"
import { mapToRoomTypeFormInitialData } from "@/src/utils/roomType/mapRoomTypeTranslations";
import { useParams } from "next/navigation"
import { useState } from "react";
import toast from "react-hot-toast";

export default function DetailRoomType() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [isUpdate, setIsUpdate] = useState(false)

  const { data, isLoading, refetch } = useRoomTypeDetailAllLang(id || '')

  const { mutateAsync, isPending } = useMultiRoomTypeTranslation(id);


  const handleSubmit = async (payload: {
    translations: {
      lang: "idn" | "eng" | "jpn" | "chn";
      name: string;
      desk: string;
    }[];
  }) => {

    console.log('datass ==>', payload)
    try {
      await mutateAsync(payload);

      toast.success("Multi translation berhasil disimpan");
      setIsUpdate(false);
      refetch();
    } catch (error) {
      toast.error("Gagal menyimpan translation");
      console.error(error);
    }
  };
  return (
    <div>
      <div className="flex justify-between items-center">
        <h5>detailnya disini yaa</h5>
        <Buttons label="Update Translation" onClick={() => setIsUpdate(!isUpdate)} />
      </div>
      {isLoading ? (
        <p>Loading</p>
      ) : isUpdate ? (
        <RoomTypeMultiTranslationForm
          onSubmit={handleSubmit}
          initialData={mapToRoomTypeFormInitialData(data?.data.translations)} />
      ) : data && (
        <TranslationTable data={data?.data.translations} />
      )}

    </div>
  )
}
