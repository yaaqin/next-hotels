export interface galleryListProps {
  success: boolean
  message: string
  data: galleryListState[]
}

export interface galleryListState {
  id: string
  title: string
  imageIds: string[]
  createdAt: string
  creator: Creator
  images: Image[]
}

export interface Creator {
  id: string
  username: string
}

export interface Image {
  id: string
  url: string
  name: string
}
