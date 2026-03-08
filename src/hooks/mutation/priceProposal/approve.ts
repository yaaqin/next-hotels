import { priceProposalApproval } from '@/src/services/priceProposal/approve'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export const useApprovePriceProposal = () => {
    const router = useRouter()

    return useMutation({
        mutationFn: (id: string) => priceProposalApproval(id),
        onSuccess: () => {
            router.push('/dashboard/price-proposal/')
        },
    })
}