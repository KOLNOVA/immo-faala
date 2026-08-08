import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  const { email, password } = await request.json()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  if (!email || !password || password.length < 8) {
    return Response.json({ error: "Données invalides" }, { status: 400 })
  }

  // Vérifier que l'utilisateur existe
  const { data: user } = await supabase.from("User").select("id").eq("email", email).single()
  if (!user) {
    return Response.json({ error: "Utilisateur introuvable" }, { status: 404 })
  }

  // Hacher le nouveau mot de passe
  const passwordHash = await bcrypt.hash(password, 12)

  // Mettre à jour
  const { error } = await supabase.from("User").update({ passwordHash }).eq("email", email)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ success: true })
}
