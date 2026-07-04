import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default async function AllListingsPage() {
  const session = await auth()
  if (!session || !session.user?.isAdmin) redirect("/")

  const { data: listings } = await supabase
    .from("Listing")
    .select("*, owner:User(phone, username)")
    .order("createdAt", { ascending: false })

  return (
    <div className="dashboard">
      <h1 style={{ fontSize: "2em", marginBottom: 20 }}>📋 Toutes les annonces</h1>
      <div className="listings-table">
        {listings && listings.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Titre</th><th>Propriétaire</th><th>Prix</th><th>Ville</th><th>Statut</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l: any) => (
                <tr key={l.id}>
                  <td>{l.title?.substring(0, 40)}</td>
                  <td>{l.owner?.phone || "-"}</td>
                  <td>{l.price?.toLocaleString()} FCFA</td>
                  <td>{l.city}</td>
                  <td>
                    <span className={`status-${l.status}`}>
                      {l.status}
                    </span>
                  </td>
                  <td>{new Date(l.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td>
                    <Link href={`/annonce/${l.id}`} className="btn btn-small">Voir</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucune annonce.</p>
        )}
      </div>
    </div>
  )
}
