export type Lang = "idn" | "eng" | "jpn" | "chn";

export interface MultiTranslationPayload {
  translations: {
    lang: Lang;
    name: string;
    desk: string;
  }[];
}

export interface MultiTranslationResponse {
  message: string;
  data: any; // atau spesifikin kalau backend sudah fix
}
