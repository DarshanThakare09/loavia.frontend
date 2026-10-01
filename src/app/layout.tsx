import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ScrollToTop from "@/components/layout/ScrollToTop";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-proxima",
  subsets: ["latin"],
});

const SITE_URL = "https://www.loavia.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LOAVIA | Healthy Inside, Yummy Outside - Premium Millet Cookies",
    template: "%s | LOAVIA",
  },
  description:
    "Discover LOAVIA's handcrafted, 100% wholesome millet cookies. Made with clean ingredients, zero refined flour (maida), and pure goodness. Healthy inside, yummy outside.",
  keywords: [
    "LOAVIA",
    "millet cookies",
    "healthy cookies",
    "gluten free cookies",
    "wholesome cookies",
    "artisanal bakery",
    "guilt free snacks",
    "healthy snacking",
    "ragi cookies",
    "jowar cookies",
    "buy cookies online India",
    "sugar free cookies",
    "premium cookie gift box",
  ],
  authors: [{ name: "LOAVIA", url: SITE_URL }],
  creator: "LOAVIA",
  publisher: "LOAVIA",
  alternates: {
    canonical: "/",
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
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "LOAVIA",
    title: "LOAVIA | Healthy Inside, Yummy Outside - Premium Millet Cookies",
    description:
      "Handcrafted, 100% wholesome millet cookies. Clean ingredients, zero maida, guilt-free indulgence, and exceptional taste.",
    images: [
      {
        url: "/loavia-brand-logo.png",
        width: 1024,
        height: 384,
        alt: "LOAVIA - Healthy Inside, Yummy Outside",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LOAVIA | Healthy Inside, Yummy Outside",
    description:
      "Handcrafted, 100% wholesome millet cookies. Clean ingredients, zero maida, guilt-free indulgence, and exceptional taste.",
    images: ["/loavia-brand-logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
    shortcut: "/favicon.ico",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  category: "Food & Grocery",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.loavia.in/#organization",
      "name": "LOAVIA",
      "legalName": "Akshar Foods",
      "url": "https://www.loavia.in",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://www.loavia.in/#logo",
        "url": "https://www.loavia.in/loavia-brand-logo.png",
        "caption": "LOAVIA - Healthy Inside, Yummy Outside",
      },
      "image": "https://www.loavia.in/loavia-brand-logo.png",
      "description":
        "Wholesome, delicious, and premium millet cookies crafted with clean ingredients — where traditional Indian grains meet modern indulgence.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Nashik",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN",
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-7796116622",
        "contactType": "sales",
        "email": "Sales@loavia.in",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi", "Marathi"],
      },
      "sameAs": [
        "https://instagram.com/loavia_cookies",
        "https://facebook.com/loavia",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.loavia.in/#website",
      "url": "https://www.loavia.in",
      "name": "LOAVIA",
      "description": "Healthy Inside, Yummy Outside - Premium Millet Cookies",
      "publisher": {
        "@id": "https://www.loavia.in/#organization",
      },
      "inLanguage": "en-IN",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-proxima text-brand-text-primary bg-brand-cream">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ScrollToTop />
        <Toaster position="bottom-right" richColors />
        {children}
      </body>
    </html>
  );
}
