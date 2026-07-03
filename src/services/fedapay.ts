export async function createTransaction(amount: number, customer: { name: string; email: string; phone: string }, callbackUrl: string) {
  const isSandbox = process.env.FEDAPAY_SANDBOX === "true"

  if (isSandbox) {
    return {
      success: true,
      transactionId: `IMMO-${Date.now()}`,
      message: "Paiement simulé (mode sandbox)",
    }
  }

  // Formater le numéro de téléphone au format international
  let phone = customer.phone.replace(/\s+/g, '').replace(/^\+/, '')
  if (!phone.startsWith('229')) {
    phone = '229' + phone
  }
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

    // Si la réponse contient un id de transaction
    if (data.id) {
      if (data.status === "approved") {
        return { success: true, transactionId: data.id, message: "Paiement approuvé" }
      }
      // Transaction créée mais en attente de paiement
      return {
        success: false,
        transactionId: data.id,
        paymentUrl: data.payment_url,
        message: "Redirection vers Fedapay...",
      }
    }

    // Si erreur de validation
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
    return { success: true, status: data.status }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}
