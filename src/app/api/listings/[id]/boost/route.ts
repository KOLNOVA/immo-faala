import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const boostUntil = new Date()
  boostUntil.setDate(boostUntil.getDate() + 7)

  const { error } = await supabase.from("Listing").update({
    isBoosted: true,
    boostUntil: boostUntil.toISOString(),
  }).eq("id", (await params).id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
