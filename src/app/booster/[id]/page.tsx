import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"
import BoostButton from "@/components/BoostButton"

export default async function BoostPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) redirect("/compte/connexion")

  const { data: listing } = await supabase.from("Listing").select("*").eq("id", params.id).single()
  if (!listing || listing.ownerId !== session.user.id || listing.status !== "active") redirect("/dashboard")

  return (
    <div className="form-container" style={{ maxWidth: 500 }}>
      <h1>🚀 Booster mon annonce</h1>
      <div className="listing-form" style={{ textAlign: "center" }}>
        <p><strong>{listing.title}</strong></p>
        <p style={{ fontSize: "1.2em", margin: "20px 0" }}>
          Boost : <strong>1000 FCFA</strong> pour 7 jours en première ligne
        </p>
        <p style={{ marginBottom: 20 }}>
          ✅ Apparaissez en tête des résultats<br />
          ✅ Plus de visibilité<br />
          ✅ Plus de contacts
        </p>
        <BoostButton listingId={listing.id} />
        <p style={{ marginTop: 15 }}>
          <a href="/dashboard">Retour au dashboard</a>
        </p>
      </div>
    </div>
  )
}
