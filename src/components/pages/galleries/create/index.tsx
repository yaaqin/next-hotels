'use client'
import { Inputs } from '@/src/components/molecules/inputs/inputs'
import ImageSelector from '@/src/components/organisms/galleries/ImageSelector'
import { useCreateGallery } from '@/src/hooks/mutation/gallery/create'
import { useImageList } from '@/src/hooks/query/images'
import { useState } from 'react'

export default function CreateGalleriesPage() {
    const { data } = useImageList()

    const [title, setTitle] = useState('')

    const { mutate } = useCreateGallery();

    const handleSubmit = (imageIds: string[]) => {
        mutate({
            title: title,
            imageIds: imageIds
        });
    };
    return (
        <div>
            <h5 className='mb-4'>Create Gallery</h5>
            <Inputs label={'Title'} value={title} onChange={setTitle} />
            {data && (
                <ImageSelector
                    images={data.data}
                    onSubmit={(payload) => handleSubmit(payload)} />
            )}
        </div>
    )
}
