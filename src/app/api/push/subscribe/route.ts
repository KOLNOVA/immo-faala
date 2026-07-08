import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  const subscription = await request.json()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  await supabase.from("PushSubscription").upsert({
    endpoint: subscription.endpoint,
    keys: subscription.keys,
    createdAt: new Date().toISOString(),
  })

  return Response.json({ success: true })
}
