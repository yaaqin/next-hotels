import { ArrowLeft01Icon } from 'hugeicons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface HeadState {
    label?: string,
    className?: string
    iconSize?: number
}

export default function Heads({
    label = 'Kembali',
    className,
    iconSize
}: HeadState) {
    const router = useRouter()
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <ArrowLeft01Icon className='cursor-pointer' size={iconSize} onClick={() => router.back()}/>
            <p className='capitalize'>{label}</p>
        </div>
    )
}
