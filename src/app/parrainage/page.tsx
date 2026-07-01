import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import ParrainageContent from "@/components/ParrainageContent"

export default async function ParrainagePage() {
  const session = await auth()
  if (!session) redirect("/compte/connexion")

  const code = `IMMO-${session.user.id.substring(0, 8).toUpperCase()}`
  const lien = `https://immo-faala.netlify.app/compte/inscription?parrain=${code}`

  return (
    <div className="form-container" style={{ maxWidth: 600 }}>
      <h1>🎁 Programme de Parrainage</h1>
      <ParrainageContent code={code} lien={lien} />
    </div>
  );
}
