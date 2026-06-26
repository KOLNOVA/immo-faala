"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditForm({ listing }: { listing: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    await fetch(`/api/listings/${listing.id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        price: parseInt(formData.get("price") as string),
        propertyType: formData.get("property_type"),
        city: formData.get("city"),
        district: formData.get("district"),
        rooms: parseInt(formData.get("rooms") as string) || 1,
        furnished: formData.get("furnished") === "on",
        caution: formData.get("caution") ? parseInt(formData.get("caution") as string) : null,
        advance: formData.get("advance") ? parseInt(formData.get("advance") as string) : null,
        availableDate: formData.get("available_date") || null,
      }),
      headers: { "Content-Type": "application/json" },
    });

    router.push("/dashboard");
  }

  async function handleDelete() {
    if (!confirm("Supprimer définitivement cette annonce ?")) return;
    await fetch(`/api/listings/${listing.id}`, { method: "DELETE" });
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="listing-form">
      <div className="form-group">
        <label>Titre</label>
        <input type="text" name="title" required defaultValue={listing.title} className="form-input" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
        <div className="form-group">
          <label>Prix (FCFA)</label>
          <input type="number" name="price" required defaultValue={listing.price} className="form-input" />
        </div>
        <div className="form-group">
          <label>Type de bien</label>
          <select name="property_type" defaultValue={listing.propertyType} className="form-input">
            <option value="maison">Maison</option>
            <option value="appartement">Appartement</option>
            <option value="studio">Studio</option>
            <option value="chambre">Chambre</option>
            <option value="parcelle">Parcelle</option>
          </select>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
        <div className="form-group">
          <label>Ville</label>
          <input type="text" name="city" required defaultValue={listing.city} className="form-input" />
        </div>
        <div className="form-group">
          <label>Quartier</label>
          <input type="text" name="district" required defaultValue={listing.district} className="form-input" />
        </div>
      </div>
      <div className="form-group">
        <label>Chambres</label>
        <input type="number" name="rooms" defaultValue={listing.rooms} min={1} className="form-input" />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea name="description" rows={5} defaultValue={listing.description} className="form-input" />
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
        <button type="button" onClick={handleDelete} className="btn btn-danger" style={{ flex: 1, background: "#e74c3c", color: "white" }}>
          Supprimer
        </button>
      </div>
    </form>
  )
}
