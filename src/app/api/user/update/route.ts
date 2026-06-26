import { createClient } from "@supabase/supabase-js"

export async function PUT(request: Request) {
  const body = await request.json()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { error } = await supabase.from("User").update({
    displayName: body.displayName,
    username: body.username,
    email: body.email,
    whatsappNumber: body.whatsappNumber,
    bio: body.bio,
  }).eq("phone", body.phone)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
