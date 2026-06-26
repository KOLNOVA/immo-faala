export default function UploadDocsPage() {
  return (
    <div className="form-container">
      <h1>Vérification du Compte</h1>
      <div className="listing-form">
        <p style={{ marginBottom: 20 }}>
          Pour obtenir le Badge Premium, téléchargez votre pièce d&apos;identité et un selfie.
        </p>
        <form action="/api/user/upload-docs" method="POST" encType="multipart/form-data">
          <div className="form-group">
            <label>Pièce d&apos;identité (Carte, Passeport, Permis)</label>
            <input type="file" name="id_document" accept="image/*" className="form-input" required />
          </div>
          <div className="form-group">
            <label>Selfie (photo de vous)</label>
            <input type="file" name="selfie" accept="image/*" className="form-input" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
            Envoyer pour vérification
          </button>
        </form>
        <p style={{ marginTop: 15 }}>
          <a href="/dashboard">Retour au dashboard</a>
        </p>
      </div>
    </div>
  )
}
