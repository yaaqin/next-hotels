import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
    createReschedulePolicy,
    deleteReschedulePolicy,
    updateReschedulePolicy,
} from '@/src/services/reschedulePolicy/admin'

// Error (overlap range, 403 bukan admin sistem, dll) sudah di-toast oleh axiosPrivate.
const useInvalidatePolicies = () => {
    const queryClient = useQueryClient()
    return () => queryClient.invalidateQueries({ queryKey: ['reschedule-policy-list'] })
}

export const useCreateReschedulePolicy = () => {
    const invalidate = useInvalidatePolicies()
    return useMutation({
        mutationFn: createReschedulePolicy,
        onSuccess: () => {
            toast.success('Policy reschedule dibuat')
            invalidate()
        },
    })
}

export const useUpdateReschedulePolicy = () => {
    const invalidate = useInvalidatePolicies()
    return useMutation({
        mutationFn: updateReschedulePolicy,
        onSuccess: () => {
            toast.success('Policy reschedule diupdate')
            invalidate()
        },
    })
}

export const useDeleteReschedulePolicy = () => {
    const invalidate = useInvalidatePolicies()
    return useMutation({
        mutationFn: deleteReschedulePolicy,
        onSuccess: () => {
            toast.success('Policy reschedule dihapus')
            invalidate()
        },
    })
}
