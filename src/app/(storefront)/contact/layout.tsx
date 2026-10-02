import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact LOAVIA Cookies | Customer Support & Gifting Enquiries",
  description:
    "Contact LOAVIA Cookies for orders, corporate gifting, custom hampers, or customer support. Nashik-based premium healthy millet cookie brand, Maharashtra, India.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact LOAVIA Cookies | Customer Support & Gifting Enquiries",
    description:
      "Get in touch with LOAVIA Cookies for customer support, bulk orders, and corporate gifting. Based in Nashik, Maharashtra.",
    url: "https://www.loavia.in/contact",
  },
  twitter: {
    title: "Contact LOAVIA Cookies | Customer Support & Gifting",
    description:
      "Get in touch with LOAVIA Cookies for customer support, bulk orders, and corporate gifting. Based in Nashik.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
