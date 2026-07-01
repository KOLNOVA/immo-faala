"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TopAnnonceurs() {
  const [top, setTop] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/top-annonceurs")
      .then((r) => r.json())
      .then((data) => setTop(data.topAnnonceurs || []));
  }, []);

  if (top.length === 0) return null;

  return (
    <section style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>🏆 Top Annonceurs</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 15, justifyContent: "center" }}>
        {top.map((item: any, index: number) => (
          <div
            key={item.user.id}
            style={{
              background: "white",
              padding: "15px 25px",
              borderRadius: 12,
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              textAlign: "center",
              minWidth: 180,
              border: index === 0 ? "2px solid #f39c12" : "1px solid #eee",
            }}
          >
            <div style={{ fontSize: "2em" }}>
              {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
            </div>
            <p style={{ fontWeight: 700, marginTop: 5 }}>
              {item.user.displayName || item.user.username || item.user.phone}
            </p>
            <p style={{ fontSize: "0.85em", color: "#27ae60" }}>
              {item.count} annonce{item.count > 1 ? "s" : ""}
            </p>
            {item.user.isPremium && <span style={{ fontSize: "0.8em" }}>💎 Premium</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
