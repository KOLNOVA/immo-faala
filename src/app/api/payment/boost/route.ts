import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { createTransaction } from "@/services/fedapay"
import { sendPaymentConfirmation } from "@/services/payment-confirmation"

export async function POST(request: Request) {
  const session = await auth()
  if (!session) return Response.json({ error: "Non connecté" }, { status: 401 })

  const { listingId } = await request.json()

  const result = await createTransaction(
    1000,
    {
      name: session.user?.name || "Client",
      email: session.user?.email || "",
      phone: session.user?.phone || "",
    },
    `${process.env.SITE_URL}/paiement/callback`
  )

  if (result.success) {
    const boostUntil = new Date()
    boostUntil.setDate(boostUntil.getDate() + 7)

    await supabase.from("Listing").update({
      isBoosted: true,
      boostUntil: boostUntil.toISOString(),
    }).eq("id", listingId)

    await supabase.from("Transaction").insert({
      type: "boost",
      amount: 1000,
      status: "success",
      transactionId: result.transactionId,
      userId: session.user.id,
      completedAt: new Date().toISOString(),
    })

    try {
      await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000)
    } catch (e) {}

    return Response.json({ success: true, message: "Annonce boostée pour 7 jours" })
  }

  if (result.paymentUrl) {
    await supabase.from("Transaction").insert({
      type: "boost",
      amount: 1000,
      status: "pending",
      transactionId: result.transactionId,
      userId: session.user.id,
    })
    return Response.json({ redirect: result.paymentUrl })
  }

  return Response.json({ error: result.message }, { status: 500 })
}
