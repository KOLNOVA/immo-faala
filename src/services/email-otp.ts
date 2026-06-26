import nodemailer from "nodemailer"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function storeAndSendOTP(email: string): Promise<boolean> {
  const otp = generateOTP()

  // Supprimer les anciens OTP pour cet email
  await supabase.from("OTP").delete().eq("email", email)

  // Stocker le nouveau
  const { error } = await supabase.from("OTP").insert({
    email,
    code: otp,
    attempts: 0,
  })

  if (error) {
    console.error("Erreur stockage OTP:", error)
    return false
  }

  // Envoyer l'email
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: process.env.DEFAULT_FROM_EMAIL,
      to: email,
      subject: "Immo-Faala - Code de vérification",
      html: `
        <div style="max-width:500px;margin:auto;background:white;border-radius:12px;overflow:hidden;font-family:Arial,sans-serif">
          <div style="background:linear-gradient(135deg,#1a2a3a,#2c5f8a);color:white;padding:30px;text-align:center">
            <h1 style="margin:0;font-size:1.8em">Immo-Faala</h1>
            <p style="margin:5px 0 0;opacity:0.9;font-size:0.9em">Trouvez. Louez. Vendez. En toute simplicité.</p>
          </div>
          <div style="padding:30px">
            <p>Bonjour,</p>
            <p>Merci de vous être inscrit sur <strong>Immo-Faala</strong>. Voici votre code de vérification :</p>
            <div style="background:#f0f8ff;border:2px dashed #3498db;border-radius:10px;padding:20px;text-align:center;margin:20px 0">
              <span style="font-size:2.5em;font-weight:bold;color:#1a2a3a;letter-spacing:8px">${otp}</span>
            </div>
            <p style="color:#e74c3c;font-size:0.9em">⚠️ Ce code expire dans 10 minutes.</p>
            <p>Si vous n'avez pas demandé ce code, ignorez cet email.</p>
          </div>
          <div style="background:#f9f9f9;padding:15px;text-align:center;font-size:0.8em;color:#999">
            <p>© 2026 Immo-Faala — Un produit KOLNOVA</p>
          </div>
        </div>
      `,
    })

    return true
  } catch (error) {
    console.error("Erreur envoi email:", error)
    return false
  }
}

export async function verifyOTP(email: string, code: string): Promise<{ success: boolean; message: string }> {
  const { data: otpRecord } = await supabase
    .from("OTP")
    .select("*")
    .eq("email", email)
    .single()

  if (!otpRecord) {
    return { success: false, message: "Aucun code trouvé. Demandez un nouveau code." }
  }

  // Vérifier expiration
  if (new Date(otpRecord.expiresAt) < new Date()) {
    await supabase.from("OTP").delete().eq("id", otpRecord.id)
    return { success: false, message: "Le code a expiré. Demandez un nouveau code." }
  }

  // Vérifier tentatives
  if (otpRecord.attempts >= 3) {
    await supabase.from("OTP").delete().eq("id", otpRecord.id)
    return { success: false, message: "Trop de tentatives. Demandez un nouveau code." }
  }

  // Vérifier le code
  if (otpRecord.code !== code) {
    await supabase.from("OTP").update({ attempts: otpRecord.attempts + 1 }).eq("id", otpRecord.id)
    const remaining = 3 - (otpRecord.attempts + 1)
    return { success: false, message: `Code incorrect. Il vous reste ${remaining} tentative(s).` }
  }

  // Code correct - supprimer l'OTP
  await supabase.from("OTP").delete().eq("id", otpRecord.id)
  return { success: true, message: "Code vérifié avec succès." }
}
