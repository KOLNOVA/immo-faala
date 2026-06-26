"use client";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "100px 20px" }}>
      <h1 style={{ fontSize: "3em", color: "#e74c3c" }}>⚠️ Erreur</h1>
      <p style={{ marginBottom: 20 }}>Une erreur est survenue.</p>
      <button onClick={reset} className="btn btn-primary">Réessayer</button>
    </div>
  )
}
