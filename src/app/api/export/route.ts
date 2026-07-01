import { auth } from "@/lib/auth"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: "Non connecté" }, { status: 401 })

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { data: listings } = await supabase
    .from("Listing")
    .select("*")
    .eq("ownerId", session.user.id)
    .order("createdAt", { ascending: false })

  if (!listings || listings.length === 0) {
    return Response.json({ error: "Aucune annonce" }, { status: 404 })
  }

  const headers = ["Titre", "Prix", "Ville", "Quartier", "Type", "Chambres", "Meublé", "Statut", "Vues", "Date"]
  const rows = listings.map((l: any) => [
    l.title,
    l.price,
    l.city,
    l.district,
    l.propertyType,
    l.rooms,
    l.furnished ? "Oui" : "Non",
    l.status,
    l.viewsCount || 0,
    new Date(l.createdAt).toLocaleDateString("fr-FR"),
  ])

  let csv = headers.join(",") + "\n"
  rows.forEach((row: any) => {
    csv += row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(",") + "\n"
  })

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=mes-annonces-immo-faala.csv",
    },
  })
}
