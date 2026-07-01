"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapAllListings({ listings }: { listings: any[] }) {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map-all").setView([6.3703, 2.3912], 7);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    listings.forEach((listing) => {
      if (listing.latitude && listing.longitude) {
        const popupContent = `
          <div style="width:200px">
            ${listing.images?.[0] ? `<img src="${listing.images[0].url}" style="width:100%;height:100px;object-fit:cover;border-radius:5px;margin-bottom:5px" />` : ""}
            <strong>${listing.title}</strong><br/>
            <span style="color:#27ae60;font-weight:bold">${listing.price?.toLocaleString()} FCFA</span><br/>
            ${listing.city} - ${listing.district}<br/>
            <a href="/annonce/${listing.id}" style="color:#3498db">Voir détails</a>
          </div>
        `;
        L.marker([listing.latitude, listing.longitude])
          .addTo(map)
          .bindPopup(popupContent);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div id="map-all" style={{ height: "calc(100vh - 100px)", width: "100%" }} />;
}
