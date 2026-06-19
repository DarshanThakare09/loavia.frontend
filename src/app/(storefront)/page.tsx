import { HeroSection } from "@/components/home/HeroSection";
import { ShopByMood } from "@/components/home/ShopByMood";
import { BestSellers } from "@/components/home/BestSellers";
import { Categories } from "@/components/home/Categories";
import { BuildBoxHighlight } from "@/components/home/BuildBoxHighlight";
import { GiftingSection } from "@/components/home/GiftingSection";
import { Testimonials } from "@/components/home/Testimonials";
import WhyChoose from "@/components/home/WhyChoose";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CustomerLove from "@/components/home/CustomerLove";
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
      <CustomerLove />
      <ShopByMood />
      <BestSellers />
      <Categories />
      <BuildBoxHighlight />
      <GiftingSection />
      <Testimonials />
    </div>
  );
}
