import { sendPaymentConfirmation } from "@/services/payment-confirmation";
import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { createTransaction } from "@/services/fedapay"

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
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
      isBoosted: true,
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
      boostUntil: boostUntil.toISOString(),
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
    }).eq("id", listingId)
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}

    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
    await supabase.from("Transaction").insert({
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
      type: "boost",
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
      amount: 1000,
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
      status: "success",
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
      transactionId: result.transactionId,
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
      userId: session.user.id,
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
      completedAt: new Date().toISOString(),
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
    })
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}

    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
    return Response.json({ success: true, message: "Annonce boostée pour 7 jours" })
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
  }
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}

    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
  if (result.paymentUrl) {
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
    await supabase.from("Transaction").insert({
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
      type: "boost",
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
      amount: 1000,
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
      status: "pending",
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
      transactionId: result.transactionId,
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
      userId: session.user.id,
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
    })
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
    return Response.json({ redirect: result.paymentUrl })
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
  }
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}

    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
  return Response.json({ error: result.message }, { status: 500 })
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
}
    try { await sendPaymentConfirmation(session.user?.email || "", "Boost annonce", 1000); } catch(e) {}
