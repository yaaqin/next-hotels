"use client"

import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
    >
      Logout
    </button>
  )
}