"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useProductStore } from "@/store/productStore";
import { useSiteStore } from "@/store/siteStore";
import { toast } from "sonner";

gsap.registerPlugin(ScrollTrigger);

export function BestSellers() {
  const { addItem } = useCartStore();
  const { user, toggleWishlist } = useAuthStore();
  const { products: storeProducts } = useProductStore();
  const { bestSellersTitle, bestSellersSubtitle } = useSiteStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const popularProducts = storeProducts.filter(p => p.isPopular);
  const products = mounted 
    ? (popularProducts.length > 0 ? popularProducts.slice(0, 4) : storeProducts.slice(0, 4)) 
    : [];

  useGSAP(() => {
    if (!mounted || products.length === 0) return;
    gsap.fromTo(
      ".product-card",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      }
    );
  }, { scope: containerRef, dependencies: [mounted, products.length] });

  return (
    <section ref={containerRef} className="py-24 bg-brand-light relative">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 
            style={{ fontFamily: "'Amsterdam Signature', serif" }}
            className="font-normal leading-none mb-6 pt-4 pb-4 text-brand-brown text-5xl md:text-6xl lg:text-7xl"
          >
            {bestSellersTitle}
          </h2>
          <p className="font-sans text-brand-text-secondary max-w-2xl mx-auto text-sm md:text-base lg:text-lg font-light leading-relaxed">
            {bestSellersSubtitle}
          </p>
        </div>
        
        <div className="flex justify-center mb-8">
          <Link href="/shop" className="inline-block font-semibold text-brand-gold hover:text-brand-brown transition-colors uppercase tracking-widest text-sm">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="product-card group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    if (!user) {
                      toast.error("Please login to use wishlist");
                      return;
                    }
                    toggleWishlist({ ...product, id: product.id.toString() });
                    toast.success(user?.wishlist?.some(w => w.id === product.id.toString()) ? "Removed from wishlist" : "Added to wishlist");
                  }}
                  className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                >
                  <Heart className={`w-4 h-4 ${user?.wishlist?.some(w => w.id === product.id.toString()) ? "fill-brand-gold text-brand-gold" : "text-brand-text-secondary hover:text-brand-gold"}`} />
                </button>
              </div>
              
              <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-brand-light">
                <Image
                  src={product.primaryImage || product.images?.[0] || product.image}
                  alt={product.name}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </Link>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-bold text-lg text-brand-text-primary hover:text-brand-gold transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                </div>
                
                <div className="flex items-center space-x-1 mb-4 text-sm text-brand-text-secondary">
                  <span className="text-brand-gold">★</span>
                  <span>{product.rating}</span>
                  <span>({product.reviews})</span>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-col">
                    {product.discountPrice ? (
                      <>
                        <span className="font-bold text-xl text-brand-brown">₹{product.discountPrice}</span>
                        <span className="text-sm line-through text-brand-text-secondary">₹{product.price}</span>
                      </>
                    ) : (
                      <span className="font-bold text-xl text-brand-brown">₹{product.price}</span>
                    )}
                  </div>
                  <button 
                    onClick={() => {
                      addItem({
                        id: product.id.toString(),
                        name: product.name,
                        price: product.discountPrice || product.price,
                        image: product.image,
                        quantity: 1
                      });
                      toast.success(`${product.name} added to cart`);
                    }}
                    className="p-2 rounded-full bg-brand-light text-brand-brown hover:bg-brand-brown hover:text-white transition-colors"
                    aria-label="Add to cart"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        

      </div>
    </section>
  );
}
