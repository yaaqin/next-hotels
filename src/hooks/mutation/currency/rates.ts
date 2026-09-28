import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { refreshRates, resetRateToAuto, setManualRate } from '@/src/services/currency/admin'

// Setelah kurs berubah, daftar di-fetch ulang. Error (mis. 403) sudah di-toast oleh axiosPrivate.
const useInvalidateRates = () => {
    const queryClient = useQueryClient()
    return () => queryClient.invalidateQueries({ queryKey: ['currency-admin-list'] })
}

export const useSetManualRate = () => {
    const invalidate = useInvalidateRates()
    return useMutation({
        mutationFn: setManualRate,
        onSuccess: (_res, vars) => {
            toast.success(`Kurs ${vars.code} dikunci manual`)
            invalidate()
        },
    })
}

export const useResetRateToAuto = () => {
    const invalidate = useInvalidateRates()
    return useMutation({
        mutationFn: resetRateToAuto,
        onSuccess: (_res, code) => {
            toast.success(`Kurs ${code} kembali otomatis`)
            invalidate()
        },
    })
}

export const useRefreshRates = () => {
    const invalidate = useInvalidateRates()
    return useMutation({
        mutationFn: refreshRates,
        onSuccess: (res) => {
            const updated: string[] = res?.data?.updated ?? []
            toast.success(updated.length ? `Kurs diperbarui: ${updated.join(', ')}` : 'Tidak ada kurs otomatis yang diperbarui')
            invalidate()
        },
    })
}
