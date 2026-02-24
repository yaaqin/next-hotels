'use client'
import { useUserList } from '@/src/hooks/query/users'
import UserTable from '../../organisms/users/table'

export default function UserPage() {
    const { data } = useUserList()
    return (
        <div>
            <h6>list user here</h6>
            {data && (
                <UserTable data={data.data}/>
            )}
        </div>
    )
}
