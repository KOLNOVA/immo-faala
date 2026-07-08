import { sendPaymentConfirmation } from "@/services/payment-confirmation";
import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { createTransaction } from "@/services/fedapay"

export async function POST() {
  const session = await auth()
  if (!session) return Response.json({ error: "Non connecté" }, { status: 401 })

  console.log("Creating transaction for", session.user?.phone)
  const result = await createTransaction(
    500,
    {
      name: session.user?.name || "Client",
      email: session.user?.email || "",
      phone: session.user?.phone || "",
    },
    `${process.env.SITE_URL}/paiement/callback`
  )
  console.log("Transaction result:", result)

  if (result.success) {
    await supabase.from("User").update({
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
      isPremium: true,
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
      premiumDate: new Date().toISOString(),
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
    }).eq("id", session.user.id)
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}

    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
    await supabase.from("Transaction").insert({
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
      type: "verification",
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
      amount: 500,
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
      status: "success",
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
      transactionId: result.transactionId,
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
      userId: session.user.id,
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
      completedAt: new Date().toISOString(),
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
    })
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}

    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
    return Response.json({ success: true, message: "Badge Premium activé" })
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
  }
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}

    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
  if (result.paymentUrl) {
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
    await supabase.from("Transaction").insert({
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
      type: "verification",
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
      amount: 500,
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
      status: "pending",
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
      transactionId: result.transactionId,
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
      userId: session.user.id,
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
    })
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
    return Response.json({ redirect: result.paymentUrl })
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
  }
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}

    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
  return Response.json({ error: result.message }, { status: 500 })
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
}
    try { await sendPaymentConfirmation(session.user?.email || "", "Badge Premium", 500); } catch(e) {}
