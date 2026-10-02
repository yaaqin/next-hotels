import { useQuery } from "@tanstack/react-query";
import {
  priceAdjustmentCalendar,
  priceAdjustmentDetail,
  priceAdjustmentList,
  priceAdjustmentOptions,
} from "@/src/services/priceAdjustment";
import { priceCalendarQuery } from "@/src/models/priceAdjustment";

export const usePriceAdjustmentList = (status?: string) =>
  useQuery({
    queryKey: ["price-adjustment-list", status],
    queryFn: () => priceAdjustmentList(status),
  });

export const usePriceAdjustmentDetail = (id: string) =>
  useQuery({
    queryKey: ["price-adjustment-detail", id],
    queryFn: () => priceAdjustmentDetail(id),
    enabled: !!id,
  });

// siteCode kosong untuk akun cabang (BE pakai cabangnya sendiri)
export const usePriceAdjustmentOptions = (siteCode: string | undefined, enabled = true) =>
  useQuery({
    queryKey: ["price-adjustment-options", siteCode],
    queryFn: () => priceAdjustmentOptions(siteCode),
    enabled,
    retry: false,
  });

export const usePriceCalendar = (query: priceCalendarQuery, enabled = true) =>
  useQuery({
    queryKey: ["price-adjustment-calendar", query],
    queryFn: () => priceAdjustmentCalendar(query),
    enabled: enabled && !!query.start && !!query.end,
    retry: false,
  });
