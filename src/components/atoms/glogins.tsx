"use client"

import { signIn } from "next-auth/react"

export default function LoginGoogleButton() {
  return (
    <button
      onClick={() => signIn("google")}
      className="px-4 py-2 bg-black text-white rounded-xl"
    >
      Login with Google
    </button>
  )
}