import nodemailer from "nodemailer"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email") || "test@test.com"

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
      subject: "Test Immo-Faala",
      text: "Si tu reçois ceci, l'email fonctionne sur Netlify !",
    })

    return Response.json({ success: true, message: "Email envoyé à " + email })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
