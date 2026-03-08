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
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              googleId: account.providerAccountId,
              email: user.email,
              name: user.name,
              avatarUrl: user.image,
            }),
          })

          const data = await res.json()
          if (!res.ok) return false

          // Tempel ke user object — akan diterusin ke jwt callback
          user.backendToken = data.data.token
          user.backendUserId = data.data.userId
        } catch (err) {
          console.error("❌ Fetch ke BE gagal:", err)
          return false
        }
      }
      return true
    },

    // ← Ini yang kurang — simpan token dari user ke JWT
    async jwt({ token, user }) {
      if (user?.backendToken) {
        token.backendToken = user.backendToken
        token.backendUserId = user.backendUserId
      }
      return token
    },

    // ← Ini yang kurang — expose ke session supaya bisa diakses di FE
    async session({ session, token }) {
      session.backendToken = token.backendToken as string
      session.backendUserId = token.backendUserId as string
      return session
    },
  },
})

export { handler as GET, handler as POST }