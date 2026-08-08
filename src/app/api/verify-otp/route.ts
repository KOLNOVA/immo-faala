import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  const { email, code } = await request.json()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: otpRecord } = await supabase.from("OTP").select("*").eq("email", email).single()

  if (!otpRecord) return Response.json({ success: false, message: "Aucun code trouvé." })
  if (new Date(otpRecord.expiresAt) < new Date()) {
    await supabase.from("OTP").delete().eq("id", otpRecord.id)
    return Response.json({ success: false, message: "Code expiré." })
  }
  if (otpRecord.attempts >= 3) {
    await supabase.from("OTP").delete().eq("id", otpRecord.id)
    return Response.json({ success: false, message: "Trop de tentatives." })
  }
  if (otpRecord.code !== code) {
    await supabase.from("OTP").update({ attempts: otpRecord.attempts + 1 }).eq("id", otpRecord.id)
    return Response.json({ success: false, message: `Code incorrect. ${3 - otpRecord.attempts - 1} tentative(s) restante(s).` })
  }

  await supabase.from("OTP").delete().eq("id", otpRecord.id)
  return Response.json({ success: true, message: "Code vérifié." })
}
