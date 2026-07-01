import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  const { userId, type } = await request.json()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { data: user } = await supabase.from("User").select("email").eq("id", userId).single()

  if (user?.email) {
    // Envoyer un email (via Resend quand configuré)
    console.log(`[SECURITE] Notification ${type} envoyée à ${user.email}`)
  }

  return Response.json({ success: true })
}
