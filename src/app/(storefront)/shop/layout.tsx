import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop LOAVIA Cookies Online | Fresh Millet Cookies from Nashik",
  description:
    "Order healthy, delicious LOAVIA Cookies online. Handcrafted millet cookies from Nashik, delivered fresh across India. Free shipping on orders over \u20b9999.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop LOAVIA Cookies Online | Fresh Millet Cookies from Nashik",
    description:
      "Buy fresh artisanal LOAVIA millet cookies online. Handcrafted in Nashik with wholesome ingredients, nationwide delivery across India.",
    url: "https://www.loavia.in/shop",
  },
  twitter: {
    title: "Shop LOAVIA Cookies Online | Fresh Millet Cookies",
    description:
      "Buy fresh artisanal LOAVIA millet cookies online. Handcrafted in Nashik, delivered fresh across India.",
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
