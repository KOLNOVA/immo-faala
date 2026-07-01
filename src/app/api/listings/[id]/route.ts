import { createClient } from "@supabase/supabase-js"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const body = await request.json()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { error } = await supabase.from("Listing").update({
    title: body.title,
    description: body.description,
    price: body.price,
    propertyType: body.propertyType,
    city: body.city,
    district: body.district,
    rooms: body.rooms,
    furnished: body.furnished,
    caution: body.caution,
    advance: body.advance,
    availableDate: body.availableDate,
    latitude: body.latitude,
    longitude: body.longitude,
  }).eq("id", (await params).id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { error } = await supabase.from("Listing").delete().eq("id", (await params).id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}

// Ajouter dans la fonction POST de report (signalement)
// Envoyer une notification à l'admin
// await sendAdminNotification("Nouveau signalement", `L'annonce ${listingId} a été signalée`)
