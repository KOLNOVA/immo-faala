import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        phone: { label: "Téléphone", type: "text" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) return null

        const { data: user } = await supabase
          .from("User")
          .select("*")
          .eq("phone", credentials.phone as string)
          .single()

        if (!user || !user.passwordHash || !user.isActive) return null

        const passwordMatch = await bcrypt.compare(credentials.password as string, user.passwordHash)
        if (!passwordMatch) return null

        return {
          id: user.id,
          phone: user.phone,
          email: user.email,
          name: user.displayName || user.username,
          isAdmin: user.phone === "+22900000000",
        }
      }
    })
  ],
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  pages: { signIn: "/compte/connexion" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.phone = user.phone
        token.isAdmin = user.phone === "+22900000000"
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.phone = token.phone as string
        session.user.isAdmin = token.isAdmin as boolean
      }
      return session
    }
  }
})
