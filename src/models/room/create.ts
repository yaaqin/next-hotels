export interface CreateRoomReq {
  siteCode: string;
  number: string;
  roomTypeId: string;
  bedTypeId: string;
  facilityGroupId: string;
  galleryId: string;
}

export interface CreateRoomRes {
  id: string;
  siteCode: string;
  number: string;
  roomTypeId: string;
  bedTypeId: string;
  facilityGroupId: string;
  createdAt: string;
  updatedAt: string;
}