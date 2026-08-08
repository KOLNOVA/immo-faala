"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function NewPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (password !== confirm) {
      setMessage("❌ Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 8) {
      setMessage("❌ Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/password/update", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (data.success) {
      router.push("/compte/connexion?reset=success");
    } else {
      setMessage("❌ " + (data.error || "Erreur lors de la mise à jour."));
    }
    setLoading(false);
  }

  if (!email) {
    return (
      <div className="form-container">
        <h1>Réinitialisation</h1>
        <p>Session invalide. Veuillez recommencer la procédure.</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h1>🔒 Nouveau mot de passe</h1>
      <div className="listing-form">
        <p style={{ textAlign: "center", marginBottom: 20 }}>
          Choisissez un nouveau mot de passe pour votre compte.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Minimum 8 caractères"
              className="form-input"
              minLength={8}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              placeholder="Retapez le mot de passe"
              className="form-input"
              minLength={8}
            />
          </div>
          {message && (
            <p style={{
              color: message.includes("✅") ? "#27ae60" : "#e74c3c",
              textAlign: "center",
              marginBottom: 10
            }}>
              {message}
            </p>
          )}
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Mise à jour..." : "Changer le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function NewPasswordPage() {
  return (
    <Suspense fallback={<div className="form-container"><p>Chargement...</p></div>}>
      <NewPasswordContent />
    </Suspense>
  );
}
