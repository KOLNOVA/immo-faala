import { createClient } from "@supabase/supabase-js"
import { storeAndSendOTP } from "@/services/email-otp"

export async function POST(request: Request) {
  const { phone } = await request.json()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { data: user } = await supabase.from("User").select("email, isActive, displayName").eq("phone", phone).single()

  if (!user) {
    return Response.json({ message: "❌ Aucun compte trouvé avec ce numéro.", redirect: null })
  }

  if (!user.isActive) {
    return Response.json({ message: "❌ Ce compte n'est pas actif. Contactez le support.", redirect: null })
  }

  const sent = await storeAndSendOTP(user.email)

  if (sent) {
    const emailParts = user.email.split("@")
    const maskedEmail = emailParts[0].substring(0, 2) + "***@" + emailParts[1]
    
    return Response.json({
      message: `✅ Un code de réinitialisation a été envoyé à ${maskedEmail}. Vérifiez votre boîte de réception (et les spams).`,
      redirect: `/compte/mot-de-passe-oublie/verification?email=${encodeURIComponent(user.email)}`
    })
  } else {
    return Response.json({ message: "❌ Erreur lors de l'envoi de l'email. Veuillez réessayer.", redirect: null })
  }
}
