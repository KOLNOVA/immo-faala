import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"

export default async function ReportPage({ params }: { params: { id: string } }) {
  async function report(formData: FormData) {
    "use server"
    const reason = formData.get("reason") as string
    const comment = formData.get("comment") as string

    if (!reason) return

    await supabase.from("Report").insert({
      reason,
      comment,
      listingId: params.id,
    })

    redirect(`/annonce/${params.id}`)
  }

  const { data: listing } = await supabase.from("Listing").select("title").eq("id", params.id).single()

  return (
    <div className="form-container" style={{ maxWidth: 500 }}>
      <h1>🚨 Signaler une annonce</h1>
      <div className="listing-form">
        <p style={{ marginBottom: 20 }}>
          Vous signalez : <strong>{listing?.title || "Cette annonce"}</strong>
        </p>

        <form action={report}>
          <div className="form-group">
            <label>Motif du signalement</label>
            <select name="reason" required className="form-input">
              <option value="">Choisir un motif...</option>
              <option value="fake">Annonce frauduleuse</option>
              <option value="price">Prix incorrect</option>
              <option value="unavailable">Bien indisponible</option>
              <option value="spam">Spam</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div className="form-group">
            <label>Commentaire (optionnel)</label>
            <textarea name="comment" rows={3} className="form-input" placeholder="Décrivez le problème..." />
          </div>

          <button type="submit" className="btn btn-danger" style={{ width: "100%", background: "#e74c3c", color: "white" }}>
            🚨 Envoyer le signalement
          </button>
        </form>

        <p style={{ marginTop: 15, textAlign: "center" }}>
          <a href={`/annonce/${params.id}`}>Retour à l&apos;annonce</a>
        </p>
      </div>
    </div>
  )
}
