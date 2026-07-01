import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"

const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

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

        // Vérifier les tentatives
        const attempt = loginAttempts.get(credentials.phone as string)
        const now = Date.now()
        if (attempt) {
          if (attempt.count >= 5 && now - attempt.lastAttempt < 15 * 60 * 1000) {
            throw new Error("Trop de tentatives. Réessayez dans 15 minutes.")
          }
          if (now - attempt.lastAttempt > 15 * 60 * 1000) {
            loginAttempts.delete(credentials.phone as string)
          }
        }

        const { data: user } = await supabase
          .from("User")
          .select("*")
          .eq("phone", credentials.phone as string)
          .single()

        if (!user || !user.passwordHash || !user.isActive) {
          const current = loginAttempts.get(credentials.phone as string) || { count: 0, lastAttempt: now }
          loginAttempts.set(credentials.phone as string, { count: current.count + 1, lastAttempt: now })
          return null
        }

        const passwordMatch = await bcrypt.compare(credentials.password as string, user.passwordHash)
        if (!passwordMatch) {
          const current = loginAttempts.get(credentials.phone as string) || { count: 0, lastAttempt: now }
          loginAttempts.set(credentials.phone as string, { count: current.count + 1, lastAttempt: now })
          return null
        }

        loginAttempts.delete(credentials.phone as string)

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
  session: { strategy: "jwt", maxAge: 30 * 60 },
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
