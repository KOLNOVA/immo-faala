"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/villes", label: "🏙️ Villes" },
    { href: "/carte", label: "🗺️ Carte" },
    { href: "/blog", label: "📝 Blog" },
    { href: "/favoris", label: "❤️ Favoris" },
    { href: "/comparateur", label: "📊 Comparer" },
    { href: "/calculateur", label: "🧮 Budget" },
    { href: "/prix", label: "💰 Prix" },
    { href: "/guide", label: "📖 Guide" },
    { href: "/parrainage", label: "🎁 Parrainage" },
  ];

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none",
          border: "none",
          color: "white",
          fontSize: "1.5em",
          cursor: "pointer",
          padding: "5px 10px",
        }}
      >
        ☰
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }}
          />
          <div style={{
            position: "absolute",
            top: "100%",
            right: 0,
            background: "#1a2a3a",
            borderRadius: 10,
            padding: "10px 0",
            minWidth: 200,
            zIndex: 100,
            boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
          }}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  padding: "10px 20px",
                  color: "white",
                  textDecoration: "none",
                  fontSize: "0.95em",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
