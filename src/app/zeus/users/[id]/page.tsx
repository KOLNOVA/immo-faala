import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AdminUserProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session || !session.user?.isAdmin) redirect("/")

  const { data: user } = await supabase.from("User").select("*").eq("id", id).single()
  if (!user) return <p>Utilisateur introuvable.</p>

  // Récupérer ses annonces
  const { data: listings } = await supabase.from("Listing").select("id, title, status, createdAt").eq("ownerId", id).order("createdAt", { ascending: false })

  return (
    <div className="dashboard">
      <h1>Profil de {user.displayName || user.username || user.phone}</h1>
      <div className="listing-form" style={{ marginTop: 20 }}>
        <p><strong>Téléphone :</strong> {user.phone}</p>
        <p><strong>Email :</strong> {user.email || "-"}</p>
        <p><strong>Nom public :</strong> {user.displayName || "-"}</p>
        <p><strong>Bio :</strong> {user.bio || "-"}</p>
        <p><strong>Premium :</strong> {user.isPremium ? "Oui" : "Non"}</p>
        <p><strong>Actif :</strong> {user.isActive ? "Oui" : "Non"}</p>
        <p><strong>Inscrit le :</strong> {new Date(user.createdAt).toLocaleDateString("fr-FR")}</p>
        {user.expiresAt && <p><strong>Expire le :</strong> {new Date(user.expiresAt).toLocaleDateString("fr-FR")}</p>}
      </div>

      <h2 style={{ marginTop: 30 }}>Annonces de cet utilisateur</h2>
      {listings && listings.length > 0 ? (
        <table>
          <thead><tr><th>Titre</th><th>Statut</th><th>Date</th></tr></thead>
          <tbody>
            {listings.map((l: any) => (
              <tr key={l.id}>
                <td><Link href={`/annonce/${l.id}`}>{l.title?.substring(0, 40)}</Link></td>
                <td>{l.status}</td>
                <td>{new Date(l.createdAt).toLocaleDateString("fr-FR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucune annonce.</p>
      )}

      <p style={{ marginTop: 20 }}><Link href="/zeus">← Retour à l'administration</Link></p>
    </div>
  )
}
