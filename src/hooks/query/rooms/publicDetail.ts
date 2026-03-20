import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { publicRoomDetailProps } from "@/src/models/public/room/detail";
import { publicRoomDetail } from "@/src/services/rooms/publicDetail";

const addOneDay = (dateStr: string) => {
  const date = new Date(dateStr + "T00:00:00");
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

export const useRoomDetailPublic = (id: string) => {
  const searchParams = useSearchParams();

  const checkin = searchParams.get("checkin");
  const checkoutParam = searchParams.get("checkout");

  const checkout = checkoutParam ?? (checkin ? addOneDay(checkin) : undefined);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<publicRoomDetailProps>({
    queryKey: ["public-room-detail", id, checkin, checkout],
    queryFn: () =>
      publicRoomDetail({
        id,
        checkin: checkin as string,
        // checkout,
      }),
    enabled: !!id && !!checkin, // cuma jalan kalau param valid
  });

  return { data, isLoading, error, refetch };
};