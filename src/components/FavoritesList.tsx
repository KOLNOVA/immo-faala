"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function FavoritesList() {
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
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <p style={{ fontSize: "1.2em", marginBottom: 20 }}>Vous n&apos;avez pas encore de favoris.</p>
        <Link href="/recherche" className="btn btn-primary">Rechercher des annonces</Link>
      </div>
    );
  }

  return (
    <div className="listings-grid">
      {listings.map((listing: any) => (
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
          </div>
        </Link>
      ))}
    </div>
  );
}
