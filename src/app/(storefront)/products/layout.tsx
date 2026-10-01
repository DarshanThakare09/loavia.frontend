import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Millet Cookies | Wholesome Flavours & Ingredients",
  description:
    "Explore LOAVIA's handcrafted collection of premium millet cookies. Freshly baked with ragi, jowar, dark chocolate, and pure butter with zero refined flour.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Millet Cookies Collection | LOAVIA",
    description:
      "Explore LOAVIA's wholesome cookie flavours: chocolate, almond jaggery, coconut, and more.",
    url: "https://www.loavia.in/products",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
