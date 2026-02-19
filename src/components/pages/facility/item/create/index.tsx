'use client'
import Buttons from '@/src/components/atoms/buttons';
import { Inputs } from '@/src/components/molecules/inputs/inputs';
import { Selects } from '@/src/components/molecules/inputs/selects';
import { useCreateFacilityItem } from '@/src/hooks/mutation/facility/useCreateFacilityItem';
import { useFacilityTypeList } from '@/src/hooks/query/facilities/listType';
import { queryClient } from '@/src/libs/react-query';
import { mapFacilityTypeToOptions } from '@/src/utils/facility';
import { useRouter } from 'next/navigation';
import { useState } from 'react'

export default function CreateFacilityItemPage() {
    const router = useRouter()
    const [code, setCode] = useState('')
    const [name, setName] = useState('')
    const [typeId, setTypeId] = useState('')
    const [note, setNote] = useState('')

    const { mutate, isPending } = useCreateFacilityItem();
    const { data: typeList } = useFacilityTypeList()

    const handleSubmit = () => {
        mutate(
            { code, typeId, name, note },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['facility-item-list'] });
                    router.push('/dashboard/facility/');
                },
            }
        );
    };
    return (

        <div>
            <h6> u can create menu here</h6>
            <section className='flex justify-between items-center gap-4'>
                <Inputs label={'Name'} value={name} onChange={setName} containerClassName='w-1/2' />
                <Inputs label={'CODE'} value={code} onChange={setCode} containerClassName='w-1/2' />
                {typeList && (
                    <Selects label={'Type'} value={typeId} onChange={setTypeId} containerClassName='w-1/2' options={mapFacilityTypeToOptions(typeList?.data)} />
                )}
                <Inputs label={'Note'} value={note} onChange={setNote} containerClassName='w-1/2' />
            </section>

            <Buttons label={isPending ? 'Loading' : 'Create'} className='mt-4' onClick={handleSubmit}/>
        </div>
    )
}
