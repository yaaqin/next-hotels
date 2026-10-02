import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
    approvePriceAdjustment,
    createPriceAdjustment,
    rejectPriceAdjustment,
} from '@/src/services/priceAdjustment'

// Error (tanggal tanpa proposal, 403, dll) sudah di-toast oleh axiosPrivate.
const useInvalidateAdjustments = () => {
    const queryClient = useQueryClient()
    return () => {
        queryClient.invalidateQueries({ queryKey: ['price-adjustment-list'] })
        queryClient.invalidateQueries({ queryKey: ['price-adjustment-detail'] })
        queryClient.invalidateQueries({ queryKey: ['price-adjustment-calendar'] })
    }
}

export const useCreatePriceAdjustment = () => {
    const invalidate = useInvalidateAdjustments()
    const router = useRouter()
    return useMutation({
        mutationFn: createPriceAdjustment,
        onSuccess: (res) => {
            toast.success('Price adjustment dibuat, menunggu approval')
            invalidate()
            router.push(`/dashboard/price-adjustment/${res.data.id}`)
        },
    })
}

export const useApprovePriceAdjustment = () => {
    const invalidate = useInvalidateAdjustments()
    return useMutation({
        mutationFn: approvePriceAdjustment,
        onSuccess: () => {
            toast.success('Price adjustment di-approve, harga baru langsung berlaku')
            invalidate()
        },
    })
}

export const useRejectPriceAdjustment = () => {
    const invalidate = useInvalidateAdjustments()
    return useMutation({
        mutationFn: rejectPriceAdjustment,
        onSuccess: () => {
            toast.success('Price adjustment di-reject')
            invalidate()
        },
    })
}
