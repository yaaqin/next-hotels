'use client'
import SliderImage from '@/src/components/organisms/galleries/sliderImage';
import { useGalleryDetail } from '@/src/hooks/query/galleries/detail'
import { useParams } from 'next/navigation';

export default function DetailGalleryPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;

    const { data } = useGalleryDetail(id)

    return (
        <div>
            {data && (

                <section>
                    <h5 className='text-xl mb-2'>
                        {data?.data.title}
                    </h5>
                    <SliderImage data={data?.data} />
                </section>
            )}
        </div>
    )
}
