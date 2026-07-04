"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const transactionId = searchParams.get("transaction_id") || searchParams.get("id");

    if (transactionId) {
      // Appeler notre API de vérification
      fetch("/api/payment/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction_id: transactionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.received) {
            setStatus("success");
            setTimeout(() => router.push("/dashboard"), 3000);
          } else {
            setStatus("error");
          }
        })
        .catch(() => setStatus("error"));
    } else {
      // Pas de paramètre, on redirige simplement
      router.push("/dashboard");
    }
  }, [router, searchParams]);

  return (
    <div className="form-container" style={{ textAlign: "center", marginTop: 60 }}>
      {status === "loading" && <p>Vérification du paiement en cours...</p>}
      {status === "success" && (
        <>
          <h1>✅ Paiement confirmé</h1>
          <p>Votre transaction a bien été enregistrée. Vous allez être redirigé vers votre tableau de bord.</p>
        </>
      )}
      {status === "error" && (
        <>
          <h1>❌ Erreur</h1>
          <p>Une erreur est survenue lors de la vérification du paiement. Veuillez contacter le support.</p>
        </>
      )}
    </div>
  );
}
