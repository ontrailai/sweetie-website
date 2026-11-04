import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { body, heading } from "./fonts";
import { SITE } from "@/lib/site";
import { MotionPreferenceProvider, motionBootScript } from "@/components/motion/MotionPreference";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.legalName} · Raw honey from San Diego County`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ["raw honey", "local honey", "San Diego honey", "small batch honey", "honey subscription", "Sweet Bee"],
  openGraph: {
    type: "website",
    siteName: SITE.legalName,
    locale: "en_US",
    title: `${SITE.legalName} · ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.legalName} · ${SITE.tagline}`,
    description: SITE.description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#ff007c",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        {/* Sets html[data-motion] before paint so CSS loops respect the saved preference. */}
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
      </head>
      <body className="grain min-h-dvh bg-canvas text-nero">
        <MotionPreferenceProvider>
          <CartProvider>
            <a
              href="#main"
              className="sr-only z-[90] bg-nero px-4 py-3 text-canvas focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
            >
              Skip to content
            </a>
            <Header />
            <main id="main" tabIndex={-1} className="outline-none">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </MotionPreferenceProvider>
      </body>
    </html>
  );
}
