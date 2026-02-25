import { uploadImages } from '@/src/services/images/upload';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useUploadImages = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (files: File[]) => uploadImages(files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images-list"] });
      router.push("/dashboard/image");
    },
    onError: (error) => {
      console.error(error instanceof Error ? error.message : "Upload gagal");
    },
  });
};