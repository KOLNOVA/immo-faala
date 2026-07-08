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

export async function sendExpiryReminder(email: string, displayName: string | null) {
  const name = displayName || "utilisateur"
  await transporter.sendMail({
    from: process.env.DEFAULT_FROM_EMAIL,
    to: email,
    subject: "Immo-Faala - Votre compte arrive à expiration",
    html: `
      <div style="max-width:500px;margin:auto;background:white;border-radius:12px;overflow:hidden;font-family:Arial">
        <div style="background:linear-gradient(135deg,#1a2a3a,#2c5f8a);color:white;padding:30px;text-align:center">
          <h1>Immo-Faala</h1>
        </div>
        <div style="padding:30px">
          <p>Bonjour ${name},</p>
          <p>Votre compte annonceur expire dans <strong>7 jours</strong>.</p>
          <p>Pour continuer à profiter de nos services, veuillez renouveler votre abonnement.</p>
          <p>L'équipe Immo-Faala</p>
        </div>
      </div>
    `,
  })
}
