import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  const { type, id, action } = await request.json()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  if (type === "listing") {
    if (action === "approve") await supabase.from("Listing").update({ status: "active" }).eq("id", id)
    if (action === "reject") await supabase.from("Listing").update({ status: "rejected" }).eq("id", id)
  }

  if (type === "report") {
    if (action === "resolve") await supabase.from("Report").update({ resolved: true }).eq("id", id)
  }

  if (type === "user") {
    if (action === "activate") await supabase.from("User").update({ isActive: true }).eq("id", id)
    if (action === "deactivate") await supabase.from("User").update({ isActive: false }).eq("id", id)
  }

  return Response.json({ success: true })
}
