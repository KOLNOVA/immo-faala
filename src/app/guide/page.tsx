export default function GuidePage() {
  return (
    <div className="legal-container" style={{ maxWidth: 900, margin: "40px auto", padding: 30, background: "white", borderRadius: 12 }}>
      <h1>📖 Guide du Locataire</h1>
      <p style={{ color: "#7f8c8d", marginBottom: 30 }}>
        Tout ce que vous devez savoir pour louer un logement en toute sérénité en Afrique de l&apos;Ouest.
      </p>

      <h2>1. Avant de chercher</h2>
      <ul>
        <li><strong>Définissez votre budget</strong> : loyer + charges ≤ 30% de vos revenus</li>
        <li><strong>Choisissez votre quartier</strong> : proximité travail, transports, écoles</li>
        <li><strong>Listez vos critères</strong> : nombre de chambres, meublé, parking, etc.</li>
      </ul>

      <h2>2. Pendant la visite</h2>
      <ul>
        <li><strong>Vérifiez l&apos;état général</strong> : murs, plafonds, fenêtres, sanitaires</li>
        <li><strong>Testez les équipements</strong> : électricité, eau, climatisation</li>
        <li><strong>Posez des questions</strong> : charges incluses ? Qui paie l&apos;eau et l&apos;électricité ?</li>
        <li><strong>Prenez des photos</strong> : elles serviront pour l&apos;état des lieux</li>
      </ul>

      <h2>3. Les documents à fournir</h2>
      <ul>
        <li>Pièce d&apos;identité (carte, passeport)</li>
        <li>Justificatif de revenus (3 derniers bulletins de salaire)</li>
        <li>Caution (généralement 2 mois de loyer)</li>
        <li>Avance (généralement 1 mois de loyer)</li>
      </ul>

      <h2>4. Le contrat de bail</h2>
      <ul>
        <li><strong>Durée</strong> : généralement 1 an renouvelable</li>
        <li><strong>Préavis</strong> : 1 à 3 mois selon le contrat</li>
        <li><strong>Révision du loyer</strong> : encadrée par la loi</li>
        <li><strong>État des lieux</strong> : obligatoire à l&apos;entrée et à la sortie</li>
      </ul>

      <h2>5. Éviter les arnaques</h2>
      <ul>
        <li>✅ <strong>Vérifiez l&apos;identité</strong> du propriétaire</li>
        <li>✅ <strong>Ne payez rien</strong> avant d&apos;avoir visité</li>
        <li>✅ <strong>Privilégiez les annonces vérifiées</strong> 🏅 sur Immo-Faala</li>
        <li>✅ <strong>Signalez</strong> toute annonce suspecte</li>
        <li>❌ Ne versez jamais d&apos;argent via Mobile Money à un inconnu</li>
      </ul>

      <h2>6. Après l&apos;emménagement</h2>
      <ul>
        <li>Déclarez votre nouvelle adresse</li>
        <li>Souscrivez une assurance habitation</li>
        <li>Respectez le règlement de copropriété</li>
        <li>Payez votre loyer à temps</li>
      </ul>
    </div>
  );
}
