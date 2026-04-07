'use client'

import WithdrawTable from "@/src/components/organisms/withdraw/table"
import { useWithdrawList } from "@/src/hooks/query/withdraw/list"

export default function page() {
    const { data, isLoading } = useWithdrawList()
    return (
        <div>
            {isLoading && (
                <p>Loading...</p>
            )}
            {data && (
                <div className="p-6">  {/* atau px-6, pastiin ada padding kanan */}
                    <WithdrawTable data={data.data} />
                </div>
            )}
        </div>
    )
}
