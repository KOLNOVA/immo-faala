"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Listing {
  id: string;
  title: string;
  price: number;
  city: string;
  district: string;
  propertyType: string;
  rooms: number;
  images?: { url: string }[];
}

export default function InfiniteScroll({
  initialListings,
  hasMore,
  nextPage,
  searchParams,
}: {
  initialListings: Listing[];
  hasMore: boolean;
  nextPage: number;
  searchParams?: Record<string, string>;
}) {
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [page, setPage] = useState(nextPage);
  const [hasNext, setHasNext] = useState(hasMore);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNext || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNext, loading, page]);

  async function loadMore() {
    setLoading(true);

    const params = new URLSearchParams();
    if (searchParams) {
      Object.entries(searchParams).forEach(([k, v]) => {
        if (v) params.append(k, v);
      });
    }
    params.append("page", page.toString());

    const res = await fetch(`/api/listings?${params.toString()}`);
    const data = await res.json();

    if (data.listings?.length > 0) {
      setListings((prev) => [...prev, ...data.listings]);
      setPage((p) => p + 1);
      setHasNext(data.hasMore);
    } else {
      setHasNext(false);
    }
    setLoading(false);
  }

  return (
    <>
      <div className="listings-grid" id="listings-container">
        {listings.map((listing) => (
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
              <p className="listing-type">{listing.propertyType} - {listing.rooms} chambre(s)</p>
              <span className="btn btn-small">Voir détails</span>
            </div>
          </Link>
        ))}
        {listings.length === 0 && (
          <p style={{ gridColumn: "1/-1", textAlign: "center" }}>Aucune annonce pour le moment.</p>
        )}
      </div>

      {hasNext && (
        <div className="loading-indicator" style={{ display: loading ? "block" : "none" }}>
          <div className="spinner"></div>
          <p>Chargement d&apos;autres annonces...</p>
        </div>
      )}

      {hasNext && <div ref={sentinelRef} style={{ height: 20 }}></div>}

      {!hasNext && listings.length > 0 && (
        <p style={{ textAlign: "center", padding: 20, color: "#7f8c8d" }}>Toutes les annonces sont chargées.</p>
      )}
    </>
  );
}
