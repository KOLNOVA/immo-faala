import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default async function DistrictPage({ params }: { params: { city: string; district: string } }) {
  const city = params.city.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  const district = params.district.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

  const { data: listings } = await supabase
    .from("Listing")
    .select("*, images:ListingImage(*), owner:User(*)")
    .eq("status", "active")
    .ilike("city", `%${city}%`)
    .ilike("district", `%${district}%`)
    .order("createdAt", { ascending: false })

  const verifiedListings = listings?.filter((l: any) => l.isVerified) || []
  const total = listings?.length || 0

  return (
    <>
      <section className="hero-small">
        <div className="hero-content">
          <h1>🏠 Logements à {district}, {city}</h1>
          <p>Trouvez le logement idéal sans intermédiaires abusifs. Annonces vérifiées et prix transparents.</p>
        </div>
      </section>

      <section className="search-bar">
        <form action="/recherche" method="GET">
          <input type="hidden" name="city" value={city} />
          <input type="hidden" name="district" value={district} />
          <input type="text" name="q" placeholder="Mot-clé..." className="search-input" />
          <select name="type" className="search-select">
            <option value="">Type de bien</option>
            <option value="maison">Maison</option>
            <option value="appartement">Appartement</option>
            <option value="studio">Studio</option>
            <option value="chambre">Chambre</option>
            <option value="parcelle">Parcelle</option>
          </select>
          <input type="number" name="min_price" placeholder="Prix min" className="search-input" />
          <input type="number" name="max_price" placeholder="Prix max" className="search-input" />
          <button type="submit" className="btn btn-search">Filtrer</button>
        </form>
      </section>

      {verifiedListings.length > 0 && (
        <section className="listings-section verified-section">
          <h2>🏅 Annonces Vérifiées à {district}</h2>
          <div className="listings-grid">
            {verifiedListings.map((listing: any) => (
              <Link key={listing.id} href={`/annonce/${listing.id}`} className="listing-card verified">
                <span className="badge-verified">Vérifié</span>
                {listing.images?.[0] ? (
                  <img src={listing.images[0].url} alt={listing.title} className="listing-image" />
                ) : (
                  <div className="listing-image-placeholder">Aucune image</div>
                )}
                <div className="listing-info">
                  <h3>{listing.title?.length > 40 ? listing.title.substring(0, 40) + "..." : listing.title}</h3>
                  <p className="listing-price">{listing.price?.toLocaleString()} FCFA</p>
                  <p className="listing-location">{listing.city} - {listing.district}</p>
                  <Link href={`/annonce/${listing.id}`} className="btn btn-small">Voir détails</Link>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="listings-section">
        <h2>Tous les logements à {district} ({total} annonce{total > 1 ? "s" : ""})</h2>
        <div className="listings-grid">
          {listings?.map((listing: any) => (
            <Link key={listing.id} href={`/annonce/${listing.id}`} className="listing-card">
              {listing.images?.[0] ? (
                <img src={listing.images[0].url} alt={listing.title} className="listing-image" />
              ) : (
                <div className="listing-image-placeholder">Aucune image</div>
              )}
              <div className="listing-info">
                <h3>{listing.title?.length > 40 ? listing.title.substring(0, 40) + "..." : listing.title}</h3>
                <p className="listing-price">{listing.price?.toLocaleString()} FCFA</p>
                <p className="listing-location">{listing.city} - {listing.district}</p>
                <Link href={`/annonce/${listing.id}`} className="btn btn-small">Voir détails</Link>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="seo-content" style={{ maxWidth: 900, margin: "40px auto", padding: 20, background: "white", borderRadius: 10 }}>
        <h2>Pourquoi choisir {district}, {city} ?</h2>
        <p>{district} est l&apos;un des quartiers les plus recherchés de {city}. Que vous cherchiez un appartement meublé, une maison spacieuse ou un studio économique, Immo-Faala vous met en relation directe avec les propriétaires, sans frais d&apos;agence excessifs.</p>
      </section>
    </>
  )
}
