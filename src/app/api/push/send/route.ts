import { createClient } from "@supabase/supabase-js"
import webpush from "web-push"

webpush.setVapidDetails(
  "mailto:contact@immofaala.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function POST(request: Request) {
  const { title, body, url } = await request.json()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { data: subscriptions } = await supabase.from("PushSubscription").select("*")

  if (subscriptions) {
    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          JSON.stringify({ title, body, url })
        )
      } catch (e) {
        // Supprimer les abonnements invalides
        await supabase.from("PushSubscription").delete().eq("endpoint", sub.endpoint)
      }
    }
  }

  return Response.json({ success: true, sent: subscriptions?.length || 0 })
}
