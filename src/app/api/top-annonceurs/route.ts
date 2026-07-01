import { createClient } from "@supabase/supabase-js"

export async function GET() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  // Top annonceurs : ceux avec le plus d'annonces actives
  const { data } = await supabase
    .from("Listing")
    .select("owner:User(id, displayName, username, phone, profilePicture, isPremium)")
    .eq("status", "active")
    .limit(50)

  // Compter les annonces par utilisateur
  const counts: Record<string, { user: any; count: number }> = {}
  data?.forEach((l: any) => {
    if (l.owner) {
      const key = l.owner.id
      if (!counts[key]) counts[key] = { user: l.owner, count: 0 }
      counts[key].count++
    }
  })

  const top10 = Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return Response.json({ topAnnonceurs: top10 })
}
