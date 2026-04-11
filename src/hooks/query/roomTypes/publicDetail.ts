import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { publicRoomTypeDetailProps } from "@/src/models/public/roomTypeDetail/publicRoomTypeDetail";
import { publicRoomTypeDetail } from "@/src/services/roomTypes/publicDetail";

const addOneDay = (dateStr: string) => {
  const date = new Date(dateStr + "T00:00:00");
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

export const useRoomTypeDetailPublic = (id: string) => {
  const searchParams = useSearchParams();

  const checkin = searchParams.get("checkIn");
  const checkoutParam = searchParams.get("checkOut");

  const checkout = checkoutParam ?? (checkin ? addOneDay(checkin) : undefined);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<publicRoomTypeDetailProps>({
    queryKey: ["public-room-type-detail", id, checkin, checkout],
    queryFn: () =>
      publicRoomTypeDetail({
        id,
        checkin: checkin as string,
        checkout: checkout as string,
      }),
    enabled: !!id && !!checkin, // cuma jalan kalau param valid
  });

  return { data, isLoading, error, refetch };
};