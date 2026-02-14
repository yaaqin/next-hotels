interface TooltipProps {
    label: string
}

export default function Tooltips({
    label
}: TooltipProps) {
    return (
        <span className="absolute left-4 -translate-x-1/4 scale-0 group-hover:scale-100 transition-transform duration-300 bg-gray-700 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap z-10">
            {label}
        </span>
    )
}
