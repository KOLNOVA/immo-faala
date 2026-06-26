import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import PublishForm from "@/components/PublishForm"

export default async function PublishPage() {
  const session = await auth()
  if (!session) redirect("/compte/connexion")

  return (
    <div className="form-container" style={{ maxWidth: 700 }}>
      <h1>Publier une annonce</h1>
      <PublishForm userId={session.user.id} />
    </div>
  )
}
