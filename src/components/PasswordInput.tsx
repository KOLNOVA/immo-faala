"use client";

import { useState } from "react";

export default function PasswordInput({ name, id, placeholder, required, minLength }: {
  name: string;
  id: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="form-group" style={{ position: "relative" }}>
      <label>Mot de passe{required ? " *" : ""}</label>
      <input
        type={visible ? "text" : "password"}
        name={name}
        id={id}
        required={required}
        placeholder={placeholder}
        className="form-input"
        minLength={minLength}
        style={{ paddingRight: 45 }}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        style={{
          position: "absolute",
          right: 12,
          bottom: 12,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "1.2em",
          color: "#7f8c8d",
          padding: 0,
        }}
        aria-label="Afficher le mot de passe"
      >
        {visible ? "🙈" : "👁️"}
      </button>
    </div>
  );
}
