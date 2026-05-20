import { HeroSection } from "@/components/home/HeroSection";
import { ShopByMood } from "@/components/home/ShopByMood";
import { BestSellers } from "@/components/home/BestSellers";
import { Categories } from "@/components/home/Categories";
import { BuildBoxHighlight } from "@/components/home/BuildBoxHighlight";
import { GiftingSection } from "@/components/home/GiftingSection";
import { Testimonials } from "@/components/home/Testimonials";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <ShopByMood />
      <BestSellers />
      <Categories />
      <BuildBoxHighlight />
      <GiftingSection />
      <Testimonials />
    </div>
  );
}
