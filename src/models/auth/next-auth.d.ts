import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface User {
    accessToken?: string
    refreshToken?: string
    backendUserId?: string
  }
  interface Session {
    accessToken?: string
    refreshToken?: string
    backendUserId?: string
    error?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    backendUserId?: string
    accessTokenExpiry?: number
    error?: string
  }
}