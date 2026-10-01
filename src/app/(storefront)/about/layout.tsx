import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Our Story & Healthy Baking Philosophy",
  description:
    "Learn about LOAVIA's story from Nashik, Maharashtra. Founded by certified Pâtissier Chef Pranita Vivek Patil, crafting wholesome millet cookies with pure ingredients and zero maida.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About LOAVIA | Healthy Inside, Yummy Outside",
    description:
      "Crafted in Nashik. Wholesome millet cookies made with clean ingredients and traditional grains.",
    url: "https://www.loavia.in/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
