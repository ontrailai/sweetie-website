import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { body, heading } from "./fonts";
import { SITE } from "@/lib/site";
import { MotionPreferenceProvider, motionBootScript } from "@/components/motion/MotionPreference";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartFx } from "@/components/fx/CartFx";
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
        {/* Sets html[data-motion] before paint so CSS (pinning, loops) respects the saved preference. */}
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
      </head>
      <body className="grain min-h-dvh">
        <MotionPreferenceProvider>
          <CartProvider>
            <a
              href="#main"
              className="sr-only z-[110] rounded-full bg-nero px-5 py-3 font-mono text-[15px] font-bold text-canvas focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
            >
              Skip to content
            </a>
            <Header />
            <main id="main" tabIndex={-1} className="outline-none">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <CartDrawer />
            <CartFx />
            <SmoothScroll />
            <RevealObserver />
            <CustomCursor />
          </CartProvider>
        </MotionPreferenceProvider>
      </body>
    </html>
  );
}
