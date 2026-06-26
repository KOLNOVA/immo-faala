import Link from "next/link";
import { supabase } from "@/lib/supabase";
import InfiniteScroll from "@/components/InfiniteScroll";

export default async function HomePage() {
  // Annonces vérifiées
  const { data: verifiedListings } = await supabase
    .from("Listing")
    .select("*, images:ListingImage(*)")
    .eq("status", "active")
    .eq("isVerified", true)
    .order("createdAt", { ascending: false })
    .limit(6);

  // Première page d'annonces (12)
  const { data: firstPage, count: totalCount } = await supabase
    .from("Listing")
    .select("*, images:ListingImage(*)", { count: "exact", head: false })
    .eq("status", "active")
    .eq("isVerified", false)
    .order("createdAt", { ascending: false })
    .range(0, 11);

  // Quartiers populaires
  const { data: popularDistricts } = await supabase
    .from("Listing")
    .select("city, district")
    .eq("status", "active")
    .limit(8);

  const districtCounts: Record<string, { city: string; district: string; count: number }> = {};
  popularDistricts?.forEach((d) => {
    const key = `${d.city}-${d.district}`;
    if (!districtCounts[key]) districtCounts[key] = { city: d.city, district: d.district, count: 0 };
    districtCounts[key].count++;
  });
  const sortedDistricts = Object.values(districtCounts).sort((a, b) => b.count - a.count).slice(0, 8);

  const hasNext = totalCount ? totalCount > 12 : false;
  const nextPage = 2;

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>Trouvez votre logement sans intermédiaires abusifs</h1>
          <p>La plateforme qui connecte directement propriétaires et locataires en Afrique de l&apos;Ouest</p>
          <Link href="/recherche" className="btn btn-primary">Rechercher un logement</Link>
          <Link href="/compte/inscription" className="btn btn-secondary">Publier une annonce</Link>
        </div>
      </section>

      {/* Barre de recherche */}
      <section className="search-bar">
        <form action="/recherche" method="GET">
          <input type="text" name="q" placeholder="Ville, quartier ou type de bien..." className="search-input" />
          <select name="type" className="search-select">
            <option value="">Type de bien</option>
            <option value="maison">Maison</option>
            <option value="appartement">Appartement</option>
            <option value="studio">Studio</option>
            <option value="chambre">Chambre</option>
            <option value="parcelle">Parcelle</option>
          </select>
          <input type="number" name="min_price" placeholder="Prix min (FCFA)" className="search-input" />
          <input type="number" name="max_price" placeholder="Prix max (FCFA)" className="search-input" />
          <button type="submit" className="btn btn-search">Rechercher</button>
        </form>
      </section>

      {/* Quartiers populaires */}
      {sortedDistricts.length > 0 && (
        <section className="popular-districts" style={{ maxWidth: 1200, margin: "30px auto", padding: "0 20px" }}>
          <h2 style={{ textAlign: "center", marginBottom: 20 }}>📌 Quartiers les plus recherchés</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {sortedDistricts.map((d, i) => (
              <Link key={i} href={`/quartier/${d.city.toLowerCase().replace(/\s+/g, "-")}/${d.district.toLowerCase().replace(/\s+/g, "-")}`} className="btn btn-small">
                {d.district} ({d.city})
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Annonces vérifiées */}
      {verifiedListings && verifiedListings.length > 0 && (
        <section className="listings-section verified-section">
          <h2>🏅 Annonces Vérifiées</h2>
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
                  <span className="btn btn-small">Voir détails</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Dernières annonces avec scroll infini */}
      <section className="listings-section">
        <h2>Dernières annonces</h2>
        <InfiniteScroll initialListings={firstPage || []} hasMore={hasNext} nextPage={nextPage} />
      </section>
    </>
  );
}
