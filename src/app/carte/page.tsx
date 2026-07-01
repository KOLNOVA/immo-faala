"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const MapAllListings = dynamic(() => import("@/components/MapAllListings"), { ssr: false });

export default function MapPage() {
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/listings/all")
      .then((r) => r.json())
      .then((data) => setListings(data.listings || []));
  }, []);

  return (
    <div>
      <div style={{ padding: "20px", background: "white", borderBottom: "1px solid #eee" }}>
        <h1>🗺️ Carte des annonces</h1>
        <p style={{ color: "#7f8c8d" }}>{listings.length} annonce(s) géolocalisée(s)</p>
      </div>
      <MapAllListings listings={listings} />
    </div>
  );
}
