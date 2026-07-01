import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  const { ids } = await request.json()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  if (!ids || ids.length === 0) {
    return Response.json({ listings: [] })
  }

  const { data } = await supabase.from("Listing").select("*, images:ListingImage(*)").in("id", ids).eq("status", "active")

  return Response.json({ listings: data || [] })
}
