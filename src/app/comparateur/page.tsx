import { supabase } from "@/lib/supabase"
import CompareList from "@/components/CompareList"

export default async function ComparateurPage() {
  return (
    <section className="listings-section">
      <h1 style={{ marginBottom: 20 }}>📊 Comparateur d'annonces</h1>
      <p style={{ marginBottom: 20, color: "#7f8c8d" }}>
        Ajoutez des annonces aux favoris, puis comparez-les ici.
      </p>
      <CompareList />
    </section>
  );
}
