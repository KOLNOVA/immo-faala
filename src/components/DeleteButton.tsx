"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ listingId }: { listingId: string }) {
  const router = useRouter();

  async function handleDelete() {
    await fetch(`/api/listings/${listingId}`, { method: "DELETE" });
    router.push("/dashboard");
  }

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
      <button onClick={handleDelete} className="btn btn-danger" style={{ background: "#e74c3c", color: "white" }}>
        Supprimer définitivement
      </button>
      <a href="/dashboard" className="btn btn-secondary">Annuler</a>
    </div>
  )
}
