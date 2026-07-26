import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExitPopup from "@/components/ExitPopup";
import PWAProvider from "@/components/PWAProvider";

export const metadata: Metadata = {
  title: "Immo-Faala - La manière moderne de louer",
  description: "Trouvez votre logement sans intermédiaires abusifs en Afrique de l'Ouest.",
  icons: {
    icon: "/favicon.png",
    apple: "/images/logo-icon.jpg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Immo-Faala",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta name="theme-color" content="#1a2a3a" />
        <link rel="apple-touch-icon" href="/images/logo-icon.jpg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
      </head>
      <body className="min-h-screen flex flex-col">
        <PWAProvider />
        <Navbar />
        <main className="flex-1">{children}</main>
        <ExitPopup />
        <Footer />
      </body>
    </html>
  );
}
