'use client';

import Buttons from '@/src/components/atoms/buttons';
import { Inputs } from '@/src/components/molecules/inputs/inputs';
import { useCreateRoomType } from '@/src/hooks/mutation/roomType/useCreateRoomType';
import { CreateRoomTypeForm } from '@/src/models/roomTypes/create';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateRoomType() {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateRoomTypeForm>({
    name: '',
    desk: '',
  });

    const { mutate, isPending } = useCreateRoomType();

  const handleSubmit = () => {
    if (!formData.name || !formData.desk) return;

    mutate(
      {
        payload: formData,
        lang: 'idn',
      },
      {
        onSuccess: () => {
          // reset form
          setFormData({ name: '', desk: '' });

          router.push(`/dashboard/room-type`)

        },
        onError: (err) => {
          console.error(err);
        },
      }
    );
  };

  const handleChange = (key: keyof CreateRoomTypeForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // const handleSubmit = () => {
  //   console.log('payload =>', formData);
  //   // nanti tinggal connect ke mutation
  // };

  const isDisabled = !formData.name.trim() || !formData.desk.trim();

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Create Room Type</h1>

      <section>
        <div className="w-1/2 flex flex-col gap-4">
          <Inputs
            label="Name"
            value={formData.name}
            onChange={(value) => handleChange('name', value)}
            placeholder="Ex: Presidential"
          />

          <Inputs
            label="Desk"
            value={formData.desk}
            onChange={(value) => handleChange('desk', value)}
            placeholder="Deskripsi room type"
          />
        </div>
      </section>

      <Buttons
        label="Create"
        onClick={handleSubmit}
        disable={isDisabled}
      />
    </div>
  );
}
