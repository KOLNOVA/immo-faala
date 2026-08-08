"use client";

import { useState, useEffect } from "react";

export default function InstallBanner() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fermé la bannière
    const closed = localStorage.getItem("installBannerClosed");
    if (closed) return;

    // Vérifier si déjà installé
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // Écouter l'événement beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setShow(false);
      localStorage.setItem("installBannerClosed", "true");
    }
    
    setDeferredPrompt(null);
  }

  function handleClose() {
    setShow(false);
    setDismissed(true);
    // Rappeler dans 3 jours
    const remind = new Date();
    remind.setDate(remind.getDate() + 3);
    localStorage.setItem("installBannerRemind", remind.toISOString());
  }

  if (!show || dismissed) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: "linear-gradient(135deg, #1a2a3a, #2c5f8a)",
      color: "white",
      padding: "15px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 15,
      zIndex: 9998,
      boxShadow: "0 -4px 20px rgba(0,0,0,0.3)",
      flexWrap: "wrap",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 200 }}>
        <img
          src="/images/logo-icon.jpg"
          alt="Immo-Faala"
          style={{ width: 45, height: 45, borderRadius: 8, objectFit: "cover" }}
        />
        <div>
          <p style={{ fontWeight: 700, fontSize: "1em", margin: 0 }}>Installer Immo-Faala</p>
          <p style={{ fontSize: "0.8em", opacity: 0.8, margin: "2px 0 0" }}>
            Ajoutez l&apos;application à votre écran d&apos;accueil
          </p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={handleInstall}
          style={{
            background: "#27ae60",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          📲 Installer
        </button>
        <button
          onClick={handleClose}
          style={{
            background: "transparent",
            color: "white",
            border: "none",
            padding: "10px",
            cursor: "pointer",
            fontSize: "1.2em",
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
