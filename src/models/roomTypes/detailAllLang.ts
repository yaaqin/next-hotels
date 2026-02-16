export interface DetailAllLangProps {
  success: boolean
  message: string
  data: detailAllLangState
}

export interface detailAllLangState {
  id: string
  createdAt: string
  createdBy: string
  translations: TranslationDetailRoomType[]
}

export interface TranslationDetailRoomType {
  id: string
  roomTypeId: string
  lang: string
  name: string
  desk: string
}
