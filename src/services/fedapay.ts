export async function createTransaction(amount: number, customer: { name: string; email: string; phone: string }, callbackUrl: string) {
  const isSandbox = process.env.FEDAPAY_SANDBOX === "true"

  if (isSandbox) {
    return {
      success: true,
      transactionId: `IMMO-${Date.now()}`,
      message: "Paiement simulé (mode sandbox)",
    }
  }

  let phone = customer.phone.replace(/\s+/g, '').replace(/^\+/, '')
  if (!phone.startsWith('229')) phone = '229' + phone
  phone = '+' + phone

  try {
    const response = await fetch("https://api.fedapay.com/v1/transactions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.FEDAPAY_API_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount,
        currency: { iso: "XOF" },
        description: "Immo-Faala - Service Premium",
        callback_url: callbackUrl,
        customer: {
          firstname: customer.name || "Client",
          lastname: "ImmoFaala",
          email: customer.email,
          phone_number: {
            number: phone,
            country: "bj",
          },
        },
      }),
    })

    const data = await response.json()
    const tx = data["v1/transaction"] || data

    if (tx.id) {
      if (tx.status === "approved") {
        return { success: true, transactionId: tx.id, message: "Paiement approuvé" }
      }
      return {
        success: false,
        transactionId: tx.id,
        paymentUrl: tx.payment_url,
        message: "Redirection vers Fedapay...",
      }
    }

    return { success: false, message: data.message || "Erreur Fedapay" }
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
        "Authorization": `Bearer ${process.env.FEDAPAY_API_SECRET}`,
        "Content-Type": "application/json",
      },
    })
    const data = await response.json()
    const tx = data["v1/transaction"] || data
    return { success: true, status: tx.status }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}
