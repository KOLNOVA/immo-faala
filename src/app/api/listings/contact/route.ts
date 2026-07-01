import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  const { listingId } = await request.json()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { data } = await supabase.from("Listing").select("contactsCount").eq("id", listingId).single()
  const newCount = (data?.contactsCount || 0) + 1
  await supabase.from("Listing").update({ contactsCount: newCount }).eq("id", listingId)

  return Response.json({ success: true })
}
