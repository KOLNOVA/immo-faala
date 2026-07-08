import { sendWelcomeEmail } from "@/services/welcome-email";
import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { verifyOTP, storeAndSendOTP } from "@/services/email-otp"

export default function VerifyPage({ searchParams }: { searchParams: { email?: string; resend?: string } }) {
  const email = searchParams?.email || ""

  async function verify(formData: FormData) {
    "use server"
    const email = formData.get("email") as string
    const code = formData.get("otp_code") as string

    const result = await verifyOTP(email, code)

    if (result.success) {
      await supabase.from("User").update({ isActive: true }).eq("email", email)
      redirect("/compte/connexion")
    } else {
      redirect(`/compte/verification?email=${encodeURIComponent(email)}&error=${encodeURIComponent(result.message)}`)
    }
  }

  async function resendOTP() {
    "use server"
    if (email) {
      await storeAndSendOTP(email)
    }
    redirect(`/compte/verification?email=${encodeURIComponent(email)}`)
  }

  return (
    <div className="form-container">
      <h1>📱 Vérification du compte</h1>
      <div className="listing-form">
        <p style={{ textAlign: "center", marginBottom: 10 }}>
          Un code a été envoyé à : <strong>{email || "votre email"}</strong>
        </p>
        <p style={{ textAlign: "center", color: "#999", marginBottom: 20 }}>
          Vérifiez votre boîte de réception (et les spams).
        </p>

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <p style={{ color: "#555" }}>⏱️ Le code expire dans :</p>
          <span style={{ fontSize: "1.5em", fontWeight: "bold", color: "#e74c3c" }}>10:00</span>
        </div>

        <form action={verify}>
          <input type="hidden" name="email" value={email} />
          <div className="form-group">
            <label>Code de vérification</label>
            <input
              type="text"
              name="otp_code"
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
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Vérifier mon compte</button>
        </form>

        <form action={resendOTP} style={{ marginTop: 15, textAlign: "center" }}>
          <button type="submit" style={{ background: "none", border: "none", color: "#3498db", cursor: "pointer", textDecoration: "underline" }}>
            📩 Renvoyer le code
          </button>
        </form>
        <p style={{ textAlign: "center", color: "#999", fontSize: "0.85em", marginTop: 10 }}>
          Le code est valable 10 minutes. Vous avez 3 tentatives maximum.
        </p>
      </div>
    </div>
  );
}
