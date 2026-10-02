import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About LOAVIA Cookies | Our Story & Healthy Baking Philosophy",
  description:
    "Learn about LOAVIA Cookies, Nashik\u2019s premium millet cookie brand. Founded by certified P\u00e2tissi\u00e8r Chef Pranita Vivek Patil, crafting wholesome millet cookies with pure ingredients, zero maida, and zero preservatives.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About LOAVIA Cookies | Healthy Inside, Yummy Outside",
    description:
      "LOAVIA Cookies, crafted in Nashik. Wholesome millet cookies made with clean ingredients and traditional Indian grains.",
    url: "https://www.loavia.in/about",
  },
  twitter: {
    title: "About LOAVIA Cookies | Healthy Inside, Yummy Outside",
    description:
      "LOAVIA Cookies from Nashik. Wholesome millet cookies made with clean ingredients and traditional Indian grains.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
