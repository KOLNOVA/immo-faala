import { supabase } from "@/lib/supabase"
import Link from "next/link"
import FavoriteButton from "@/components/FavoriteButton"
import ShareButton from "@/components/ShareButton"

export default async function ListingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: listing } = await supabase
    .from("Listing")
    .select("*, images:ListingImage(*), owner:User(*)")
    .eq("id", id)
    .single()

  if (!listing) return <p style={{ textAlign: "center", padding: 50 }}>Annonce introuvable.</p>

  return (
    <div className="detail-container" style={{ maxWidth: 1100, margin: "30px auto", padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
      {/* Galerie */}
      <div>
        {listing.images?.length > 0 ? (
          <>
            <div className="main-image" style={{ position: "relative" }}>
              <img src={listing.images[0].url} alt={listing.title} style={{ width: "100%", borderRadius: 12, maxHeight: 400, objectFit: "cover" }} />
              {listing.isBoosted && <span className="badge-boost" style={{ position: "absolute", top: 10, left: 10, background: "#f39c12", color: "white", padding: "5px 12px", borderRadius: 5 }}>🚀 Boosté</span>}
            </div>
            <div className="thumbnail-list" style={{ display: "flex", gap: 10, marginTop: 10 }}>
              {listing.images.map((img: any, i: number) => (
                <img key={i} src={img.url} alt={`Image ${i + 1}`} style={{ width: 70, height: 55, objectFit: "cover", borderRadius: 6, cursor: "pointer" }} />
              ))}
            </div>
          </>
        ) : (
          <div className="no-image" style={{ background: "#f5f5f5", borderRadius: 12, height: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#999" }}>
            <span style={{ fontSize: "3em" }}>📷</span>
            <p>Aucune image disponible</p>
          </div>
        )}

        {listing.latitude && listing.longitude && (
          <div style={{ marginTop: 20 }}>
            <h3>📍 Emplacement</h3>
            <div style={{ height: 250, borderRadius: 10, background: "#eee" }}></div>
          </div>
        )}
      </div>

      {/* Infos */}
      <div>
        <div className="detail-header" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <h1 style={{ margin: 0 }}>{listing.title}</h1>
          {listing.isVerified && <span className="badge-verified" style={{ position: "static" }}>🏅 Vérifié</span>}
          <FavoriteButton listingId={listing.id} />
        </div>

        <p className="detail-price" style={{ fontSize: "2em", color: "#27ae60", fontWeight: 700, margin: "15px 0" }}>{listing.price?.toLocaleString()} FCFA</p>
        <p className="detail-location" style={{ color: "#7f8c8d", fontSize: "1.1em" }}>📍 {listing.city}{listing.district ? ` - ${listing.district}` : ""}</p>

        <div style={{ display: "flex", gap: 15, color: "#999", fontSize: "0.9em", margin: "10px 0" }}>
          <span>👁 {listing.viewsCount || 0} vues</span>
          <span>📅 {new Date(listing.createdAt).toLocaleDateString("fr-FR")}</span>
        </div>

        <div className="detail-features" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "20px 0", padding: 20, background: "#f9f9f9", borderRadius: 10 }}>
          <div>🏠 <strong>{listing.propertyType}</strong></div>
          <div>🛏 <strong>{listing.rooms}</strong> chambre(s)</div>
          <div>🪑 {listing.furnished ? "Meublé" : "Non meublé"}</div>
          {listing.caution && <div>💰 Caution : <strong>{listing.caution.toLocaleString()} FCFA</strong></div>}
          {listing.advance && <div>📋 Avance : <strong>{listing.advance.toLocaleString()} FCFA</strong></div>}
          {listing.availableDate && <div>📆 Disponible le <strong>{new Date(listing.availableDate).toLocaleDateString("fr-FR")}</strong></div>}
        </div>

        <div style={{ margin: "20px 0" }}>
          <h3>📝 Description</h3>
          <p style={{ whiteSpace: "pre-line" }}>{listing.description}</p>
        </div>

        {/* Annonceur */}
        <div className="owner-card" style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: 12, padding: 20, marginTop: 25 }}>
          <h3>👤 Annonceur</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            {listing.owner?.profilePicture ? (
              <img src={listing.owner.profilePicture} alt="Photo" style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#ecf0f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5em" }}>👤</div>
            )}
            <div>
              <strong>{listing.owner?.displayName || listing.owner?.username || listing.owner?.phone}</strong>
              {listing.owner?.isPremium && <span style={{ color: "#27ae60", fontSize: "0.8em" }}> 🏅 Premium</span>}
            </div>
          </div>

          <p><strong>📞 Téléphone :</strong> {listing.owner?.phone}</p>
          {listing.owner?.whatsappNumber && <p><strong>💬 WhatsApp :</strong> {listing.owner.whatsappNumber}</p>}
          <p><strong>📅 Membre depuis :</strong> {new Date(listing.owner?.createdAt).toLocaleDateString("fr-FR")}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 15 }}>
            <a href={`tel:${listing.owner?.phone}`} className="btn btn-primary" style={{ textAlign: "center" }}>📞 Appeler</a>
            {listing.owner?.whatsappNumber && (
              <a href={`https://wa.me/${listing.owner.whatsappNumber.replace(/\+/g, "")}`} target="_blank" className="btn btn-whatsapp" style={{ textAlign: "center", background: "#25D366", color: "white" }}>
                💬 WhatsApp
              </a>
            )}
            <ShareButton title={listing.title} price={listing.price} url={`https://immo-faala.netlify.app/annonce/${listing.id}`} />
          </div>
        </div>

        {/* Signalement */}
        <div className="report-box" style={{ background: "#fff8f8", padding: 15, borderRadius: 10, marginTop: 20, border: "1px solid #f5c6cb" }}>
          <p>⚠️ Cette annonce vous semble suspecte ?</p>
          <Link href={`/signaler/${listing.id}`} className="btn btn-danger" style={{ display: "inline-block", marginTop: 10 }}>Signaler</Link>
        </div>
      </div>
    </div>
  );
}
