import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import MobileMenu from "@/components/MobileMenu";

export default async function Navbar() {
  let session = null;
  try {
    session = await auth();
  } catch (e) {}

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
          {session ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              {session.user?.isAdmin && (
                <Link href="/zeus" style={{ fontSize: "0.01em", color: "transparent", position: "absolute", left: "-9999px" }}>
                  Admin
                </Link>
              )}
              <form action={async () => { "use server"; await signOut({ redirectTo: "/" }) }}>
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
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}
