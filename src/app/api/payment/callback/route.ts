import { supabase } from "@/lib/supabase"
import { verifyTransaction } from "@/services/fedapay"

export async function POST(request: Request) {
  const body = await request.json()
  
  if (body.transaction_id) {
    const result = await verifyTransaction(body.transaction_id)

    if (result.success && result.status === "approved") {
      await supabase.from("Transaction").update({
        status: "success",
        completedAt: new Date().toISOString(),
      }).eq("transactionId", body.transaction_id)
    }
  }

  return Response.json({ received: true })
}
