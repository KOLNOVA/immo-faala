import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { redirect } from "next/navigation"
import DashboardChart from "@/components/DashboardChart"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/compte/connexion")

  const { data: listings } = await supabase
    .from("Listing")
    .select("*")
    .eq("ownerId", session.user.id)
    .order("createdAt", { ascending: false })

  const { data: user } = await supabase
    .from("User")
    .select("*")
    .eq("id", session.user.id)
    .single()

  const activeCount = listings?.filter((l: any) => l.status === "active").length || 0
  const pendingCount = listings?.filter((l: any) => l.status === "pending").length || 0
  const totalViews = listings?.reduce((sum: number, l: any) => sum + (l.viewsCount || 0), 0) || 0
  const maxViews = Math.max(...(listings?.map((l: any) => l.viewsCount || 0) || [1]), 1)

  return (
    <div className="dashboard">
      <h1>Mon Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card"><h3>{listings?.length || 0}</h3><p>Total annonces</p></div>
        <div className="stat-card"><h3>{activeCount}</h3><p>Actives</p></div>
        <div className="stat-card"><h3>{pendingCount}</h3><p>En attente</p></div>
        <div className="stat-card"><h3>{totalViews}</h3><p>Vues totales</p></div>
      </div>

      {listings && listings.length > 0 && (
        <DashboardChart listings={listings} maxViews={maxViews} />
      )}

      <div className="account-actions" style={{ marginBottom: 30, display: "flex", gap: 15, flexWrap: "wrap" }}>
        {!user?.isPremium ? (
          <>
            <Link href="/paiement/badge-verifie" className="btn btn-secondary">🏅 Badge Premium (500 FCFA)</Link>
            <Link href="/paiement/upload-documents" className="btn btn-secondary">📎 Envoyer mes documents</Link>
          </>
        ) : (
          <span className="btn btn-success" style={{ cursor: "default", background: "#27ae60", color: "white" }}>🏅 Premium</span>
        )}
        <Link href="/compte/profil" className="btn btn-secondary">👤 Modifier mon profil</Link>
        <Link href="/publier" className="btn btn-primary">Publier une annonce</Link>
      </div>

      <div className="listings-table">
        <h2>Mes annonces</h2>
        {listings && listings.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Titre</th><th>Prix</th><th>Ville</th><th>Vues</th><th>Statut</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing: any) => (
                <tr key={listing.id}>
                  <td>{listing.title?.length > 30 ? listing.title.substring(0, 30) + "..." : listing.title}</td>
                  <td>{listing.price?.toLocaleString()} FCFA</td>
                  <td>{listing.city}</td>
                  <td>👁 {listing.viewsCount || 0}</td>
                  <td>
                    <span className={`status-${listing.status}`}>
                      {listing.status === "active" ? "Active" : listing.status === "pending" ? "En attente" : listing.status === "rejected" ? "Rejetée" : "Expirée"}
                    </span>
                  </td>
                  <td>{new Date(listing.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td>
                    {listing.status === "pending" ? (
                      <Link href={`/activer/${listing.id}`} className="btn btn-small btn-success">Activer</Link>
                    ) : (
                      <Link href={`/annonce/${listing.id}`} className="btn btn-small">Voir</Link>
                    )}
                    {listing.status === "active" && (
                      <Link href={`/booster/${listing.id}`} className="btn btn-small btn-primary">🚀</Link>
                    )}
                    <Link href={`/modifier/${listing.id}`} className="btn btn-small">Modifier</Link>
                    <Link href={`/supprimer/${listing.id}`} className="btn btn-small btn-danger">Suppr.</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Vous n&apos;avez pas encore d&apos;annonces.</p>
        )}
      </div>
    </div>
  );
}
