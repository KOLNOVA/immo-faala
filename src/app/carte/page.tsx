import { supabase } from "@/lib/supabase"
import dynamic from "next/dynamic"

const MapAllListings = dynamic(() => import("@/components/MapAllListings"), { ssr: false })

export default async function MapPage() {
  const { data: listings } = await supabase
    .from("Listing")
    .select("id, title, price, city, district, latitude, longitude, propertyType, images:ListingImage(url)")
    .eq("status", "active")
    .not("latitude", "is", null)
    .not("longitude", "is", null)

  return (
    <div>
      <div style={{ padding: "20px", background: "white", borderBottom: "1px solid #eee" }}>
        <h1>🗺️ Carte des annonces</h1>
        <p style={{ color: "#7f8c8d" }}>{listings?.length || 0} annonce(s) géolocalisée(s)</p>
      </div>
      <MapAllListings listings={listings || []} />
    </div>
  );
}
