"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

export default function PublishForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    let imageUrls: string[] = [];

    // Upload des images si présentes
    if (files.length > 0) {
      const uploadFormData = new FormData();
      files.forEach((file) => uploadFormData.append("images", file));

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });
      const uploadData = await uploadRes.json();
      imageUrls = uploadData.urls || [];
    }

    // Créer l'annonce
    const res = await fetch("/api/listings/create", {
      method: "POST",
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
        latitude: lat ? parseFloat(lat) : null,
        longitude: lng ? parseFloat(lng) : null,
        userId,
        images: imageUrls,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="listing-form">
      <div className="form-group">
        <label>Titre *</label>
        <input type="text" name="title" required placeholder="Ex: Bel appartement meublé à Cotonou" className="form-input" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
        <div className="form-group">
          <label>Prix (FCFA) *</label>
          <input type="number" name="price" required placeholder="Ex: 50000" className="form-input" />
        </div>
        <div className="form-group">
          <label>Type de bien *</label>
          <select name="property_type" required className="form-input">
            <option value="">Choisir...</option>
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
          <label>Ville *</label>
          <input type="text" name="city" required placeholder="Ex: Cotonou" className="form-input" />
        </div>
        <div className="form-group">
          <label>Quartier *</label>
          <input type="text" name="district" required placeholder="Ex: Akpakpa" className="form-input" />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
        <div className="form-group">
          <label>Nombre de chambres</label>
          <input type="number" name="rooms" defaultValue={1} min={1} className="form-input" />
        </div>
        <div className="form-group" style={{ display: "flex", alignItems: "center", paddingTop: 25 }}>
          <input type="checkbox" name="furnished" id="furnished" style={{ marginRight: 8 }} />
          <label htmlFor="furnished" style={{ margin: 0 }}>Meublé</label>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
        <div className="form-group">
          <label>Caution (FCFA)</label>
          <input type="number" name="caution" placeholder="Ex: 50000" className="form-input" />
        </div>
        <div className="form-group">
          <label>Avance (FCFA)</label>
          <input type="number" name="advance" placeholder="Ex: 25000" className="form-input" />
        </div>
      </div>

      <div className="form-group">
        <label>Date de disponibilité</label>
        <input type="date" name="available_date" className="form-input" />
      </div>

      <div className="form-group">
        <label>Description *</label>
        <textarea name="description" rows={5} required placeholder="Décrivez votre bien en détail..." className="form-input" />
      </div>

      <div className="form-group">
        <label>Photos (max 5)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
          className="form-input"
        />
        {files.length > 0 && <small style={{ color: "#999" }}>{files.length} fichier(s) sélectionné(s)</small>}
      </div>

      <div className="form-group">
        <label>Emplacement sur la carte (cliquez pour positionner)</label>
        <MapPicker onLocationChange={(latitude, longitude) => { setLat(latitude); setLng(longitude); }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginTop: 10 }}>
          <input type="text" placeholder="Latitude" value={lat} readOnly className="form-input" />
          <input type="text" placeholder="Longitude" value={lng} readOnly className="form-input" />
        </div>
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
        {loading ? "Publication..." : "Publier l'annonce"}
      </button>
    </form>
  )
}
