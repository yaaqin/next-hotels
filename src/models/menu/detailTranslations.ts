export interface detailMenuTranslationsProps {
  success: boolean
  message: string
  data: detailMenuTranslationsState
}

export interface detailMenuTranslationsState {
  id: string
  createdBy: string
  translations: Translation[]
}

export interface Translation {
  lang: string
  name: string
}
