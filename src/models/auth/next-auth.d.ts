import "next-auth"

declare module "next-auth" {
  interface User {
    backendToken?: string
    backendUserId?: string
  }
  interface Session {
    backendToken?: string
    backendUserId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string
    backendUserId?: string
  }
}