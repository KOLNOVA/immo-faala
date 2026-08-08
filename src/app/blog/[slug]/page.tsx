import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: article } = await supabase
    .from("Article")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (!article) {
    return (
      <section className="legal-container">
        <h1>Article introuvable</h1>
        <p>L&apos;article que vous cherchez n&apos;existe pas ou a été retiré.</p>
        <Link href="/blog" className="btn btn-primary">Retour au blog</Link>
      </section>
    )
  }

  return (
    <>
      <section className="hero-small">
        <div className="hero-content">
          <h1>{article.title}</h1>
          <p>{new Date(article.createdAt).toLocaleDateString("fr-FR")}</p>
        </div>
      </section>
      <section className="legal-container">
        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            style={{ width: "100%", maxHeight: 400, objectFit: "cover", borderRadius: 10, marginBottom: 20 }}
          />
        )}
        <div dangerouslySetInnerHTML={{ __html: article.content }} />

        <div style={{ marginTop: 40, textAlign: "center", padding: 20, background: "#f0f8ff", borderRadius: 10 }}>
          <p style={{ fontSize: "1.1em", marginBottom: 15 }}>
            Prêt à trouver votre logement ?
          </p>
          <Link href="/recherche" className="btn btn-primary" style={{ marginRight: 10 }}>
            Voir les annonces
          </Link>
          <Link href="/compte/inscription" className="btn btn-secondary">
            Publier gratuitement
          </Link>
        </div>
      </section>
    </>
  )
}
