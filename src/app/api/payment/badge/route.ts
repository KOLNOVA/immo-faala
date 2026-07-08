import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { createTransaction } from "@/services/fedapay"
import { sendPaymentConfirmation } from "@/services/payment-confirmation"

export async function POST() {
  const session = await auth()
  if (!session) return Response.json({ error: "Non connecté" }, { status: 401 })

  const result = await createTransaction(
    500,
    {
      name: session.user?.name || "Client",
      email: session.user?.email || "",
      phone: session.user?.phone || "",
    },
    `${process.env.SITE_URL}/paiement/callback`
  )

  if (result.success) {
    await supabase.from("User").update({
      isPremium: true,
      premiumDate: new Date().toISOString(),
    }).eq("id", session.user.id)

    await supabase.from("Transaction").insert({
      type: "verification",
      amount: 500,
      status: "success",
      transactionId: result.transactionId,
      userId: session.user.id,
      completedAt: new Date().toISOString(),
    })

    try {
      await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500)
    } catch (e) {}

    return Response.json({ success: true, message: "Badge Premium activé" })
  }

  if (result.paymentUrl) {
    await supabase.from("Transaction").insert({
      type: "verification",
      amount: 500,
      status: "pending",
      transactionId: result.transactionId,
      userId: session.user.id,
    })
    return Response.json({ redirect: result.paymentUrl })
  }

  return Response.json({ error: result.message }, { status: 500 })
}
