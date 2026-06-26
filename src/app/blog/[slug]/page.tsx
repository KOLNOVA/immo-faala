import { supabase } from "@/lib/supabase"

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { data: article } = await supabase
    .from("Article")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .single()

  if (!article) return <p style={{ textAlign: "center", padding: 50 }}>Article introuvable.</p>

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
          <img src={article.image} alt={article.title} style={{ width: "100%", maxHeight: 400, objectFit: "cover", borderRadius: 10, marginBottom: 20 }} />
        )}
        <div style={{ whiteSpace: "pre-line" }}>{article.content}</div>
      </section>
    </>
  )
}
