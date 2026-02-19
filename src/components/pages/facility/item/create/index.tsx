'use client'
import Buttons from '@/src/components/atoms/buttons';
import { Inputs } from '@/src/components/molecules/inputs/inputs';
import { useCreateFacilityType } from '@/src/hooks/mutation/facility/useCreateFacilityType';
import { useState } from 'react'

export default function CreateFacilityItemPage() {
    const [code, setCode] = useState('')
    const [name, setName] = useState('')
    const [note, setNote] = useState('')
   
    return (

        <div>
            <h6> u can create menu here</h6>
            <section className='flex justify-between items-center gap-4'>
                <Inputs label={'Name'} value={name} onChange={setName} containerClassName='w-1/2' />
                <Inputs label={'CODE'} value={code} onChange={setCode} containerClassName='w-1/2' />
                <Inputs label={'Note'} value={note} onChange={setNote} containerClassName='w-1/2' />
            </section>

            <Buttons label='Create' className='mt-4' />
        </div>
    )
}
