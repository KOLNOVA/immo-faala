import { createClient } from "@supabase/supabase-js"
import { sendExpiryReminder } from "@/services/account-expiry"

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const now = new Date()
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const { data: users } = await supabase
    .from("User")
    .select("email, displayName")
    .eq("isActive", true)
    .gte("expiresAt", now.toISOString())
    .lte("expiresAt", in7Days.toISOString())

  if (users) {
    for (const user of users) {
      if (user.email) {
        try {
          await sendExpiryReminder(user.email, user.displayName)
        } catch (e) {
          console.error("Erreur envoi rappel", e)
        }
      }
    }
  }

  return Response.json({ success: true, reminded: users?.length || 0 })
}
