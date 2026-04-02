import { SelectOption } from "@/src/components/molecules/inputs/selects";
import { roomListState } from "@/src/models/room/list";

export const roomListToOptions = (rooms: roomListState[]): SelectOption[] => {
  return rooms.map((room, index) => ({
    id: index,
    value: room.id,
    label: `${room.number} - ${room.siteCode}`,
  }));
};