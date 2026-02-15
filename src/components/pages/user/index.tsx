import { useUserList } from '@/src/hooks/query/users'
import React from 'react'

export default function UserPage() {
    const { data } = useUserList()
    return (
        <div>
            list user here
            <div className='flex flex-wrap gap-3 mt-4'>
                {data?.data.map((data, key) => (
                    <div key={key} className='flex flex-col bg-amber-100 rounded-xl p-2 px-4'>
                        <h5>{data.username}</h5>
                        <span>{data.email}</span>
                        </div>
                ))}
            </div>
        </div>
    )
}
