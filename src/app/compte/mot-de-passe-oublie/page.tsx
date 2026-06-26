export default function PasswordResetRequest() {
  return (
    <div className="form-container">
      <h1>🔑 Mot de passe oublié</h1>
      <div className="listing-form">
        <p style={{ marginBottom: 20, textAlign: "center" }}>
          Entrez votre numéro de téléphone. Vous recevrez un code de réinitialisation par WhatsApp.
        </p>
        <form action="/compte/mot-de-passe-oublie/verification" method="POST">
          <div className="form-group">
            <label>Numéro de téléphone</label>
            <input type="text" name="phone" required placeholder="Ex: 22997000000" className="form-input" autoFocus />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Recevoir le code</button>
        </form>
        <p style={{ marginTop: 15, textAlign: "center" }}>
          <a href="/compte/connexion">Retour à la connexion</a>
        </p>
      </div>
    </div>
  )
}
