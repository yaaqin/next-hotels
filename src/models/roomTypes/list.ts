export interface roomTypeLIstProps {
    success: boolean
    message: string
    data: roomTypeListState[]
}

export interface roomTypeListState {
    id: string
    createdAt: string
    createdBy: string
    name: string
    desk: string
    lang: string
}
