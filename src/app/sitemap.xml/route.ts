import { createClient } from "@supabase/supabase-js"

export async function GET() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const siteUrl = process.env.SITE_URL || "https://immo-faala.vercel.app"

  // Pages statiques
  const staticPages = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/recherche", priority: "0.9", changefreq: "daily" },
    { url: "/compte/connexion", priority: "0.8", changefreq: "monthly" },
    { url: "/compte/inscription", priority: "0.8", changefreq: "monthly" },
    { url: "/villes", priority: "0.7", changefreq: "weekly" },
    { url: "/blog", priority: "0.7", changefreq: "weekly" },
    { url: "/compte/mentions-legales", priority: "0.3", changefreq: "yearly" },
    { url: "/compte/cgu", priority: "0.3", changefreq: "yearly" },
  ]

  // Annonces actives
  const { data: listings } = await supabase
    .from("Listing")
    .select("id, updatedAt")
    .eq("status", "active")
    .order("createdAt", { ascending: false })

  // Quartiers
  const { data: districts } = await supabase
    .from("Listing")
    .select("city, district")
    .eq("status", "active")
    .order("city")

  const uniqueDistricts = [...new Map(districts?.map((d: any) => [`${d.city}-${d.district}`, d])).values()]

  // Articles blog
  const { data: articles } = await supabase
    .from("Article")
    .select("slug, updatedAt")
    .eq("published", true)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map((p) => `
  <url>
    <loc>${siteUrl}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("")}
  ${listings?.map((l: any) => `
  <url>
    <loc>${siteUrl}/annonce/${l.id}</loc>
    <lastmod>${new Date(l.updatedAt).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join("")}
  ${uniqueDistricts.map((d: any) => `
  <url>
    <loc>${siteUrl}/quartier/${d.city.toLowerCase().replace(/\s+/g, "-")}/${d.district.toLowerCase().replace(/\s+/g, "-")}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join("")}
  ${articles?.map((a: any) => `
  <url>
    <loc>${siteUrl}/blog/${a.slug}</loc>
    <lastmod>${new Date(a.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join("")}
</urlset>`

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  })
}
