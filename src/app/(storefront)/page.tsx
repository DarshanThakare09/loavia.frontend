import { HeroSection } from "@/components/home/HeroSection";
import { ShopByMood } from "@/components/home/ShopByMood";
import { BestSellers } from "@/components/home/BestSellers";
import { Categories } from "@/components/home/Categories";
import { BuildBoxHighlight } from "@/components/home/BuildBoxHighlight";
import { GiftingSection } from "@/components/home/GiftingSection";
import CustomerLove from "@/components/home/CustomerLove";
import WhyChoose from "@/components/home/WhyChoose";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LOAVIA Cookies | Premium Healthy Millet Cookies in Nashik",
  description:
    "LOAVIA Cookies – Nashik’s premium healthy millet cookie brand. Handcrafted with 100% wholesome ingredients, zero refined flour (maida), and zero preservatives. Healthy inside, yummy outside.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LOAVIA Cookies | Premium Healthy Millet Cookies in Nashik",
    description:
      "LOAVIA Cookies – handcrafted, wholesome millet cookies from Nashik. Clean ingredients, zero maida, guilt-free indulgence, and exceptional taste.",
    url: "https://www.loavia.in",
  },
  twitter: {
    title: "LOAVIA Cookies | Healthy Millet Cookies from Nashik",
    description:
      "LOAVIA Cookies – handcrafted, wholesome millet cookies from Nashik. Clean ingredients, zero maida, guilt-free indulgence, and exceptional taste.",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* SEO: Crawlable brand identification — visually hidden, screen-reader accessible */}
      <p className="sr-only">
        LOAVIA Cookies is Nashik&rsquo;s premium healthy millet cookie brand, offering handcrafted
        millet cookies made with wholesome ingredients and zero refined flour (maida).
      </p>
      <HeroSection />
      <WhyChoose />
      <FeaturedProducts />
      <ShopByMood />
      <BestSellers />
      <Categories />
      <BuildBoxHighlight />
      <GiftingSection />
      <CustomerLove />
    </div>
  );
}