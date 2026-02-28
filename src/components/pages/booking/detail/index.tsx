'use client'
import InfoCard from "@/src/components/molecules/cards/infoCard";
import { useBookingDetail } from "@/src/hooks/query/bookings/detail"
import { formatDateTime } from "@/src/utils";
import { useParams } from "next/navigation";

export default function BookingDetailPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;

    const { data } = useBookingDetail(id)
    return (
        <section className="bg-white p-2 px-4 rounded-full grid grid-cols-4">
            <InfoCard Label={"Nama"} value={data?.data.contact.fullName} className="grid col-span-1"/>
            <InfoCard Label={"CheckIn"} value={formatDateTime(data?.data.checkInDate)} className="grid col-span-1"/>
            <InfoCard Label={"CheckOut"} value={formatDateTime(data?.data.checkOutDate)} className="grid col-span-1"/>
            <InfoCard Label={"Room"} value={data?.data.items[0].roomId} className="grid col-span-1"/>
            <InfoCard Label={"Harga"} value={data?.data.items[0].subtotal.toLocaleString()} className="grid col-span-1"/>
            <InfoCard Label={"Waktu Pesan"} value={formatDateTime(data?.data.createdAt)} className="grid col-span-1"/>
            <InfoCard Label={"Status"} value={data?.data.status} className="grid col-span-1"/>
        </section>
    )
}
