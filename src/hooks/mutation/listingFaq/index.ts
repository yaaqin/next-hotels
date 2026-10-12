import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
    createListingFaq,
    deleteListingFaq,
    reorderListingFaq,
    setAutoFaq,
    updateListingFaq,
} from '@/src/services/listingFaq/admin'

// Error (validasi, 401, dll) sudah di-toast oleh axiosPrivate.
const useInvalidateFaqs = () => {
    const queryClient = useQueryClient()
    return () => queryClient.invalidateQueries({ queryKey: ['listing-faq-list'] })
}

export const useCreateListingFaq = () => {
    const invalidate = useInvalidateFaqs()
    return useMutation({
        mutationFn: createListingFaq,
        onSuccess: () => {
            toast.success('FAQ dibuat')
            invalidate()
        },
    })
}

export const useUpdateListingFaq = () => {
    const invalidate = useInvalidateFaqs()
    return useMutation({
        mutationFn: updateListingFaq,
        onSuccess: () => {
            toast.success('FAQ diupdate')
            invalidate()
        },
    })
}

export const useDeleteListingFaq = () => {
    const invalidate = useInvalidateFaqs()
    return useMutation({
        mutationFn: deleteListingFaq,
        onSuccess: () => {
            toast.success('FAQ dihapus')
            invalidate()
        },
    })
}

export const useSetAutoFaq = () => {
    const invalidate = useInvalidateFaqs()
    return useMutation({
        mutationFn: setAutoFaq,
        onSuccess: invalidate,
    })
}

// Response berisi daftar dengan urutan baru → langsung dipakai tanpa refetch
export const useReorderListingFaq = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: reorderListingFaq,
        onSuccess: (data) => queryClient.setQueryData(['listing-faq-list'], data),
    })
}
