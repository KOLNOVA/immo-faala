"use client";

import { useState } from "react";

export default function ParrainageContent({ code, lien, filleulsCount, filleulsActifs }: { code: string; lien: string; filleulsCount: number; filleulsActifs: number }) {
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
        Invitez des propriétaires à publier leurs annonces sur Immo-Faala. Lorsque <strong>8 de vos filleuls</strong> ont publié au moins une annonce, vous recevez <strong>1 boost gratuit</strong> (valeur 1000 FCFA) !
      </p>

      <div style={{ background: "#f0f8ff", padding: 20, borderRadius: 10, marginBottom: 20 }}>
        <p><strong>Progression :</strong> {filleulsActifs} / 8 filleuls actifs</p>
        <div style={{ width: "100%", background: "#ecf0f1", borderRadius: 5, height: 10, marginTop: 10 }}>
          <div style={{ width: `${Math.min((filleulsActifs / 8) * 100, 100)}%`, background: "#27ae60", height: "100%", borderRadius: 5 }}></div>
        </div>
      </div>

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

      <div style={{ background: "#fef3cd", padding: 15, borderRadius: 10, marginTop: 20 }}>
        <p><strong>🎁 Récompense :</strong> 1 boost gratuit (valeur 1000 FCFA)</p>
        <p><strong>📋 Condition :</strong> 8 de vos filleuls doivent publier au moins 1 annonce</p>
      </div>
    </div>
  );
}
