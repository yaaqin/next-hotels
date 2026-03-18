'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Buttons from '@/src/components/atoms/buttons';
import { Inputs } from '@/src/components/molecules/inputs/inputs';
import { Selects } from '@/src/components/molecules/inputs/selects';
import { useUpdateRoom } from '@/src/hooks/mutation/room/update';
import { useRoomDetail } from '@/src/hooks/query/rooms/detail';
import { useRoomTypeList } from '@/src/hooks/query/roomTypes';
import { useFacilityGroupList } from '@/src/hooks/query/facilities/listGroups';
import { useGalleryList } from '@/src/hooks/query/galleries/list';
import { mapRoomTypeToOptions } from '@/src/utils/roomType/mapRoomTypeTranslations';
import { mapBedTypeToOptions } from '@/src/utils/bedType';
import { mapFacilityGroupToOptions } from '@/src/utils/facility';
import { mapGalleryToOptions } from '@/src/utils/gallery';
import { queryClient } from '@/src/libs/react-query';

export default function EditRoomPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: detail, isLoading } = useRoomDetail(id);

  const [number, setNumber] = useState('');
  const [roomTypeId, setRoomTypeId] = useState('');
  const [bedTypeId, setBedTypeId] = useState('');
  const [facilityGroupId, setFacilityGroupId] = useState('');
  const [galleryId, setGalleryId] = useState('');

  // Populate state setelah data detail tersedia
  useEffect(() => {
    if (detail?.data) {
      setNumber(detail.data.number);
      setRoomTypeId(detail.data.roomType.id);
      setBedTypeId(detail.data.bedType.id);
      setFacilityGroupId(detail.data.facilityGroup.id);
      setGalleryId(detail.data.gallery?.id ?? '');
    }
  }, [detail]);

  const { mutate, isPending } = useUpdateRoom(id);
  const { data: roomTypeList } = useRoomTypeList();
//   const { data: bedTypeList } = useBedTypeList();
  const { data: fg } = useFacilityGroupList();
  const { data: gallery } = useGalleryList();

  const isDirty =
    number !== detail?.data.number ||
    roomTypeId !== detail?.data.roomType.id ||
    bedTypeId !== detail?.data.bedType.id ||
    facilityGroupId !== detail?.data.facilityGroup.id ||
    galleryId !== (detail?.data.gallery?.id ?? '');

  const handleSubmit = () => {
    const payload: Record<string, string> = { id };
    if (number !== detail?.data.number) payload.number = number;
    if (roomTypeId !== detail?.data.roomType.id) payload.roomTypeId = roomTypeId;
    if (bedTypeId !== detail?.data.bedType.id) payload.bedTypeId = bedTypeId;
    if (facilityGroupId !== detail?.data.facilityGroup.id) payload.facilityGroupId = facilityGroupId;
    if (galleryId !== (detail?.data.gallery?.id ?? '')) payload.galleryId = galleryId;

    mutate(payload as any, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['room-list'] });
        queryClient.invalidateQueries({ queryKey: ['room-detail', id] });
        router.push('/dashboard/room');
      },
    });
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading...</p>;

  return (
    <div>
      <h6>Edit Room</h6>

      <section className="grid grid-cols-2 gap-4 mt-4">
        <div className="col-span-2 p-3 rounded-lg bg-muted text-sm text-muted-foreground flex items-center gap-2">
          <span className="font-medium text-foreground">Room ID:</span>
          <span className="font-mono">{id}</span>
          {number !== detail?.data.number && (
            <span className="ml-auto text-xs text-yellow-500">
              ⚠ ID will change after save
            </span>
          )}
        </div>

        <Inputs
          label="Room Number"
          value={number}
          onChange={setNumber}
        />

        {roomTypeList && (
          <Selects
            label="Room Type"
            value={roomTypeId}
            onChange={setRoomTypeId}
            options={mapRoomTypeToOptions(roomTypeList)}
          />
        )}

        {/* {bedTypeList && (
          <Selects
            label="Bed Type"
            value={bedTypeId}
            onChange={setBedTypeId}
            options={mapBedTypeToOptions(bedTypeList)}
          />
        )} */}

        {fg && (
          <Selects
            label="Facility Group"
            value={facilityGroupId}
            onChange={setFacilityGroupId}
            options={mapFacilityGroupToOptions(fg.data)}
          />
        )}

        {gallery && (
          <Selects
            label="Gallery"
            value={galleryId}
            onChange={setGalleryId}
            options={mapGalleryToOptions(gallery.data)}
          />
        )}
      </section>

      <div className="flex items-center gap-3 mt-6">
        <Buttons
          label="Cancel"
          className="variant-outline"
          onClick={() => router.push('/dashboard/room')}
        />
        <Buttons
          label={isPending ? 'Saving...' : 'Save Changes'}
          onClick={handleSubmit}
          disable={!isDirty || isPending}
        />
      </div>
    </div>
  );
}