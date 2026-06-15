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
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-serif font-bold text-brand-brown mb-4">{bestSellersTitle}</h2>
            <p className="text-brand-text-secondary">{bestSellersSubtitle}</p>
          </div>
          <Link href="/shop" className="hidden sm:inline-block font-medium text-brand-gold hover:text-brand-brown transition-colors">
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
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
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
        
        <div className="mt-10 text-center sm:hidden">
          <Link href="/shop" className="inline-block font-medium text-brand-brown underline underline-offset-4">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
