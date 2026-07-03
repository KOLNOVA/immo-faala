import { auth } from "@/lib/auth"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: "Non connecté" }, { status: 401 })

  const { oldPassword, newPassword } = await request.json()

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  // Récupérer l'utilisateur
  const { data: user } = await supabase.from("User").select("passwordHash").eq("id", session.user.id).single()

  if (!user || !user.passwordHash) {
    return Response.json({ error: "Utilisateur introuvable" }, { status: 404 })
  }

  // Vérifier l'ancien mot de passe
  const match = await bcrypt.compare(oldPassword, user.passwordHash)
  if (!match) {
    return Response.json({ error: "Ancien mot de passe incorrect" }, { status: 400 })
  }

  // Hacher le nouveau
  const newHash = await bcrypt.hash(newPassword, 12)

  // Mettre à jour
  await supabase.from("User").update({ passwordHash: newHash }).eq("id", session.user.id)

  return Response.json({ success: true })
}
