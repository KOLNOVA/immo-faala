import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  const body = await request.json()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { data: listing, error } = await supabase.from("Listing").insert({
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
    ownerId: body.userId,
    status: "pending",
  }).select("id").single()

  if (error) return Response.json({ error: error.message }, { status: 500 })

  // Enregistrer les images
  if (body.images && body.images.length > 0) {
    const imageRecords = body.images.map((url: string) => ({
      url,
      listingId: listing.id,
    }))
    await supabase.from("ListingImage").insert(imageRecords)
  }

  return Response.json({ success: true, id: listing.id })
}
