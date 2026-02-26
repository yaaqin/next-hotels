import { bedTypeListState } from '@/src/models/bedType/list'
import BasicCard from '../../molecules/cards/basicCard'

export interface BedTypePageProps {
    data: bedTypeListState[]
}

export default function BedTypePage({
    data
}: BedTypePageProps) {
    console.log('datas ==>', data)
    return (
        <div className='flex flex-wrap gap-3 mt-4'>
            {data && data.map((data) => (
                <BasicCard key={data.id} Label={data?.code} desk={data?.createdAt} />
            ))}
        </div>
    )
}
