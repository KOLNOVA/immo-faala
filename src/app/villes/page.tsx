import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default async function CitiesPage() {
  const { data: cities } = await supabase
    .from("Listing")
    .select("city")
    .eq("status", "active")
    .order("city")

  const uniqueCities = [...new Set(cities?.map((c: any) => c.city))]

  return (
    <section className="listings-section">
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>🏙️ Villes disponibles</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 15, justifyContent: "center" }}>
        {uniqueCities.map((city: string) => (
          <Link key={city} href={`/recherche?city=${encodeURIComponent(city)}`} className="btn btn-secondary">
            📍 {city}
          </Link>
        ))}
      </div>
    </section>
  )
}
