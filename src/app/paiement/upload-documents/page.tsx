"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadDocsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const isSandbox = process.env.NEXT_PUBLIC_FEDAPAY_SANDBOX === "true";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/user/upload-docs", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setMessage("✅ Documents envoyés avec succès !");
      setTimeout(() => router.push("/dashboard"), 2000);
    } else {
      setMessage("❌ Erreur lors de l'envoi.");
    }
    setLoading(false);
  }

  return (
    <div className="form-container">
      <h1>Vérification du Compte</h1>
      <div className="listing-form">
        <p style={{ marginBottom: 20 }}>
          Pour obtenir le Badge Premium, téléchargez votre pièce d&apos;identité et un selfie.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Pièce d&apos;identité (Carte, Passeport, Permis)</label>
            <input type="file" name="id_document" accept="image/*" className="form-input" required />
          </div>
          <div className="form-group">
            <label>Selfie (photo de vous)</label>
            <input type="file" name="selfie" accept="image/*" className="form-input" required />
          </div>
          {message && <p style={{ marginTop: 10 }}>{message}</p>}
          {isSandbox && (
            <p style={{ marginTop: 10, color: "#e67e22" }}>⚠️ Mode sandbox activé</p>
          )}
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Envoi..." : "Envoyer pour vérification"}
          </button>
        </form>
        <p style={{ marginTop: 15 }}>
          <a href="/dashboard">Retour au dashboard</a>
        </p>
      </div>
    </div>
  )
}
