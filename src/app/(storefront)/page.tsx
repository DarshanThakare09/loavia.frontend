import { HeroSection } from "@/components/home/HeroSection";
import { ShopByMood } from "@/components/home/ShopByMood";
import { BestSellers } from "@/components/home/BestSellers";
import { Categories } from "@/components/home/Categories";
import { BuildBoxHighlight } from "@/components/home/BuildBoxHighlight";
import { GiftingSection } from "@/components/home/GiftingSection";
import CustomerLove from "@/components/home/CustomerLove";
import WhyChoose from "@/components/home/WhyChoose";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import LandingAnimation from "@/components/home/LandingAnimation";
import { Navbar } from "@/components/layout/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingAnimation />
      <Navbar />
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
