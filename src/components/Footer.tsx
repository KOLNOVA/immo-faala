import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2026 Immo-Faala. Tous droits réservés.</p>
      <p>Trouvez votre logement sans intermédiaires abusifs.</p>
      <p>
        <Link href="/compte/mentions-legales">Mentions légales</Link> |{" "}
        <Link href="/compte/cgu">Conditions d&apos;utilisation</Link>
      </p>
    </footer>
  );
}
