import { axiosPrivate } from "@/src/libs/instance"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

const approveWithdraw = async (id: string) => {
    const res = await axiosPrivate.post(`/withdraw/approve/${id}`)
    return res.data
}

export const useApproveWithdraw = (id: string) => {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation({
        mutationFn: () => approveWithdraw(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['withdraw-list'] })
            router.push('/dashboard/withdraw')
        },
    })
}