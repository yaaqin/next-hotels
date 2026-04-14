"use client"
import { useUserLogs } from '@/src/hooks/query/userLogs/list'
import UserLogTable from '../../organisms/userLog/table'

export default function UserLogPage() {
    const {data} = useUserLogs()
  return (
    <div>
        {data && (
            <UserLogTable data={data.data}/>
        )}
    </div>
  )
}
