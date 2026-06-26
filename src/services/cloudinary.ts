import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(file: File, folder: string = "immo-faala"): Promise<string | null> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`

    const result = await cloudinary.uploader.upload(base64, {
      folder,
      resource_type: "auto",
      transformation: [
        { width: 1200, height: 1200, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    })

    return result.secure_url
  } catch (error) {
    console.error("Erreur upload Cloudinary:", error)
    return null
  }
}

export async function uploadMultipleImages(files: File[], folder: string = "immo-faala"): Promise<string[]> {
  const urls: string[] = []

  for (const file of files.slice(0, 5)) {
    const url = await uploadImage(file, folder)
    if (url) urls.push(url)
  }

  return urls
}
