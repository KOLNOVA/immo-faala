"use client";

import { useState } from "react";

export default function CalculateurPage() {
  const [loyer, setLoyer] = useState("");
  const [charges, setCharges] = useState("");
  const [revenu, setRevenu] = useState("");

  const loyerNum = parseInt(loyer) || 0;
  const chargesNum = parseInt(charges) || 0;
  const revenuNum = parseInt(revenu) || 0;
  const total = loyerNum + chargesNum;
  const tauxEffort = revenuNum > 0 ? Math.round((total / revenuNum) * 100) : 0;
  const caution = loyerNum * 2;
  const avance = loyerNum;

  return (
    <div className="form-container" style={{ maxWidth: 600 }}>
      <h1>🧮 Calculateur de budget</h1>
      <p style={{ textAlign: "center", color: "#7f8c8d", marginBottom: 20 }}>
        Estimez votre budget logement en quelques clics.
      </p>

      <div className="listing-form">
        <div className="form-group">
          <label>Loyer mensuel prévu (FCFA)</label>
          <input type="number" value={loyer} onChange={(e) => setLoyer(e.target.value)} placeholder="Ex: 50000" className="form-input" />
        </div>
        <div className="form-group">
          <label>Charges estimées (eau, électricité) (FCFA)</label>
          <input type="number" value={charges} onChange={(e) => setCharges(e.target.value)} placeholder="Ex: 15000" className="form-input" />
        </div>
        <div className="form-group">
          <label>Votre revenu mensuel (FCFA)</label>
          <input type="number" value={revenu} onChange={(e) => setRevenu(e.target.value)} placeholder="Ex: 200000" className="form-input" />
        </div>

        {total > 0 && (
          <div style={{ marginTop: 20, padding: 20, background: "#f9f9f9", borderRadius: 10 }}>
            <h3 style={{ marginBottom: 15 }}>📋 Résultat</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div><strong>Total mensuel :</strong></div>
              <div style={{ fontWeight: 700, color: "#27ae60" }}>{total.toLocaleString()} FCFA</div>

              <div><strong>Caution (2 mois) :</strong></div>
              <div>{caution.toLocaleString()} FCFA</div>

              <div><strong>Avance (1 mois) :</strong></div>
              <div>{avance.toLocaleString()} FCFA</div>

              <div><strong>Dépôt initial :</strong></div>
              <div style={{ fontWeight: 700, color: "#e74c3c" }}>{(caution + avance).toLocaleString()} FCFA</div>

              {revenuNum > 0 && (
                <>
                  <div><strong>Taux d'effort :</strong></div>
                  <div style={{
                    fontWeight: 700,
                    color: tauxEffort > 40 ? "#e74c3c" : tauxEffort > 30 ? "#f39c12" : "#27ae60"
                  }}>
                    {tauxEffort}%
                  </div>
                </>
              )}
            </div>

            {tauxEffort > 0 && (
              <p style={{ marginTop: 15, padding: 10, borderRadius: 5, background: tauxEffort > 40 ? "#fde8e8" : tauxEffort > 30 ? "#fef3cd" : "#d4edda", color: tauxEffort > 40 ? "#721c24" : tauxEffort > 30 ? "#856404" : "#155724" }}>
                {tauxEffort > 40
                  ? "⚠️ Votre taux d'effort dépasse 40%. Ce logement risque d'être trop cher pour vous."
                  : tauxEffort > 30
                  ? "⚡ Votre taux d'effort est entre 30 et 40%. Restez vigilant."
                  : "✅ Votre taux d'effort est inférieur à 30%. Budget équilibré !"}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
