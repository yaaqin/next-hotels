import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      return account?.provider === "google"
    },

    async jwt({ token, user, account }) {
      console.log("ENV CHECK:", {
        BE_URL: process.env.BE_URL,
        hasClientId: !!process.env.CLIENT_ID,
      })
      // Login pertama
      if (account?.provider === "google" && user) {
        console.log("🔑 JWT login pertama")
        console.log("BE_URL:", process.env.BE_URL)

        try {
          const url = `${process.env.BE_URL}/auth/google`
          console.log("Fetch ke:", url)

          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              googleId: account.providerAccountId,
              email: user.email,
              name: user.name,
              avatarUrl: user.image,
            }),
          })

          console.log("Response status:", res.status)
          const data = await res.json()
          console.log("Response data:", JSON.stringify(data))

          if (!res.ok) throw new Error(`BE login failed: ${res.status}`)

          token.accessToken = data.data.accessToken
          token.refreshToken = data.data.refreshToken
          token.backendUserId = data.data.userId
          token.accessTokenExpiry = Date.now() + 4 * 60 * 1000
          token.error = undefined

          console.log("✅ Token berhasil di-set")
        } catch (err) {
          console.error("❌ BE login gagal:", err)
          token.error = "BackendLoginFailed"
        }
        return token
      }

      // Token masih valid
      if (Date.now() < (token.accessTokenExpiry as number)) {
        return token
      }

      // Access token expired — refresh
      console.log("🔄 Access token expired, mencoba refresh...")
      try {
        const res = await fetch(`${process.env.BE_URL}/auth/user/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: token.refreshToken }),
        })

        const data = await res.json()
        console.log("Refresh response:", res.status, JSON.stringify(data))

        if (!res.ok) throw new Error("Refresh failed")

        console.log("✅ Refresh berhasil")
        return {
          ...token,
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
          accessTokenExpiry: Date.now() + 4 * 60 * 1000,
          error: undefined,
        }
      } catch {
        console.error("❌ Refresh gagal")
        return { ...token, error: "RefreshTokenExpired" }
      }
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      session.backendUserId = token.backendUserId as string
      session.error = token.error as string | undefined
      return session
    },
  },
})

export { handler as GET, handler as POST }