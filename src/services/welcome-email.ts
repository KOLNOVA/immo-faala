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

export async function sendWelcomeEmail(email: string, displayName: string | null, parrainCode?: string) {
  const name = displayName || "utilisateur"
  const lienParrainage = `https://immofaala.com/compte/inscription?parrain=${parrainCode || ""}`

  await transporter.sendMail({
    from: process.env.DEFAULT_FROM_EMAIL,
    to: email,
    subject: "Bienvenue sur Immo-Faala !",
    html: `
      <div style="max-width:600px;margin:auto;background:white;border-radius:12px;overflow:hidden;font-family:Arial">
        <div style="background:linear-gradient(135deg,#1a2a3a,#2c5f8a);color:white;padding:30px;text-align:center">
          <h1>Bienvenue sur Immo-Faala !</h1>
        </div>
        <div style="padding:30px">
          <p>Bonjour ${name},</p>
          <p>Votre compte annonceur a été activé avec succès. Voici un petit guide pour bien démarrer :</p>
          
          <h3>📋 Publier une annonce</h3>
          <p>Rendez-vous dans votre <strong>Dashboard</strong> et cliquez sur <strong>"Publier une annonce"</strong>. Remplissez tous les champs, ajoutez des photos de qualité et positionnez votre bien sur la carte.</p>
          
          <h3>🏅 Badge Premium</h3>
          <p>Pour gagner en visibilité et en confiance, obtenez le <strong>Badge Premium</strong> depuis votre Dashboard. Il vous distingue des autres annonceurs.</p>
          
          <h3>🚀 Booster une annonce</h3>
          <p>Pour mettre votre annonce en avant, utilisez l'option <strong>Boost</strong>. Votre annonce apparaîtra en tête des résultats pendant 7 jours.</p>
          
          <h3>🎁 Programme de Parrainage</h3>
          <p>Invitez vos amis propriétaires à s'inscrire sur Immo-Faala. Lorsque <strong>8 de vos filleuls</strong> auront publié au moins une annonce, vous recevrez <strong>1 boost gratuit</strong> (valeur 1000 FCFA) !</p>
          <p>Voici votre lien de parrainage personnel : <a href="${lienParrainage}">${lienParrainage}</a></p>
          
          <h3>📊 Suivre vos performances</h3>
          <p>Dans votre Dashboard, vous pouvez voir le nombre de vues de chaque annonce, les comparer, et exporter vos données.</p>
          
          <h3>❓ Besoin d'aide ?</h3>
          <p>Consultez notre <strong>Guide du locataire</strong> et notre <strong>Blog</strong> pour des conseils. Si vous avez des questions, contactez-nous à <strong>contact@immofaala.com</strong>.</p>
          
          <p>Merci de votre confiance,</p>
          <p>L'équipe Immo-Faala</p>
        </div>
      </div>
    `,
  })
}
