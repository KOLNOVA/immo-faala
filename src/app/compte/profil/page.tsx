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
    </div>
  )
}
