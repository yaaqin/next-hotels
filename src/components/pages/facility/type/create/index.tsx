'use client'
import Buttons from '@/src/components/atoms/buttons';
import { Inputs } from '@/src/components/molecules/inputs/inputs';
import { useCreateFacilityType } from '@/src/hooks/mutation/facility/useCreateFacilityType';
import { queryClient } from '@/src/libs/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react'

export default function CreateFacilityTypePage() {
    const router = useRouter()
    const [code, setCode] = useState('')
    const [name, setName] = useState('')
    const [note, setNote] = useState('')
    const { mutate } = useCreateFacilityType();

    const handleSubmit = () => {
        mutate(
        {
            code: code,
            name: name,
            note: note,
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['room-type-list'] });
                router.push('/dashboard/facility/type/');
            },
        }
    );
    };
    return (
        <div>
            <h6> u can create type items here</h6>
            <section className='flex justify-between items-center gap-4'>
                <Inputs label={'Name'} value={name} onChange={setName} containerClassName='w-1/2' />
                <Inputs label={'CODE'} value={code} onChange={setCode} containerClassName='w-1/2' />
                <Inputs label={'Note'} value={note} onChange={setNote} containerClassName='w-1/2' />
            </section>

            <Buttons label='Create' className='mt-4' onClick={handleSubmit}/>
        </div>
    )
}
