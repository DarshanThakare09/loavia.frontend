import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Cookies Online | Fresh & Artisanal",
  description:
    "Order healthy, delicious millet cookies online at LOAVIA. Handcrafted in small batches, delivered fresh across India. Free shipping on orders over ₹999.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop LOAVIA Cookies Online",
    description: "Buy fresh artisanal millet cookies online with nationwide delivery in India.",
    url: "https://www.loavia.in/shop",
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
