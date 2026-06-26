import { signIn } from "@/lib/auth"
import PasswordInput from "@/components/PasswordInput"

export default function LoginPage() {
  return (
    <div className="form-container">
      <h1>Connexion</h1>
      <form
        action={async (formData) => {
          "use server"
          await signIn("credentials", {
            phone: formData.get("phone") as string,
            password: formData.get("password") as string,
            redirectTo: "/dashboard",
          })
        }}
        className="listing-form"
      >
        <div className="form-group">
          <label>Téléphone</label>
          <input type="text" name="phone" required placeholder="Votre numéro de téléphone" className="form-input" autoFocus />
        </div>
        <PasswordInput name="password" id="password" placeholder="Votre mot de passe" required />
        <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Se connecter</button>
        <p style={{ marginTop: 15, textAlign: "center" }}>
          <a href="/compte/mot-de-passe-oublie">Mot de passe oublié ?</a>
        </p>
        <p style={{ textAlign: "center" }}>
          Pas encore de compte ? <a href="/compte/inscription">S&apos;inscrire</a>
        </p>
      </form>
    </div>
  );
}
