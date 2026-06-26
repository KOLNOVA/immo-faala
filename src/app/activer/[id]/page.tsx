import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"

export default async function ActivatePage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) redirect("/compte/connexion")

  const { data: listing } = await supabase.from("Listing").select("*").eq("id", params.id).single()
  if (!listing || listing.ownerId !== session.user.id || listing.status !== "pending") redirect("/dashboard")

  await supabase.from("Listing").update({ status: "active" }).eq("id", params.id)
  redirect("/dashboard")
}
