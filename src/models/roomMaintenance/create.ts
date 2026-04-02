export interface CreateRoomMaintenanceReq {
  roomId: string;
  startDate: string;
  endDate: string;
  priority: string;
  requestNote: string;
}

export interface CreateRoomMaintenanceRes {
  success: boolean;
  message: string;
  data: {
    id: string;
    roomId: string;
    startDate: string;
    endDate: string;
    priority: string;
    requestNote: string;
    status: string;
    requestedAt: string;
    requestedBy: string;
  };
}