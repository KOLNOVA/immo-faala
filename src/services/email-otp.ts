export async function storeAndSendOTP(email: string): Promise<boolean> {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? (process.env.SITE_URL || 'https://immofaala.com')
      : 'http://localhost:3000'
    
    const res = await fetch(`${baseUrl}/api/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    
    if (!res.ok) {
      return false
    }
    
    const data = await res.json()
    return data.success || false
  } catch (error) {
    console.error("Erreur appel API OTP:", error)
    return false
  }
}
