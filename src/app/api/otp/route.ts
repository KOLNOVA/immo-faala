import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.EMAIL_HOST_USER,
    pass: process.env.EMAIL_HOST_PASSWORD,
  },
})

export async function POST(request: Request) {
  const { email } = await request.json()
  
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  // Stocker l'OTP dans Supabase
  const { createClient } = await import("@supabase/supabase-js")
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  await supabase.from("OTP").delete().eq("email", email)
  await supabase.from("OTP").insert({ email, code: otp, attempts: 0 })

  try {
    await transporter.sendMail({
      from: process.env.DEFAULT_FROM_EMAIL,
      to: email,
      subject: "Immo-Faala - Code de vérification",
      html: `
        <div style="max-width:500px;margin:auto;background:white;border-radius:12px;overflow:hidden;font-family:Arial">
          <div style="background:linear-gradient(135deg,#1a2a3a,#2c5f8a);color:white;padding:30px;text-align:center">
            <h1>Immo-Faala</h1>
          </div>
          <div style="padding:30px">
            <p>Bonjour,</p>
            <p>Votre code de vérification :</p>
            <div style="background:#f0f8ff;border:2px dashed #3498db;border-radius:10px;padding:20px;text-align:center;margin:20px 0">
              <span style="font-size:2.5em;font-weight:bold;color:#1a2a3a;letter-spacing:8px">${otp}</span>
            </div>
            <p style="color:#e74c3c">⚠️ Ce code expire dans 10 minutes.</p>
          </div>
        </div>
      `,
    })
    return Response.json({ success: true })
  } catch (error) {
    console.error("Erreur envoi email:", error)
    return Response.json({ success: false, error: "Erreur envoi email" })
  }
}
