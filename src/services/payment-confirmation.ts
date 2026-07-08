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

export async function sendPaymentConfirmation(email: string, product: string, amount: number) {
  await transporter.sendMail({
    from: process.env.DEFAULT_FROM_EMAIL,
    to: email,
    subject: `Immo-Faala - Confirmation de paiement - ${product}`,
    html: `
      <div style="max-width:500px;margin:auto;background:white;border-radius:12px;overflow:hidden;font-family:Arial">
        <div style="background:linear-gradient(135deg,#27ae60,#2ecc71);color:white;padding:30px;text-align:center">
          <h1>Paiement confirmé ✅</h1>
        </div>
        <div style="padding:30px">
          <p>Bonjour,</p>
          <p>Votre paiement de <strong>${amount} FCFA</strong> pour <strong>${product}</strong> a bien été reçu.</p>
          <p>Vous pouvez dès maintenant profiter de votre service sur votre espace Immo-Faala.</p>
          <p>Merci de votre confiance,</p>
          <p>L'équipe Immo-Faala</p>
        </div>
      </div>
    `,
  })
}
