import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  const { phone } = await request.json()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { data: user } = await supabase.from("User").select("email, isActive").eq("phone", phone).single()

  if (!user) {
    return Response.json({ message: "Aucun compte trouvé avec ce numéro." })
  }

  if (!user.isActive) {
    return Response.json({ message: "Ce compte n'est pas actif." })
  }

  return Response.json({ message: "✅ Si ce numéro existe, un code a été envoyé par email." })
}
