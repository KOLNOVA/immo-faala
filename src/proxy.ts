import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdmin = req.auth?.user?.isAdmin || false
  const path = req.nextUrl.pathname

  // Protéger le dashboard
  if (path.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/compte/connexion", req.url))
  }

  // Protéger l'admin - vérification stricte
  if (path.startsWith("/zeus")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/compte/connexion", req.url))
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*", "/zeus/:path*"],
}
