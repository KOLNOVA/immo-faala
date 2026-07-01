"use client";

import { useState } from "react";

export default function ParrainageContent({ code, lien }: { code: string; lien: string }) {
  const [copied, setCopied] = useState(false);

  function copyCode() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function copyLink() {
    navigator.clipboard.writeText(lien);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="listing-form" style={{ textAlign: "center" }}>
      <p style={{ marginBottom: 20 }}>
        Invitez un propriétaire à publier ses annonces sur Immo-Faala et gagnez <strong>1 boost gratuit</strong> !
      </p>

      <div className="form-group">
        <label>Votre code de parrainage</label>
        <div style={{ display: "flex", gap: 10 }}>
          <input type="text" value={code} readOnly className="form-input" style={{ textAlign: "center", fontWeight: 700, fontSize: "1.2em" }} />
          <button onClick={copyCode} className="btn btn-primary">{copied ? "✅" : "📋"}</button>
        </div>
      </div>

      <div className="form-group">
        <label>Lien de parrainage</label>
        <div style={{ display: "flex", gap: 10 }}>
          <input type="text" value={lien} readOnly className="form-input" style={{ fontSize: "0.85em" }} />
          <button onClick={copyLink} className="btn btn-primary">{copied ? "✅" : "📋"}</button>
        </div>
      </div>

      <div style={{ background: "#f0f8ff", padding: 15, borderRadius: 10, marginTop: 20 }}>
        <p><strong>🎁 Récompense :</strong> 1 boost gratuit (valeur 1000 FCFA)</p>
        <p><strong>📋 Condition :</strong> Votre filleul doit publier au moins 1 annonce</p>
      </div>
    </div>
  );
}
