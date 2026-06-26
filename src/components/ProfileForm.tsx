"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileForm({ user }: { user: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    await fetch("/api/user/update", {
      method: "PUT",
      body: JSON.stringify({
        displayName: formData.get("display_name"),
        username: formData.get("username"),
        email: formData.get("email"),
        whatsappNumber: formData.get("whatsapp_number"),
        bio: formData.get("bio"),
      }),
      headers: { "Content-Type": "application/json" },
    });

    router.refresh();
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="listing-form">
      <div className="form-group" style={{ textAlign: "center" }}>
        {user?.profilePicture ? (
          <img src={user.profilePicture} alt="Photo profil" style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", marginBottom: 10 }} />
        ) : (
          <div style={{ width: 100, height: 100, borderRadius: "50%", background: "#ecf0f1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "2.5em", marginBottom: 10 }}>👤</div>
        )}
        <br />
        <label style={{ cursor: "pointer", color: "#3498db", fontWeight: "bold" }}>
          📷 Changer la photo de profil
          <input type="file" name="profile_picture" accept="image/*" style={{ display: "none" }} />
        </label>
      </div>

      <hr style={{ margin: "20px 0" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
        <div className="form-group">
          <label>Nom public affiché</label>
          <input type="text" name="display_name" defaultValue={user?.displayName || ""} className="form-input" />
        </div>
        <div className="form-group">
          <label>Nom d&apos;utilisateur</label>
          <input type="text" name="username" defaultValue={user?.username || ""} required className="form-input" />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
        <div className="form-group">
          <label>Téléphone principal</label>
          <input type="text" defaultValue={user?.phone || ""} className="form-input" disabled />
          <small style={{ color: "#999" }}>Le téléphone ne peut pas être modifié</small>
        </div>
        <div className="form-group">
          <label>Numéro WhatsApp</label>
          <input type="text" name="whatsapp_number" defaultValue={user?.whatsappNumber || ""} className="form-input" />
        </div>
      </div>

      <div className="form-group">
        <label>Email</label>
        <input type="email" name="email" defaultValue={user?.email || ""} className="form-input" />
      </div>

      <div className="form-group">
        <label>À propos de vous</label>
        <textarea name="bio" rows={3} defaultValue={user?.bio || ""} className="form-input" placeholder="Parlez brièvement de vous ou de votre agence..." />
        <small style={{ color: "#999" }}>Maximum 300 caractères</small>
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
        {loading ? "Enregistrement..." : "Enregistrer les modifications"}
      </button>
    </form>
  )
}
