"use client";

export default function ShareButton({ title, price, url }: { title: string; price: number; url: string }) {
  function handleShare() {
    const text = `🏠 ${title}\n💰 ${price.toLocaleString()} FCFA\n🔗 ${url}\n\nVia Immo-Faala`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  }

  return (
    <button onClick={handleShare} className="btn btn-whatsapp" style={{ width: "100%", textAlign: "center" }}>
      📤 Partager sur WhatsApp
    </button>
  );
}
