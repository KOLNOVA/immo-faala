import { formatPrice } from "@/lib/format";
import { supabase } from "@/lib/supabase"
import InfiniteScroll from "@/components/InfiniteScroll"

export default async function SearchPage({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const query = params?.q || "";
  const city = params?.city || "";
  const district = params?.district || "";
  const propertyType = params?.type || "";
  const minPrice = params?.min_price || "";
  const maxPrice = params?.max_price || "";
  const rooms = params?.rooms || "";

  let supabaseQuery = supabase.from("Listing").select("*, images:ListingImage(*)", { count: "exact" }).eq("status", "active");

  if (query) supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%,city.ilike.%${query}%,district.ilike.%${query}%`);
  if (city) supabaseQuery = supabaseQuery.ilike("city", `%${city}%`);
  if (district) supabaseQuery = supabaseQuery.ilike("district", `%${district}%`);
  if (propertyType) supabaseQuery = supabaseQuery.eq("propertyType", propertyType);
  if (minPrice) supabaseQuery = supabaseQuery.gte("price", parseInt(minPrice));
  if (maxPrice) supabaseQuery = supabaseQuery.lte("price", parseInt(maxPrice));
  if (rooms) supabaseQuery = supabaseQuery.gte("rooms", parseInt(rooms));

  const { data: firstPage, count: totalCount } = await supabaseQuery.order("createdAt", { ascending: false }).range(0, 11);

  const hasNext = totalCount ? totalCount > 12 : false;

  const searchFilters = { q: query, city, district, type: propertyType, min_price: minPrice, max_price: maxPrice, rooms };

  return (
    <div style={{ maxWidth: 1200, margin: "30px auto", padding: "0 20px" }}>
      <h1 style={{ marginBottom: 20 }}>Rechercher un logement</h1>

      <form action="/recherche" method="GET" className="search-bar" style={{ margin: "0 0 30px 0", position: "static" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
          <input type="text" name="q" placeholder="Mot-clé..." defaultValue={query} className="search-input" />
          <input type="text" name="city" placeholder="Ville" defaultValue={city} className="search-input" />
          <input type="text" name="district" placeholder="Quartier" defaultValue={district} className="search-input" />
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <select name="type" defaultValue={propertyType} className="search-select">
            <option value="">Type de bien</option>
            <option value="maison">Maison</option>
            <option value="appartement">Appartement</option>
            <option value="studio">Studio</option>
            <option value="chambre">Chambre</option>
            <option value="parcelle">Parcelle</option>
          </select>
          <input type="number" name="min_price" placeholder="Prix min" defaultValue={minPrice} className="search-input" />
          <input type="number" name="max_price" placeholder="Prix max" defaultValue={maxPrice} className="search-input" />
          <input type="number" name="rooms" placeholder="Chambres min" defaultValue={rooms} className="search-input" min={1} />
          <button type="submit" className="btn btn-primary">Filtrer</button>
        </div>
      </form>

      <p style={{ marginBottom: 20 }}>{totalCount || 0} résultat(s) trouvé(s)</p>

      <InfiniteScroll initialListings={firstPage || []} hasMore={hasNext} nextPage={2} searchParams={searchFilters} />
    </div>
  );
}
