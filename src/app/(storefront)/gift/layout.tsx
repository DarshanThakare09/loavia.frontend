import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gifts & Hampers | Premium Healthy Gifting",
  description:
    "Celebrate special occasions with LOAVIA luxury cookie hampers. Beautiful healthy gift boxes for festivals, corporate events, weddings, and celebrations.",
  alternates: {
    canonical: "/gift",
  },
  openGraph: {
    title: "LOAVIA Cookie Gift Boxes & Hampers",
    description: "Premium healthy cookie hampers for corporate gifting, festivals, and celebrations.",
    url: "https://www.loavia.in/gift",
  },
};

export default function GiftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
