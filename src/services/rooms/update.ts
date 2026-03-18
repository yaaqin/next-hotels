import { axiosPrivate } from "@/src/libs/instance";
import { UpdateRoomReq } from "@/src/models/room/update";

export const updateRoom = async ({ id, ...payload }: UpdateRoomReq) => {
    const res = await axiosPrivate.patch(`/rooms/${id}`, payload);
    return res.data;
};