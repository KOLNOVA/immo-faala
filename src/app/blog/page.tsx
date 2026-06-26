import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default async function BlogPage() {
  const { data: articles } = await supabase
    .from("Article")
    .select("*")
    .eq("published", true)
    .order("createdAt", { ascending: false })

  return (
    <>
      <section className="hero-small">
        <div className="hero-content">
          <h1>📝 Blog Immo-Faala</h1>
          <p>Conseils, astuces et actualités immobilières en Afrique de l&apos;Ouest</p>
        </div>
      </section>

      <section className="listings-section">
        <div className="listings-grid">
          {articles?.map((article: any) => (
            <Link key={article.id} href={`/blog/${article.slug}`} className="listing-card">
              {article.image ? (
                <img src={article.image} alt={article.title} className="listing-image" />
              ) : (
                <div className="listing-image-placeholder">📝 Article</div>
              )}
              <div className="listing-info">
                <h3>{article.title}</h3>
                <p style={{ fontSize: "0.9em", color: "#555" }}>{article.excerpt?.substring(0, 120)}</p>
                <p style={{ fontSize: "0.8em", color: "#999" }}>{new Date(article.createdAt).toLocaleDateString("fr-FR")}</p>
                <span className="btn btn-small">Lire</span>
              </div>
            </Link>
          ))}
          {(!articles || articles.length === 0) && (
            <p style={{ gridColumn: "1/-1", textAlign: "center" }}>Aucun article pour le moment.</p>
          )}
        </div>
      </section>
    </>
  )
}
