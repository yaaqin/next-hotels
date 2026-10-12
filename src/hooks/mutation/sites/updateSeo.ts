import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { updateSiteSeo } from '@/src/services/sites/updateSeo'

// Error (slug/alias bentrok, dll) sudah di-toast oleh axiosPrivate.
export const useUpdateSiteSeo = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: updateSiteSeo,
        onSuccess: () => {
            toast.success('Data cabang diupdate')
            queryClient.invalidateQueries({ queryKey: ['site-list'] })
        },
    })
}
