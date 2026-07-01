"use client";

import { useState, useEffect } from "react";

export default function SaveFilters({ currentFilters }: { currentFilters: Record<string, string> }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("savedFilters");
    if (stored) {
      const parsed = JSON.parse(stored);
      setSaved(JSON.stringify(parsed) === JSON.stringify(currentFilters));
    }
  }, [currentFilters]);

  function saveFilters() {
    localStorage.setItem("savedFilters", JSON.stringify(currentFilters));
    setSaved(true);
  }

  function loadFilters() {
    const stored = localStorage.getItem("savedFilters");
    if (stored) {
      const params = new URLSearchParams(JSON.parse(stored));
      window.location.href = `/recherche?${params.toString()}`;
    }
  }

  return (
    <div style={{ display: "flex", gap: 10 }}>
      <button onClick={saveFilters} className="btn btn-small btn-secondary" disabled={saved}>
        {saved ? "✅ Filtres sauvegardés" : "💾 Sauvegarder ces filtres"}
      </button>
      <button onClick={loadFilters} className="btn btn-small btn-secondary">
        📂 Charger mes filtres
      </button>
    </div>
  );
}
