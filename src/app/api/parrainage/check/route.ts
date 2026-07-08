import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  const { parrainId } = await request.json()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  // Compter les filleuls actifs (ayant publié au moins une annonce)
  const { count: filleulsActifs } = await supabase
    .from("User")
    .select("id", { count: "exact", head: true })
    .eq("parrainId", parrainId)
    .filter("id", "in", (await supabase.from("Listing").select("ownerId").eq("status", "active")).data?.map(l => l.ownerId) || [])

  if (filleulsActifs && filleulsActifs >= 8) {
    // Vérifier si le parrain a déjà reçu un boost ce mois-ci (optionnel)
    // Accorder un boost : mettre à jour la prochaine annonce du parrain ou lui donner un crédit
    // Pour simplifier, on booste sa dernière annonce active
    const { data: lastListing } = await supabase
      .from("Listing")
      .select("id")
      .eq("ownerId", parrainId)
      .eq("status", "active")
      .order("createdAt", { ascending: false })
      .limit(1)
      .single()

    if (lastListing) {
      const boostUntil = new Date()
      boostUntil.setDate(boostUntil.getDate() + 7)
      await supabase.from("Listing").update({ isBoosted: true, boostUntil: boostUntil.toISOString() }).eq("id", lastListing.id)
    }

    return Response.json({ success: true, boosted: true })
  }

  return Response.json({ success: true, boosted: false, filleulsCount: filleulsActifs || 0 })
}
