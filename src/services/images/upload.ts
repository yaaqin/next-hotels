import { axiosPrivate } from "@/src/libs/instance";

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await axiosPrivate.post('/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};

export const uploadImages = async (files: File[]) => {
  const results = await Promise.allSettled(files.map((file) => uploadImage(file)));

  const successful: unknown[] = [];
  const failed: { file: File; error: string }[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      successful.push(result.value);
    } else {
      failed.push({
        file: files[index],
        error: result.reason instanceof Error ? result.reason.message : 'Upload gagal',
      });
    }
  });

  return { successful, failed };
};