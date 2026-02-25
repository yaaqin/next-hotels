import { axiosPrivate } from "@/src/libs/instance";

export const uploadImages = async (files: File[]) => {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append("files", file);
  });

  const { data } = await axiosPrivate.post("/images/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};