import Link from "next/link";

export default function BoostSuggestion({ listingId, viewsCount }: { listingId: string; viewsCount: number }) {
  if (viewsCount > 10) return null;

  return (
    <div style={{
      background: "#fef3cd",
      border: "1px solid #f39c12",
      borderRadius: 10,
      padding: 15,
      marginTop: 15,
      textAlign: "center"
    }}>
      <p style={{ marginBottom: 10 }}>
        📈 <strong>Boostez cette annonce</strong> pour 3x plus de visibilité !
      </p>
      <Link href={`/booster/${listingId}`} className="btn btn-primary btn-small">
        🚀 Booster maintenant (1000 FCFA)
      </Link>
    </div>
  );
}
