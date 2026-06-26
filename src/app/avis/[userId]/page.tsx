import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"

export default async function ReviewPage({ params }: { params: { userId: string } }) {
  const { data: user } = await supabase.from("User").select("*").eq("id", params.userId).single()

  async function submitReview(formData: FormData) {
    "use server"
    const rating = parseInt(formData.get("rating") as string)
    const comment = formData.get("comment") as string
    const name = formData.get("reviewer_name") as string
    const listingId = formData.get("listing_id") as string

    if (!rating) return

    await supabase.from("Review").insert({
      rating,
      comment,
      reviewerName: name || "Anonyme",
      userId: params.userId,
      isApproved: false,
    })

    redirect(`/annonce/${listingId}`)
  }

  return (
    <div className="form-container" style={{ maxWidth: 500 }}>
      <h1>⭐ Laisser un avis</h1>
      <div className="listing-form">
        <p style={{ marginBottom: 20 }}>
          Vous évaluez : <strong>{user?.displayName || user?.username || user?.phone}</strong>
        </p>

        <form action={submitReview}>
          <input type="hidden" name="listing_id" value="" />

          <div className="form-group">
            <label>Votre nom</label>
            <input type="text" name="reviewer_name" placeholder="Votre nom" className="form-input" />
          </div>

          <div className="form-group">
            <label>Note</label>
            <select name="rating" required className="form-input">
              <option value="">Choisir...</option>
              <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
              <option value="4">⭐⭐⭐⭐ Bien</option>
              <option value="3">⭐⭐⭐ Moyen</option>
              <option value="2">⭐⭐ Mauvais</option>
              <option value="1">⭐ Très mauvais</option>
            </select>
          </div>

          <div className="form-group">
            <label>Commentaire</label>
            <textarea name="comment" rows={3} className="form-input" placeholder="Votre commentaire..." />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
            Envoyer mon avis
          </button>
        </form>
      </div>
    </div>
  )
}
