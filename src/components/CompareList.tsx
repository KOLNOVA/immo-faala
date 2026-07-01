"use client";

import { useState, useEffect } from "react";

export default function CompareList() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (favorites.length === 0) {
        setLoading(false);
        return;
      }

      const res = await fetch("/api/listings/favorites", {
        method: "POST",
        body: JSON.stringify({ ids: favorites }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setListings(data.listings || []);
      setLoading(false);
    }
    loadFavorites();
  }, []);

  if (loading) return <p>Chargement...</p>;

  if (listings.length === 0) {
    return <p>Aucune annonce à comparer. Ajoutez des favoris d&apos;abord.</p>;
  }

  const features = [
    { label: "Prix", key: "price", format: (v: number) => `${v?.toLocaleString()} FCFA` },
    { label: "Ville", key: "city" },
    { label: "Quartier", key: "district" },
    { label: "Type", key: "propertyType" },
    { label: "Chambres", key: "rooms" },
    { label: "Meublé", key: "furnished", format: (v: boolean) => v ? "✅ Oui" : "❌ Non" },
    { label: "Caution", key: "caution", format: (v: number) => v ? `${v.toLocaleString()} FCFA` : "-" },
  ];

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: 12, overflow: "hidden" }}>
        <thead>
          <tr style={{ background: "#1a2a3a", color: "white" }}>
            <th style={{ padding: 12, textAlign: "left" }}>Caractéristique</th>
            {listings.map((l: any) => (
              <th key={l.id} style={{ padding: 12, textAlign: "center" }}>
                <a href={`/annonce/${l.id}`} style={{ color: "white" }}>
                  {l.title?.substring(0, 20)}
                </a>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((f) => (
            <tr key={f.key} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 12, fontWeight: 600 }}>{f.label}</td>
              {listings.map((l: any) => (
                <td key={l.id} style={{ padding: 12, textAlign: "center" }}>
                  {f.format ? f.format(l[f.key]) : l[f.key] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
