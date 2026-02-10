import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});


import { Toaster } from "@/components/ui/toaster";
import { WhatsAppFloatingButton } from "@/components/whatsapp-button";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Barbearia do Moura | Agendamento Online",
    template: "%s | Barbearia do Moura",
  },
  description:
    "Agende seu horário na Barbearia do Moura. Cortes de cabelo, barba e tratamentos com profissionais especializados em Mauá-SP. Agendamento online 24/7.",
  keywords: [
    "barbearia",
    "corte de cabelo",
    "barba",
    "agendamento online",
    "Mauá",
    "São Paulo",
    "barbeiro",
  ],
  authors: [{ name: "Barbearia do Moura" }],
  creator: "Barbearia do Moura",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://barbeariadomoura.vercel.app",
    siteName: "Barbearia do Moura",
    title: "Barbearia do Moura | Agendamento Online",
    description:
      "Agende seu horário na Barbearia do Moura. Cortes de cabelo, barba e tratamentos com profissionais especializados.",
  },
  twitter: {
    card: "summary",
    title: "Barbearia do Moura | Agendamento Online",
    description: "Agende seu horário na melhor barbearia de Mauá-SP.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#121212",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
    >
      <head>
        {/* Schema.org para LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BarberShop",
              name: "Barbearia do Moura",
              description:
                "Barbearia especializada em cortes masculinos e barba em Mauá-SP",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Mauá",
                addressRegion: "SP",
                addressCountry: "BR",
              },
              priceRange: "$$",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "09:00",
                  closes: "20:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Saturday",
                  opens: "09:00",
                  closes: "18:00",
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`min-h-screen bg-background font-sans antialiased ${roboto.variable}`}>
        {children}
        <Toaster />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
