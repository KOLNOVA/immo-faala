import { auth } from "@/lib/auth"
import { uploadMultipleImages } from "@/services/cloudinary"

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: "Non connecté" }, { status: 401 })

  const formData = await request.formData()
  const files = formData.getAll("images") as File[]

  const urls = await uploadMultipleImages(files)

  return Response.json({ urls })
}
