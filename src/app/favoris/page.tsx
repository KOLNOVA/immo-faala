import { supabase } from "@/lib/supabase"
import Link from "next/link"
import FavoritesList from "@/components/FavoritesList"

export default function FavoritesPage() {
  return (
    <section className="listings-section">
      <h1 style={{ marginBottom: 20 }}>❤️ Mes Favoris</h1>
      <FavoritesList />
    </section>
  );
}
