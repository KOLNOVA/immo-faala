import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import PasswordInput from "@/components/PasswordInput"
import { storeAndSendOTP } from "@/services/email-otp"

export default function RegisterPage() {
  async function register(formData: FormData) {
    "use server"
    const phone = formData.get("phone") as string
    const password = formData.get("password1") as string
    const password2 = formData.get("password2") as string
    const username = formData.get("username") as string
    const email = formData.get("email") as string
    const whatsapp = formData.get("whatsapp_number") as string
    const displayName = formData.get("display_name") as string

    if (password !== password2) return
    if (password.length < 8) return

    const passwordHash = await bcrypt.hash(password, 12)

    await supabase.from("User").insert({
      phone,
      username,
      email,
      whatsappNumber: whatsapp,
      displayName,
      passwordHash,
      isActive: false,
    })

    await storeAndSendOTP(email)

    redirect(`/compte/verification?email=${encodeURIComponent(email)}`)
  }

  return (
    <div className="form-container">
      <h1>Inscription Annonceur</h1>
      <form action={register} className="listing-form">
        <div className="form-group">
          <label>Téléphone principal *</label>
          <input type="text" name="phone" required placeholder="Ex: 22997000000" className="form-input" autoFocus />
        </div>
        <div className="form-group">
          <label>Numéro WhatsApp</label>
          <input type="text" name="whatsapp_number" placeholder="Ex: 22997000000 (si différent)" className="form-input" />
        </div>
        <div className="form-group">
          <label>Nom public affiché</label>
          <input type="text" name="display_name" placeholder="Comment voulez-vous apparaître ?" className="form-input" />
        </div>
        <div className="form-group">
          <label>Nom d&apos;utilisateur *</label>
          <input type="text" name="username" required className="form-input" />
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input type="email" name="email" required className="form-input" />
        </div>
        <PasswordInput name="password1" id="password1" placeholder="Minimum 8 caractères" required minLength={8} />
        <PasswordInput name="password2" id="password2" placeholder="Retapez le mot de passe" required minLength={8} />
        <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>S&apos;inscrire</button>
        <p style={{ marginTop: 15, textAlign: "center" }}>
          Déjà un compte ? <a href="/compte/connexion">Se connecter</a>
        </p>
      </form>
    </div>
  );
}
