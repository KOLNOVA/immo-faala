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
    { label: "Prix", render: (l: any) => `${l.price?.toLocaleString()} FCFA` },
    { label: "Ville", render: (l: any) => l.city || "-" },
    { label: "Quartier", render: (l: any) => l.district || "-" },
    { label: "Type", render: (l: any) => l.propertyType || "-" },
    { label: "Chambres", render: (l: any) => l.rooms || "-" },
    { label: "Meublé", render: (l: any) => l.furnished ? "✅ Oui" : "❌ Non" },
    { label: "Caution", render: (l: any) => l.caution ? `${l.caution.toLocaleString()} FCFA` : "-" },
    { label: "Avance", render: (l: any) => l.advance ? `${l.advance.toLocaleString()} FCFA` : "-" },
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
          {features.map((f, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 12, fontWeight: 600 }}>{f.label}</td>
              {listings.map((l: any) => (
                <td key={l.id} style={{ padding: 12, textAlign: "center" }}>
                  {f.render(l)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
