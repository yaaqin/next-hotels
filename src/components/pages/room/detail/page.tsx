'use client'
import Loading from '@/src/components/organisms/loading';
import { useRoomDetail } from '@/src/hooks/query/rooms/detail'
import { useParams } from 'next/navigation';
export default function DetailRoomPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, isLoading } = useRoomDetail(id)
  const room = data?.data

  if (isLoading) return <Loading />
  if (!room) return <div className="text-center py-24 text-gray-400">Room not found</div>

  return (
    <div className="w-full mx-auto space-y-6 p-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">
            {room.site.nama} · Floor {room.floorId}
          </p>
          <h1 className="text-3xl font-semibold text-gray-900">
            Room {room.number}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{room.id}</p>
        </div>
        <span className="px-3 py-1 text-xs font-medium tracking-widest uppercase bg-gray-100 text-gray-600 rounded-full">
          {room.siteCode}
        </span>
      </div>

      <hr className="border-gray-100" />

      {/* Room Type & Bed Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-100 rounded-2xl p-5 space-y-1">
          <p className="text-xs tracking-widest uppercase text-gray-400">Room Type</p>
          <p className="text-lg font-semibold text-gray-800">
            {room.roomType.translation.name}
          </p>
          <p className="text-sm text-gray-500">{room.roomType.translation.desk}</p>
        </div>

        <div className="border border-gray-100 rounded-2xl p-5 space-y-1">
          <p className="text-xs tracking-widest uppercase text-gray-400">Bed Type</p>
          <p className="text-lg font-semibold text-gray-800">
            {room.bedType.translation.name}
          </p>
          <p className="text-sm text-gray-500">
            {room.bedType.translation.size} · {room.bedType.translation.description}
          </p>
        </div>
      </div>

      {/* Site Info */}
      <div className="border border-gray-100 rounded-2xl p-5">
        <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">Site</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Name</p>
            <p className="font-medium text-gray-800">{room.site.nama}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Location</p>
            <p className="font-medium text-gray-800">{room.site.lokasi}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Site Code</p>
            <p className="font-medium text-gray-800">{room.site.sitecode}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Status</p>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${room.site.isActive
                ? 'bg-green-50 text-green-600'
                : 'bg-red-50 text-red-500'
              }`}>
              {room.site.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Facilities */}
      <div className="border border-gray-100 rounded-2xl p-5">
        <p className="text-xs tracking-widest uppercase text-gray-400 mb-4">
          Facilities · {room.facilityGroup.code}
        </p>
        {room.facilityGroup.note && (
          <p className="text-sm text-gray-500 mb-4">{room.facilityGroup.note}</p>
        )}
        <div className="space-y-4">
          {room.facilityGroup.facilities.map((facility) => (
            <div key={facility.type.id}>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                {facility.type.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {facility.items.map((item) => (
                  <span
                    key={item.id}
                    className="px-3 py-1 text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-full"
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meta */}
      <div className="text-xs text-gray-400 flex gap-6">
        <span>Created by <span className="text-gray-600">{room.createdBy}</span></span>
        <span>Created at <span className="text-gray-600">{new Date(room.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span></span>
      </div>

    </div>
  )
}
