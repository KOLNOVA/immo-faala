"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { storeAndSendOTP } from "@/services/email-otp";

function VerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const result = await res.json();

    if (result.success) {
      router.push(`/compte/mot-de-passe-oublie/nouveau?email=${encodeURIComponent(email)}`);
    } else {
      setMessage(result.message);
    }
    setLoading(false);
  }

  async function handleResend() {
    await storeAndSendOTP(email);
    setMessage("✅ Nouveau code envoyé.");
  }

  if (!email) {
    return (
      <div className="form-container">
        <h1>Vérification</h1>
        <p>Aucun email spécifié. Veuillez d'abord demander un code.</p>
      </div>
    );
  }

  const emailParts = email.split("@")
  const maskedEmail = emailParts[0].substring(0, 2) + "***@" + emailParts[1]

  return (
    <div className="form-container">
      <h1>📱 Vérification du code</h1>
      <div className="listing-form">
        <p style={{ textAlign: "center", marginBottom: 10 }}>
          Un code a été envoyé à : <strong>{maskedEmail}</strong>
        </p>
        <p style={{ textAlign: "center", color: "#999", marginBottom: 20 }}>
          Vérifiez votre boîte de réception (et les spams).
        </p>

        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label>Code de vérification</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              placeholder="123456"
              className="form-input"
              style={{ fontSize: "1.5em", textAlign: "center", letterSpacing: 10 }}
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
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
            {loading ? "Vérification..." : "Vérifier le code"}
          </button>
        </form>

        <p style={{ marginTop: 15, textAlign: "center" }}>
          <button onClick={handleResend} style={{ background: "none", border: "none", color: "#3498db", cursor: "pointer" }}>
            📩 Renvoyer le code
          </button>
        </p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="form-container"><p>Chargement...</p></div>}>
      <VerificationContent />
    </Suspense>
  );
}
