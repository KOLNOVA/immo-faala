"use client";

import { useRouter } from "next/navigation";

export default function AdminActions({ type, id, action, label }: { type: string; id: string; action: string; label: string }) {
  const router = useRouter();

  async function handleAction() {
    await fetch("/api/admin/action", {
      method: "POST",
      body: JSON.stringify({ type, id, action }),
      headers: { "Content-Type": "application/json" },
    });
    router.refresh();
  }

  const colors: Record<string, string> = {
    approve: "#27ae60",
    reject: "#e74c3c",
    resolve: "#3498db",
    activate: "#27ae60",
    deactivate: "#f39c12",
  };

  return (
    <button
      onClick={handleAction}
      className="btn btn-small"
      style={{ marginRight: 5, background: colors[action] || "#3498db", color: "white" }}
    >
      {label}
    </button>
  )
}
