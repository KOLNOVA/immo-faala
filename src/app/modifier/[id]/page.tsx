import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"
import EditForm from "@/components/EditForm"

export default async function EditPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) redirect("/compte/connexion")

  const { data: listing } = await supabase.from("Listing").select("*").eq("id", params.id).single()
  if (!listing || listing.ownerId !== session.user.id) redirect("/dashboard")

  return (
    <div className="form-container" style={{ maxWidth: 700 }}>
      <h1>Modifier l&apos;annonce</h1>
      <EditForm listing={listing} />
    </div>
  )
}
