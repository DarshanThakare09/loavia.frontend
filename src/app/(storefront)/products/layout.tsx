import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All LOAVIA Millet Cookies | Wholesome Flavours & Ingredients",
  description:
    "Explore LOAVIA Cookies\u2019 handcrafted collection of premium millet cookies from Nashik. Freshly baked with ragi, jowar, dark chocolate, and pure butter \u2014 zero refined flour, zero preservatives.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "All LOAVIA Millet Cookies | Wholesome Flavours & Ingredients",
    description:
      "Explore LOAVIA Cookies\u2019 wholesome cookie flavours: chocolate, almond jaggery, coconut, and more. Handcrafted in Nashik, delivered fresh across India.",
    url: "https://www.loavia.in/products",
  },
  twitter: {
    title: "All LOAVIA Millet Cookies | Wholesome Flavours & Ingredients",
    description:
      "Explore LOAVIA Cookies\u2019 wholesome cookie flavours: chocolate, almond jaggery, coconut, and more. Handcrafted in Nashik.",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
