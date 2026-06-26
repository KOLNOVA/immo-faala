import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = 12;
  const start = (page - 1) * perPage;
  const end = start + perPage - 1;

  const query = searchParams.get("q") || "";
  const city = searchParams.get("city") || "";
  const district = searchParams.get("district") || "";
  const propertyType = searchParams.get("type") || "";
  const minPrice = searchParams.get("min_price") || "";
  const maxPrice = searchParams.get("max_price") || "";
  const rooms = searchParams.get("rooms") || "";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let supabaseQuery = supabase.from("Listing").select("*, images:ListingImage(*)", { count: "exact" }).eq("status", "active").eq("isVerified", false);

  if (query) supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%,city.ilike.%${query}%,district.ilike.%${query}%`);
  if (city) supabaseQuery = supabaseQuery.ilike("city", `%${city}%`);
  if (district) supabaseQuery = supabaseQuery.ilike("district", `%${district}%`);
  if (propertyType) supabaseQuery = supabaseQuery.eq("propertyType", propertyType);
  if (minPrice) supabaseQuery = supabaseQuery.gte("price", parseInt(minPrice));
  if (maxPrice) supabaseQuery = supabaseQuery.lte("price", parseInt(maxPrice));
  if (rooms) supabaseQuery = supabaseQuery.gte("rooms", parseInt(rooms));

  const { data, count } = await supabaseQuery.order("createdAt", { ascending: false }).range(start, end);

  return Response.json({
    listings: data || [],
    hasMore: count ? start + perPage < count : false,
  });
}
