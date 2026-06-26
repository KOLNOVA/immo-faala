import Link from "next/link"

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "100px 20px" }}>
      <h1 style={{ fontSize: "4em", color: "#1a2a3a" }}>404</h1>
      <p style={{ fontSize: "1.5em", marginBottom: 30 }}>Page introuvable</p>
      <p style={{ marginBottom: 30, color: "#7f8c8d" }}>La page que vous cherchez n&apos;existe pas ou a été déplacée.</p>
      <Link href="/" className="btn btn-primary">Retour à l&apos;accueil</Link>
    </div>
  )
}
