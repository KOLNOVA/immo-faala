import { createClient } from "@supabase/supabase-js"

export async function GET() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { data } = await supabase
    .from("Listing")
    .select("id, title, price, city, district, latitude, longitude, propertyType, images:ListingImage(url)")
    .eq("status", "active")
    .not("latitude", "is", null)
    .not("longitude", "is", null)

  return Response.json({ listings: data || [] })
}
