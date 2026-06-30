import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "LOAVIA | Healthy Inside, Yummy Outside",
  description: "Premium cookie brand offering healthy and yummy cookies. Buy custom boxes, gift boxes, and more.",
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
        <ScrollToTop />
        <Toaster position="bottom-right" richColors />
        {children}
      </body>
    </html>
  );
}
