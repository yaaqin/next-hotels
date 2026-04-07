'use client'

import WithdrawTable from "@/src/components/organisms/withdraw/table"
import { useWithdrawList } from "@/src/hooks/query/withdraw/list"

export default function WithdrawalPage() {
    const { data, isLoading } = useWithdrawList()
    return (
        <div>
            {isLoading && (
                <p>Loading...</p>
            )}
            {data && (
                <div className="p-6">  
                    <WithdrawTable data={data.data} />
                </div>
            )}
        </div>
    )
}
