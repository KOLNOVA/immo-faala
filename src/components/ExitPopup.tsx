"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ExitPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) {
          setShow(true);
          document.removeEventListener("mouseleave", handleMouseLeave);
        }
      };
      document.addEventListener("mouseleave", handleMouseLeave);
      return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}>
      <div style={{
        background: "white",
        padding: 40,
        borderRadius: 12,
        textAlign: "center",
        maxWidth: 400,
      }}>
        <h2 style={{ marginBottom: 15 }}>Attendez ! 🏠</h2>
        <p style={{ marginBottom: 20 }}>
          Inscrivez-vous gratuitement pour publier vos annonces et trouver le logement idéal.
        </p>
        <Link href="/compte/inscription" className="btn btn-primary" style={{ marginRight: 10 }}>
          S&apos;inscrire gratuitement
        </Link>
        <button onClick={() => setShow(false)} className="btn btn-secondary" style={{ marginTop: 10 }}>
          Non merci
        </button>
      </div>
    </div>
  );
}
