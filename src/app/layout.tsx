import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Immo-Faala - La manière moderne de louer",
  description: "Trouvez votre logement sans intermédiaires abusifs en Afrique de l'Ouest.",
  icons: {
    icon: "/favicon.png",
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Immo-Faala" />
        <link rel="apple-touch-icon" href="/images/logo-icon.jpg" />
      </head>
      <body className="min-h-screen flex flex-col">
        
        <Navbar />
        <main className="flex-1">{children}</main>
        
        <Footer />
      </body>
    </html>
  );
}
