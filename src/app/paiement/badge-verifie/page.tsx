"use client";

import { useState } from "react";

export default function BadgePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const isSandbox = process.env.NEXT_PUBLIC_FEDAPAY_SANDBOX === "true";

  async function handleBadge() {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/badge", { method: "POST" });
      const data = await res.json();

      if (data.redirect) {
        window.location.href = data.redirect;
      } else if (data.success) {
        setMessage("✅ Badge Premium activé ! Redirection...");
        setTimeout(() => window.location.href = "/dashboard", 2000);
      } else {
        setMessage("❌ " + (data.error || "Erreur"));
      }
    } catch (error) {
      setMessage("❌ Erreur réseau");
    }
    setLoading(false);
  }

  return (
    <div className="form-container">
      <h1>Obtenir le Badge Premium</h1>
      <div className="listing-form" style={{ textAlign: "center" }}>
        <p style={{ fontSize: "1.2em", marginBottom: 20 }}><strong>Badge Premium : 500 FCFA</strong></p>
        <p style={{ marginBottom: 20 }}>
          🏅 Badge de confiance sur votre profil<br />
          📈 Meilleure visibilité de vos annonces<br />
          ✅ Confiance accrue des visiteurs
        </p>
        <button onClick={handleBadge} className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Paiement..." : "Payer 500 FCFA via Fedapay"}
        </button>
        {message && <p style={{ marginTop: 10 }}>{message}</p>}
        {isSandbox && (
          <p style={{ marginTop: 10, color: "#e67e22" }}>⚠️ Mode sandbox activé</p>
        )}
        <p style={{ marginTop: 15 }}><a href="/dashboard">Retour au dashboard</a></p>
      </div>
    </div>
  )
}
