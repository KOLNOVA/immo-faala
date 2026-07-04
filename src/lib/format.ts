/**
 * Formate un nombre en chaîne avec des espaces comme séparateurs de milliers.
 * Exemple : 15000 => "15 000"
 */
export function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}
