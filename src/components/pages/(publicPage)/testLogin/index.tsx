"use client"

import LogoutButton from "@/src/components/atoms/gLogout"
import Images from "@/src/components/atoms/images"
import { useSession } from "next-auth/react"

export default function UserSession() {
    const { data: session } = useSession()
    if (!session) {
        return <p>Belum login</p>
    }

    return (
        <div className="flex items-center gap-4">
            {session && (
                <>
                    <Images
                        src={session?.user?.image || ''}
                        alt="avatar"
                        height={40}
                        width={40}
                        className="w-32 h-32 rounded-full"
                    />
                    <p>{session.user?.name}</p>
                </>
            )}
            <LogoutButton />
        </div>
    )
}