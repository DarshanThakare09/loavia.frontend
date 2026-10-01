import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Customer Support & Gifting Enquiries",
  description:
    "Contact LOAVIA for orders, corporate gifting, custom hampers, or customer support. Handcrafted bakery based in Nashik, Maharashtra, India.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact LOAVIA | Customer Support & Gifting Enquiries",
    description:
      "Get in touch with LOAVIA for customer support, bulk orders, and corporate gifting.",
    url: "https://www.loavia.in/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
