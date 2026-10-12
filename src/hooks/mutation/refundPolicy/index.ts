import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
    createRefundPolicy,
    deleteRefundPolicy,
    updateRefundPolicy,
} from '@/src/services/refundPolicy/admin'

// Error (overlap range, 403 bukan admin sistem, dll) sudah di-toast oleh axiosPrivate.
const useInvalidatePolicies = () => {
    const queryClient = useQueryClient()
    return () => queryClient.invalidateQueries({ queryKey: ['refund-policy-list'] })
}

export const useCreateRefundPolicy = () => {
    const invalidate = useInvalidatePolicies()
    return useMutation({
        mutationFn: createRefundPolicy,
        onSuccess: () => {
            toast.success('Policy refund dibuat')
            invalidate()
        },
    })
}

export const useUpdateRefundPolicy = () => {
    const invalidate = useInvalidatePolicies()
    return useMutation({
        mutationFn: updateRefundPolicy,
        onSuccess: () => {
            toast.success('Policy refund diupdate')
            invalidate()
        },
    })
}

export const useDeleteRefundPolicy = () => {
    const invalidate = useInvalidatePolicies()
    return useMutation({
        mutationFn: deleteRefundPolicy,
        onSuccess: () => {
            toast.success('Policy refund dihapus')
            invalidate()
        },
    })
}
