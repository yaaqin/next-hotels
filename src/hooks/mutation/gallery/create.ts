import { createGallery, CreateGalleryPayload } from "@/src/services/galleries/create";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useCreateGallery = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: CreateGalleryPayload) => createGallery(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleries-list"] });
      router.push("/dashboard/gallery");
    },
    onError: (error) => {
      console.error(error instanceof Error ? error.message : "Gagal membuat gallery");
    },
  });
};