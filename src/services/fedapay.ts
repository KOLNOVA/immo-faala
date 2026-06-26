export async function createTransaction(amount: number, customer: { name: string; email: string; phone: string }, callbackUrl: string) {
  const isSandbox = process.env.FEDAPAY_SANDBOX === "true"

  if (isSandbox) {
    return {
      success: true,
      transactionId: `IMMO-${Date.now()}`,
      message: "Paiement simulé (mode sandbox)",
    }
  }

  try {
    const response = await fetch("https://api.fedapay.com/v1/transactions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.FEDAPAY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount,
        currency: { iso: "XOF" },
        description: "Immo-Faala - Service Premium",
        callback_url: callbackUrl,
        customer: {
          firstname: customer.name,
          lastname: "Client",
          email: customer.email,
          phone_number: {
            number: customer.phone,
            country: "bj",
          },
        },
      }),
    })

    const data = await response.json()

    if (data.status === "approved") {
      return { success: true, transactionId: data.id, message: "Paiement approuvé" }
    }

    return {
      success: false,
      transactionId: data.id,
      paymentUrl: data.payment_url,
      message: "Redirection vers Fedapay...",
    }
  } catch (error: any) {
    return { success: false, message: error.message || "Erreur de paiement" }
  }
}

export async function verifyTransaction(transactionId: string) {
  if (process.env.FEDAPAY_SANDBOX === "true") {
    return { success: true, status: "approved" }
  }

  try {
    const response = await fetch(`https://api.fedapay.com/v1/transactions/${transactionId}`, {
      headers: {
        "Authorization": `Bearer ${process.env.FEDAPAY_API_KEY}`,
        "Content-Type": "application/json",
      },
    })
    const data = await response.json()
    return { success: true, status: data.status }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}
