interface BasicCardProps {
    Label: string
    desk?: string
}

export default function BasicCard({
    Label,
    desk
}: BasicCardProps) {
    return (
        <div className='flex flex-col bg-amber-100 rounded-xl p-2 px-4'>
            <h5>{Label}</h5>
            <span>{desk}</span>
        </div>
    )
}
