import "next-auth"

declare module "next-auth" {
  interface User {
    phone?: string
    isAdmin?: boolean
  }
  interface Session {
    user: {
      id: string
      phone: string
      isAdmin: boolean
      name?: string | null
      email?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    phone: string
    isAdmin: boolean
  }
}
