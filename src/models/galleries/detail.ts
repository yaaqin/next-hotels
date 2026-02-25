export interface detailGalleryProps {
  success: boolean
  message: string
  data: detailGalleryState
}

export interface detailGalleryState {
  id: string
  title: string
  createdAt: string
  createdBy: string
  images: Image[]
}

export interface Image {
  id: string
  url: string
  name: string
}
