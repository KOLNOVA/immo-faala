import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"
import DeleteButton from "@/components/DeleteButton"

export default async function DeletePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session) redirect("/compte/connexion")

  const { data: listing } = await supabase.from("Listing").select("*").eq("id", id).single()
  if (!listing || listing.ownerId !== session.user.id) redirect("/dashboard")

  return (
    <div className="confirm-box" style={{ maxWidth: 500, margin: "100px auto", textAlign: "center", background: "white", padding: 40, borderRadius: 12, boxShadow: "0 2px 15px rgba(0,0,0,0.1)" }}>
      <h1>Confirmer la suppression</h1>
      <p>Voulez-vous vraiment supprimer l&apos;annonce :</p>
      <p><strong>{listing.title}</strong> ?</p>
      <p>Cette action est irréversible.</p>
      <DeleteButton listingId={listing.id} />
    </div>
  )
}
