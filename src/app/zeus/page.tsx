import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase"
import AdminActions from "@/components/AdminActions"
import Link from "next/link"

export default async function AdminPage() {
  const session = await auth()
  
  if (!session || !session.user?.isAdmin) redirect("/")

  const { data: adminUser } = await supabase.from("User").select("isActive").eq("id", session.user.id).single()
  if (!adminUser?.isActive) redirect("/")

  const { count: totalUsers } = await supabase.from("User").select("*", { count: "exact", head: true })
  const { count: totalListings } = await supabase.from("Listing").select("*", { count: "exact", head: true })
  const { count: activeListings } = await supabase.from("Listing").select("*", { count: "exact", head: true }).eq("status", "active")
  const { count: pendingListings } = await supabase.from("Listing").select("*", { count: "exact", head: true }).eq("status", "pending")
  const { count: reports } = await supabase.from("Report").select("*", { count: "exact", head: true }).eq("resolved", false)

  const { data: pendingListingsData } = await supabase.from("Listing").select("*, owner:User(phone, username)").eq("status", "pending").order("createdAt", { ascending: false }).limit(20)
  const { data: reportsData } = await supabase.from("Report").select("*, listing:Listing(title)").eq("resolved", false).order("createdAt", { ascending: false }).limit(20)
  const { data: users } = await supabase.from("User").select("*").order("createdAt", { ascending: false }).limit(10)

  return (
    <div className="dashboard">
      <h1 style={{ fontSize: "2em", marginBottom: 20 }}>🛡️ Administration Immo-Faala</h1>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
        <div className="stat-card"><h3>{totalUsers || 0}</h3><p>Utilisateurs</p></div>
        <div className="stat-card"><h3>{totalListings || 0}</h3><p>Annonces</p></div>
        <div className="stat-card"><h3>{activeListings || 0}</h3><p>Actives</p></div>
        <div className="stat-card"><h3 style={{ color: "#f39c12" }}>{pendingListings || 0}</h3><p>En attente</p></div>
        <div className="stat-card"><h3 style={{ color: "#e74c3c" }}>{reports || 0}</h3><p>Signalements</p></div>
      </div>

      <div className="listings-table" style={{ marginTop: 30 }}>
        <h2>📋 Annonces en attente ({pendingListings || 0})</h2>
        {pendingListingsData && pendingListingsData.length > 0 ? (
          <table>
            <thead><tr><th>Titre</th><th>Propriétaire</th><th>Prix</th><th>Ville</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {pendingListingsData.map((l: any) => (
                <tr key={l.id}>
                  <td>{l.title?.substring(0, 30)}</td>
                  <td>{l.owner?.phone}</td>
                  <td>{l.price?.toLocaleString()} FCFA</td>
                  <td>{l.city}</td>
                  <td>{new Date(l.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td>
                    <AdminActions type="listing" id={l.id} action="approve" label="✅ Valider" />
                    <AdminActions type="listing" id={l.id} action="reject" label="❌ Rejeter" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ padding: 20, color: "#999" }}>Aucune annonce en attente.</p>
        )}
      </div>

      <div className="listings-table" style={{ marginTop: 30 }}>
        <h2><Link href="/zeus/annonces" style={{ color: "#1a2a3a", textDecoration: "none" }}>📋 Toutes les annonces →</Link></h2>
        <table>
          <thead><tr><th>Titre</th><th>Propriétaire</th><th>Prix</th><th>Ville</th><th>Statut</th><th>Date</th></tr></thead>
          <tbody>
            {/* Ici on peut afficher les 10 dernières comme avant, ou un résumé */}
            {pendingListingsData && pendingListingsData.length > 0 ? (
              pendingListingsData.slice(0,5).map((l: any) => (
                <tr key={l.id}>
                  <td>{l.title?.substring(0, 30)}</td>
                  <td>{l.owner?.phone}</td>
                  <td>{l.price?.toLocaleString()} FCFA</td>
                  <td>{l.city}</td>
                  <td><span className={`status-${l.status}`}>{l.status}</span></td>
                  <td>{new Date(l.createdAt).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6}>Aucune annonce</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="listings-table" style={{ marginTop: 30 }}>
        <h2>🚨 Signalements non résolus ({reports || 0})</h2>
        {reportsData && reportsData.length > 0 ? (
          <table>
            <thead><tr><th>Annonce</th><th>Motif</th><th>Commentaire</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {reportsData.map((r: any) => (
                <tr key={r.id}>
                  <td>{r.listing?.title?.substring(0, 30) || "-"}</td>
                  <td>{r.reason}</td>
                  <td>{r.comment?.substring(0, 50) || "-"}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td>
                    <AdminActions type="report" id={r.id} action="resolve" label="✅ Résoudre" />
                    <AdminActions type="listing" id={r.listingId} action="reject" label="❌ Supprimer l'annonce" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ padding: 20, color: "#999" }}>Aucun signalement en attente.</p>
        )}
      </div>

      <div className="listings-table" style={{ marginTop: 30 }}>
        <h2>👥 Derniers utilisateurs</h2>
        <table>
          <thead><tr><th>Téléphone</th><th>Nom</th><th>Email</th><th>Actif</th><th>Premium</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {users?.map((u: any) => (
              <tr key={u.id}>
                <td>{u.phone}</td>
                <td>{u.displayName || u.username || "-"}</td>
                <td>{u.email || "-"}</td>
                <td>{u.isActive ? "✅" : "❌"}</td>
                <td>{u.isPremium ? "💎" : "-"}</td>
                <td>{new Date(u.createdAt).toLocaleDateString("fr-FR")}</td>
                <td>
                  {u.phone !== "+22900000000" && (
                    <>
                      {!u.isActive && <AdminActions type="user" id={u.id} action="activate" label="✅ Activer" />}
                      {u.isActive && <AdminActions type="user" id={u.id} action="deactivate" label="❌ Désactiver" />}
                    </>
                  )}
                  {u.phone === "+22900000000" && <span style={{ color: "#999" }}>🔒 Protégé</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
