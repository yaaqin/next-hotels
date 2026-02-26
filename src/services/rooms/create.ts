import { axiosPrivate } from "@/src/libs/instance";
import { CreateRoomReq } from "@/src/models/room/create";

export const createRoom = async (
    payload: CreateRoomReq
) => {
    const res = await axiosPrivate.post("/rooms", payload);

    return res.data;
};