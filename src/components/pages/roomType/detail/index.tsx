'use client'

import Buttons from "@/src/components/atoms/buttons";
import InfoCard from "@/src/components/molecules/cards/infoCard";
import TranslationTable from "@/src/components/organisms/roomTypes/translationTable";
import RoomTypeMultiTranslationForm from "@/src/components/organisms/roomTypes/updateTranslation";
import { useMultiRoomTypeTranslation } from "@/src/hooks/mutation/roomType/useMultiRoomTypeTranslation";
import { useRoomTypeDetail } from "@/src/hooks/query/roomTypes/detail";
import { useRoomTypeDetailAllLang } from "@/src/hooks/query/roomTypes/detailAllLang"
import { mapToRoomTypeFormInitialData } from "@/src/utils/roomType/mapRoomTypeTranslations";
import { useParams } from "next/navigation"
import { useState } from "react";
import toast from "react-hot-toast";
import { label } from 'framer-motion/client';

export default function DetailRoomType() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [isUpdate, setIsUpdate] = useState(false)

  const { data, isLoading, refetch } = useRoomTypeDetailAllLang(id || '')
  const { data: dataDetail, isLoading: detailLoading,  } = useRoomTypeDetail(id || '')

  const { mutateAsync } = useMultiRoomTypeTranslation(id);

  const handleSubmit = async (payload: {
    translations: {
      lang: "idn" | "eng" | "jpn" | "chn";
      name: string;
      desk: string;
    }[];
  }) => {

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
      <div className="flex justify-end items-center">
        <Buttons label="Update Translation" onClick={() => setIsUpdate(!isUpdate)} />
      </div>
      <section className="grid grid-cols-3 gap-4 my-4">
        <InfoCard Label={"Name"} value={dataDetail?.data.name} className="grid col-span-1 truncate"/>
        <InfoCard Label={"Desk"} value={dataDetail?.data.desk} className="grid col-span-1 truncate"/>
      </section>
      {(isLoading || detailLoading) ? (
        <p>Loading...</p>
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
