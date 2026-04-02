import { axiosPrivate } from "@/src/libs/instance";
import { CreateRoomMaintenanceReq } from "@/src/models/roomMaintenance/create";

export const createRoomMaintenance = async (
  payload: CreateRoomMaintenanceReq
) => {
  const res = await axiosPrivate.post("/maintenances", payload);

  return res.data;
};