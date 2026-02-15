import { useUserList } from '@/src/hooks/query/users'
import React from 'react'
import BasicCard from '../../molecules/cards/basicCard'
import { label } from 'framer-motion/client'

export default function UserPage() {
    const { data } = useUserList()
    return (
        <div>
            <h6>list user here</h6>
            <div className='flex flex-wrap gap-3 mt-4'>
                {data && data?.data.map((data) => (
                    <BasicCard key={data.id} Label={data?.username} desk={data.email} />
                ))}
            </div>
        </div>
    )
}
