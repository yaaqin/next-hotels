'use client'
import UserDetailLog from '@/src/components/organisms/userLog/detail';
import { useUserLogDetail } from '@/src/hooks/query/userLogs/detail';
import { useParams } from 'next/navigation';

export default function UserLogDetail() {
    const params = useParams<{ id: string }>();
    const id = params.id;

    const { data } = useUserLogDetail(id)

    return (
        <div>
            {data && (
                <UserDetailLog success={data.success} data={data.data}/>
            )}
        </div>
    )
}
