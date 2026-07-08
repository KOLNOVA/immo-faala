import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"
import ParrainageContent from "@/components/ParrainageContent"

export default async function ParrainagePage() {
  const session = await auth()
  if (!session) redirect("/compte/connexion")

  const code = session.user.id // Le code de parrainage est l'ID de l'utilisateur
  const lien = `https://immofaala.com/compte/inscription?parrain=${code}`

  // Compter les filleuls actifs
  const { count: filleulsActifs } = await supabase
    .from("User")
    .select("id", { count: "exact", head: true })
    .eq("parrainId", session.user.id)

  // Vérifier combien ont publié au moins une annonce
  const { data: filleulsWithListings } = await supabase
    .from("User")
    .select("id")
    .eq("parrainId", session.user.id)
    .filter("id", "in", (await supabase.from("Listing").select("ownerId").eq("status", "active")).data?.map(l => l.ownerId) || [])

  const filleulsActifsCount = filleulsWithListings?.length || 0

  return (
    <div className="form-container" style={{ maxWidth: 600 }}>
      <h1>🎁 Programme de Parrainage</h1>
      <ParrainageContent code={code} lien={lien} filleulsCount={filleulsActifs || 0} filleulsActifs={filleulsActifsCount} />
    </div>
  );
}
