"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BoostButton({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleBoost() {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/boost", {
        method: "POST",
        body: JSON.stringify({ listingId }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.redirect) {
        window.location.href = data.redirect;
      } else if (data.success) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
    setLoading(false);
  }

  return (
    <button onClick={handleBoost} className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
      {loading ? "Paiement..." : "Payer 1000 FCFA et booster 7 jours"}
    </button>
  )
}
