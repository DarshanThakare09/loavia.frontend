import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LOAVIA Cookie Gifts & Hampers | Premium Healthy Gifting",
  description:
    "Celebrate special occasions with LOAVIA Cookies luxury gift hampers. Beautiful healthy millet cookie gift boxes for festivals, corporate events, weddings, and celebrations \u2014 handcrafted in Nashik.",
  alternates: {
    canonical: "/gift",
  },
  openGraph: {
    title: "LOAVIA Cookie Gifts & Hampers | Premium Healthy Gifting",
    description:
      "Premium LOAVIA Cookies healthy gift hampers for corporate gifting, festivals, and celebrations. Handcrafted millet cookies from Nashik.",
    url: "https://www.loavia.in/gift",
  },
  twitter: {
    title: "LOAVIA Cookie Gifts & Hampers | Premium Healthy Gifting",
    description:
      "Premium LOAVIA Cookies healthy gift hampers for corporate gifting, festivals, and celebrations. Handcrafted in Nashik.",
  },
};

export default function GiftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
