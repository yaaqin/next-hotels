'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Buttons from '@/src/components/atoms/buttons';
import { Inputs } from '@/src/components/molecules/inputs/inputs';
import { Selects } from '@/src/components/molecules/inputs/selects';
import { useCreateRoom } from '@/src/hooks/mutation/room/create';
import { queryClient } from '@/src/libs/react-query';
import { useRoomTypeList } from '@/src/hooks/query/roomTypes';
import { useSiteList } from '@/src/hooks/query/sites';
import { BedTypePageProps } from '../../bedType';
import { mapSiteToOptions } from '@/src/utils/site';
import { mapRoomTypeToOptions } from '@/src/utils/roomType/mapRoomTypeTranslations';
import { mapBedTypeToOptions } from '@/src/utils/bedType';
import { useFacilityGroupList } from '@/src/hooks/query/facilities/listGroups';
import { mapFacilityGroupToOptions } from '@/src/utils/facility';
import { useGalleryList } from '@/src/hooks/query/galleries/list';
import { mapGalleryToOptions } from '@/src/utils/gallery';

export default function CreateRoomPage({
  data: bedTypeList
}: BedTypePageProps
) {
  const router = useRouter();

  const [siteCode, setSiteCode] = useState('');
  const [number, setNumber] = useState('');
  const [roomTypeId, setRoomTypeId] = useState('');
  const [bedTypeId, setBedTypeId] = useState('');
  const [facilityGroupId, setFacilityGroupId] = useState('');
  const [galleryId, setGalleryId] = useState('');

  const { mutate, isPending } = useCreateRoom();

  const { data: roomTypeList } = useRoomTypeList();
  const { data: fg } = useFacilityGroupList()
  const { data: siteList } = useSiteList();
  const { data: gallery } = useGalleryList();

  const handleSubmit = () => {
    mutate(
      {
        siteCode,
        number,
        roomTypeId,
        bedTypeId,
        facilityGroupId,
        galleryId
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['room-list'],
          });

          router.push('/dashboard/room');
        },
      }
    );
    // console.log({
    //   siteCode,
    //   number,
    //   roomTypeId,
    //   bedTypeId,
    //   facilityGroupId,
    // })
  };

  return (
    <div>
      <h6>Create Room</h6>

      <section className="flex flex-wrap gap-4">
        {siteList && (
          <Selects
            label="Site Code"
            value={siteCode}
            onChange={setSiteCode}
            containerClassName="w-1/2"
            options={mapSiteToOptions(siteList, { useSiteCode: true })}
          />
        )}

        <Inputs
          label="Room Number"
          value={number}
          onChange={setNumber}
          containerClassName="w-1/2"
        />

        {roomTypeList && (
          <Selects
            label="Room Type"
            value={roomTypeId}
            onChange={setRoomTypeId}
            containerClassName="w-1/2"
            options={mapRoomTypeToOptions(roomTypeList)}
          />
        )}

        {bedTypeList && (
          <Selects
            label="Bed Type"
            value={bedTypeId}
            onChange={setBedTypeId}
            containerClassName="w-1/2"
            options={mapBedTypeToOptions(bedTypeList)}
          />
        )}

        {fg && (
          <Selects
            label="Facility Group"
            value={facilityGroupId}
            onChange={setFacilityGroupId}
            containerClassName="w-1/2"
            options={mapFacilityGroupToOptions(fg.data)}
          />
        )}
        {gallery && (
          <Selects
            label="Gallery"
            value={galleryId}
            onChange={setGalleryId}
            containerClassName="w-1/2"
            options={mapGalleryToOptions(gallery.data)}
          />
        )}
      </section>

      <Buttons
        label={isPending ? 'Loading...' : 'Create'}
        className="mt-6"
        onClick={handleSubmit}
      />
    </div>
  );
}