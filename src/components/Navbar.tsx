import Link from "next/link";
import { cookies } from "next/headers";

export default async function Navbar() {
  // Vérifier si un cookie de session existe avant d'appeler auth()
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("authjs.session-token") || cookieStore.get("__Secure-authjs.session-token");
  
  let session = null;
  
  if (sessionCookie) {
    // Importer dynamiquement pour éviter l'erreur si pas de cookie
    const { auth } = await import("@/lib/auth");
    try {
      session = await auth();
    } catch (e) {
      // Cookie invalide - sera nettoyé naturellement
    }
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="logo-container">
          <img src="/images/logo-icon.jpg" alt="Immo-Faala" className="logo-icon" />
          <div className="logo-text">
            <div className="logo-title">Immo-<span>Faala</span></div>
            <div className="logo-subtitle">TROUVEZ. LOUEZ. VENDEZ. EN TOUTE SIMPLICITÉ.</div>
          </div>
        </Link>
        <div className="nav-links">
          <Link href="/recherche">Rechercher</Link>
          <Link href="/villes">Villes</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/favoris">❤️ Favoris</Link>
          <Link href="/carte">🗺️ Carte</Link>
          {session ? (
            <>
              <Link href="/dashboard">Mon Dashboard</Link>
              {session.user?.isAdmin && (
                <Link href="/zeus" style={{ fontSize: "0.01em", color: "transparent", position: "absolute", left: "-9999px" }}>
                  Admin
                </Link>
              )}
              <form action={async () => { 
                "use server"; 
                const { signOut } = await import("@/lib/auth");
                await signOut({ redirectTo: "/" }); 
              }}>
                <button type="submit" style={{ background: "none", border: "none", color: "#a8c8e8", cursor: "pointer", fontSize: "0.95em" }}>
                  Déconnexion
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/compte/connexion">Connexion</Link>
              <Link href="/compte/inscription">S&apos;inscrire</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
