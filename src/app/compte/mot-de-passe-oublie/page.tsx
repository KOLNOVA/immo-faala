"use client";

import { useState } from "react";

export default function PasswordResetRequest() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/password/reset-request", {
      method: "POST",
      body: JSON.stringify({ phone }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setMessage(data.message);
    setLoading(false);
  }

  return (
    <div className="form-container">
      <h1>🔑 Mot de passe oublié</h1>
      <div className="listing-form">
        <p style={{ marginBottom: 20, textAlign: "center" }}>
          Entrez votre numéro de téléphone. Vous recevrez un code de réinitialisation.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Numéro de téléphone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="Ex: 22997000000"
              className="form-input"
              autoFocus
            />
          </div>
          {message && (
            <p style={{ color: message.includes("✅") ? "#27ae60" : "#e74c3c", textAlign: "center", marginBottom: 10 }}>
              {message}
            </p>
          )}
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Envoi..." : "Recevoir le code"}
          </button>
        </form>
        <p style={{ marginTop: 15, textAlign: "center" }}>
          <a href="/compte/connexion">Retour à la connexion</a>
        </p>
      </div>
    </div>
  );
}
