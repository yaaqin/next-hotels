export interface UpdateRoomReq {
    id: string;
    number?: string;
    roomTypeId?: string;
    bedTypeId?: string;
    facilityGroupId?: string;
    galleryId?: string;
}

export interface UpdateRoomRes {
    // sesuaikan dengan response shape dari backend lu
    data: {
        id: string;
        number: string;
        floorId: string;
        siteCode: string;
        roomTypeId: string;
        bedTypeId: string;
        facilityGroupId: string;
        galleryId: string;
    };
}