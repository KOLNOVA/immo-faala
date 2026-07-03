import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"
import ProfileForm from "@/components/ProfileForm"

export default async function ProfilePage() {
  const session = await auth()
  if (!session) redirect("/compte/connexion")

  const { data: user } = await supabase.from("User").select("*").eq("id", session.user.id).single()

  return (
    <div className="form-container" style={{ maxWidth: 700 }}>
      <h1>Modifier mon profil</h1>
      <ProfileForm user={user} />
      
      <h2 style={{ marginTop: 40 }}>🔒 Changer mon mot de passe</h2>
      <form action="/api/user/change-password" method="POST" className="listing-form">
        <div className="form-group">
          <label>Ancien mot de passe</label>
          <input type="password" name="oldPassword" required className="form-input" />
        </div>
        <div className="form-group">
          <label>Nouveau mot de passe</label>
          <input type="password" name="newPassword" required minLength={8} className="form-input" />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
          Mettre à jour le mot de passe
        </button>
      </form>
    </div>
  );
}
