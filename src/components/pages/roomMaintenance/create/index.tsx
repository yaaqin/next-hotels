'use client'

import { Selects } from "@/src/components/molecules/inputs/selects"
import { Textareas } from "@/src/components/molecules/inputs/textAreas"
import { Inputs } from "@/src/components/molecules/inputs/inputs"
import { PRIORITY_OPTIONS } from "@/src/constans/roomMaintenance"
import { useRoomList } from "@/src/hooks/query/rooms"
import { roomListToOptions } from "@/src/utils/room"
import { useState } from "react"
import { useCreateRoomMaintenance } from "@/src/hooks/mutation/roomMaintenance/create"

export default function CreateRoomMaintain() {
    const { data: roomList } = useRoomList()
    const roomOptions = roomListToOptions(roomList?.data ?? []);

    const { mutate, isPending } = useCreateRoomMaintenance()

    const [roomId, setRoomId] = useState('')
    const [priority, setPriority] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [requestNote, setRequestNote] = useState('')

    const handleSubmit = () => {
        mutate({
            roomId,
            priority,
            startDate,
            endDate,
            requestNote,
        })
    }

    return (
        <div className="flex flex-col gap-4">
            <Selects
                label="Room"
                value={roomId}
                onChange={setRoomId}
                options={roomOptions}
                placeholder="Select room"
                required
            />
            <Selects
                label="Priority"
                value={priority}
                onChange={setPriority}
                options={PRIORITY_OPTIONS}
                placeholder="Select priority"
                required
            />
            <div className="grid grid-cols-2 gap-4">
                <Inputs
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                    type="date"
                    required
                />
                <Inputs
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate}
                    type="date"
                    required
                />
            </div>
            <Textareas
                label="Request Note"
                value={requestNote}
                onChange={setRequestNote}
                placeholder="Deskripsikan kerusakan..."
                rows={5}
                maxLength={500}
                required
            />

            <button
                onClick={handleSubmit}
                disabled={isPending}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
            >
                {isPending ? 'Submitting...' : 'Submit'}
            </button>
        </div>
    )
}