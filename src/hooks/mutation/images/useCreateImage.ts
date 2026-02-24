import { uploadImages } from '@/src/services/images/upload';
import { useMutation } from '@tanstack/react-query';

export const useUploadImages = () => {
  return useMutation({
    mutationFn: (files: File[]) => uploadImages(files),
  });
};