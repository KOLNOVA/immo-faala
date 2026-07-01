import { supabase } from "@/lib/supabase"

export default async function PriceMapPage() {
  const { data } = await supabase
    .from("Listing")
    .select("city, district, price")
    .eq("status", "active")

  const prices: Record<string, { total: number; count: number }> = {}
  data?.forEach((l: any) => {
    const key = `${l.city} - ${l.district}`
    if (!prices[key]) prices[key] = { total: 0, count: 0 }
    prices[key].total += l.price
    prices[key].count++
  })

  const averages = Object.entries(prices)
    .map(([key, val]) => ({ quartier: key, moyen: Math.round(val.total / val.count), count: val.count }))
    .sort((a, b) => b.moyen - a.moyen)

  return (
    <section className="listings-section">
      <h1>💰 Carte des prix moyens</h1>
      <p style={{ color: "#7f8c8d", marginBottom: 20 }}>
        Prix moyens par quartier basés sur les annonces actives.
      </p>
      <div className="listings-grid">
        {averages.map((a) => (
          <div key={a.quartier} className="listing-card" style={{ padding: 20, textAlign: "center" }}>
            <h3>{a.quartier}</h3>
            <p className="listing-price">{a.moyen.toLocaleString()} FCFA</p>
            <p style={{ color: "#999", fontSize: "0.85em" }}>{a.count} annonce{a.count > 1 ? "s" : ""}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
