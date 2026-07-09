import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  const { type, id, action } = await request.json()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  if (type === "user") {
    const { data: user } = await supabase.from("User").select("phone").eq("id", id).single()
    if (user?.phone === "+22900000000") {
      return Response.json({ error: "Le compte admin ne peut pas être modifié" }, { status: 403 })
    }
    if (action === "activate") await supabase.from("User").update({ isActive: true }).eq("id", id)
    if (action === "deactivate") await supabase.from("User").update({ isActive: false }).eq("id", id)
  }

  if (type === "listing") {
    if (action === "approve") await supabase.from("Listing").update({ status: "active" }).eq("id", id)
    if (action === "reject") await supabase.from("Listing").update({ status: "rejected" }).eq("id", id)
    // Nouvelle action : supprimer définitivement
    if (action === "delete") {
      // D'abord supprimer les images associées
      await supabase.from("ListingImage").delete().eq("listingId", id)
      // Puis les signalements
      await supabase.from("Report").delete().eq("listingId", id)
      // Enfin l'annonce
      await supabase.from("Listing").delete().eq("id", id)
    }
  }

  if (type === "report") {
    if (action === "resolve") await supabase.from("Report").update({ resolved: true }).eq("id", id)
  }

  return Response.json({ success: true })
}
