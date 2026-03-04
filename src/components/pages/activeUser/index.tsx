'use client'
import { useSessionTokenList } from '@/src/hooks/query/sessionToken/list'
import SessionTokenTable from '../../organisms/activeUser/table'
export default function ActiveUserPage() {
    const { data } = useSessionTokenList()
    console.log('data ==>', data)
    return (
        <div>
            {data && (
                <SessionTokenTable data={data.data} meta={data.meta}/>
            )}
        </div>
    )
}
