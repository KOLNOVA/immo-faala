import { createClient } from "@supabase/supabase-js"

export async function GET() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: expired } = await supabase
    .from("Listing")
    .update({ status: "expired" })
    .eq("status", "active")
    .lt("createdAt", thirtyDaysAgo.toISOString())
    .select("id")

  const { data: oldBoosts } = await supabase
    .from("Listing")
    .update({ isBoosted: false })
    .eq("isBoosted", true)
    .lt("boostUntil", new Date().toISOString())
    .select("id")

  return Response.json({
    expired: expired?.length || 0,
    boostsRemoved: oldBoosts?.length || 0,
  })
}
