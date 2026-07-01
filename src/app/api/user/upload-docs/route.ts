import { auth } from "@/lib/auth"
import { uploadImage } from "@/services/cloudinary"

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: "Non connecté" }, { status: 401 })

  const formData = await request.formData()
  const idDoc = formData.get("id_document") as File
  const selfie = formData.get("selfie") as File

  const idDocUrl = idDoc ? await uploadImage(idDoc, "id-docs") : null
  const selfieUrl = selfie ? await uploadImage(selfie, "selfies") : null

  // Mettre à jour l'utilisateur via Supabase
  const { createClient } = await import("@supabase/supabase-js")
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  await supabase.from("User").update({
    idDocument: idDocUrl,
    selfie: selfieUrl,
  }).eq("id", session.user.id)

  return Response.json({ success: true })
}
