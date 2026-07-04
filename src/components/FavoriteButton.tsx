"use client";

import { useState, useEffect } from "react";

export default function FavoriteButton({ listingId }: { listingId: string }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(listingId));
  }, [listingId]);

  function toggleFavorite() {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let newFavorites;
    if (favorites.includes(listingId)) {
      newFavorites = favorites.filter((id: string) => id !== listingId);
    } else {
      newFavorites = [...favorites, listingId];
    }
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  }

  return (
    <button
      onClick={toggleFavorite}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "1em",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        color: "#333",
      }}
      title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <span style={{ fontSize: "1.3em" }}>{isFavorite ? "❤️" : "🤍"}</span>
      <span style={{ fontSize: "0.85em", color: "#666" }}>
        {isFavorite ? "Retiré des favoris" : "Ajouter aux favoris"}
      </span>
    </button>
  );
}
