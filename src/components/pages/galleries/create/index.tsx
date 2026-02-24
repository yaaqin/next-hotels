'use client'
import ImageSelector from '@/src/components/organisms/galleries/ImageSelector'
import { useImageList } from '@/src/hooks/query/images'

export default function CreateGalleriesPage() {
    const { data } = useImageList()
    return (
        <div>
            <h5>Create Gallery</h5>
            {data && (
                <ImageSelector
                    images={data.data}
                    onSubmit={(payload) => console.log(payload)} />
            )}
        </div>
    )
}
