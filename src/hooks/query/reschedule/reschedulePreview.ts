import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { previewReschedule } from "@/src/services/reschedule/reschedule";
import { reschedulePreviewPayload, reschedulePreviewProps } from "@/src/models/reschedule/preview";

// Dipanggil ulang tiap kamar diganti — harga & selisih selalu dihitung BE
export const useReschedulePreview = (payload: reschedulePreviewPayload) => {
    const { bookingId, newCheckIn, newCheckOut, preferredRoomId } = payload;
    const { data, isLoading, isFetching, error } = useQuery<reschedulePreviewProps>({
        queryKey: ["reschedule-preview", bookingId, newCheckIn, newCheckOut, preferredRoomId ?? null],
        queryFn: () => previewReschedule(payload),
        enabled: !!bookingId && !!newCheckIn && !!newCheckOut,
        placeholderData: keepPreviousData,
        retry: false,
    });

    return { data, isLoading, isFetching, error };
};
