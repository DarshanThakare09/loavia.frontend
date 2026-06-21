"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useProductStore } from "@/store/productStore";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { 
  Heart, 
  Star, 
  ShoppingCart, 
  ArrowRight, 
  Leaf, 
  Shield, 
  Flame, 
  Sparkles, 
  Award 
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProductsPage() {
  const { products: storeProducts } = useProductStore();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const addItem = useCartStore((state) => state.addItem);
  const { user, toggleWishlist } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const products = mounted ? storeProducts : [];

  useGSAP(() => {
    if (!mounted) return;

    // Hero timeline entrance animation
    const tl = gsap.timeline();
    tl.fromTo(".hero-bg", 
      { scale: 1.12, opacity: 0.8 }, 
      { scale: 1, opacity: 1, duration: 1.8, ease: "power3.out" }
    )
    .fromTo(".hero-text-el", 
      { y: 40, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.15 },
      "-=1.4"
    );

    // Product Cards ScrollTrigger Animation
    gsap.fromTo(".product-card", 
      { y: 60, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        stagger: 0.1, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".products-grid-container",
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Highlights Section ScrollTrigger Animation
    gsap.fromTo(".highlight-card", 
      { y: 40, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        stagger: 0.1, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".highlights-container",
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, { dependencies: [mounted], scope: containerRef });

  const handleWishlistToggle = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to use wishlist");
      return;
    }
    toggleWishlist({
      ...item,
      id: item.id.toString(),
      price: item.price,
      image: item.image || "/premium_cookie.png"
    });
    toast.success(
      user.wishlist?.some((w) => w.id === item.id.toString())
        ? "Removed from wishlist"
        : "Added to wishlist"
    );
  };

  const handleAddToCart = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: item.id,
      name: item.name,
      price: item.discountPrice || item.price,
      image: item.image,
      quantity: 1
    });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div ref={containerRef} className="bg-[#FDFBF7] min-h-screen pb-24 overflow-x-hidden">
      
      {/* HERO SECTION */}
      <div className="relative w-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden z-0 shadow-inner">
        <Image
          src="/products-hero-bg-v2.png"
          alt="Introducing your new favorite cookies"
          fill
          priority
          className="hero-bg object-cover object-[25%_center] md:object-center"
        />
        
        {/* Dark radial overlay starting top right, fading out to bottom and left */}
        <div
          style={{
            background: "radial-gradient(ellipse at top right, rgba(46, 25, 14, 0.95) 0%, rgba(46, 25, 14, 0.8) 35%, rgba(46, 25, 14, 0.4) 65%, rgba(46, 25, 14, 0) 85%)"
          }}
          className="absolute inset-0 z-1"
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
          <div className="w-full md:w-[52%] lg:w-[48%] flex flex-col items-start text-left py-12 md:py-0">
            <h1
              style={{
                fontFamily: "'Amsterdam Signature', 'Playfair Display', serif",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)"
              }}
              className="hero-text-el text-5xl sm:text-6xl md:text-[5.5rem] lg:text-[6.5rem] font-normal leading-[0.85] mb-2"
            >
              <span className="text-brand-cream">Introducing your</span>
              <br />
              <span className="text-[#E29B52]">new favorite</span>
            </h1>
            
            <div className="hero-text-el w-[120px] h-[2px] bg-[#E29B52] my-4 opacity-85"></div>
            
            <p
              style={{
                fontFamily: "'Outfit', 'Proxima Nova', 'Montserrat', sans-serif",
                textShadow: "0 1px 4px rgba(0, 0, 0, 0.2)"
              }}
              className="hero-text-el text-xs md:text-sm font-medium tracking-[3px] text-brand-cream/90 uppercase leading-relaxed mb-8 whitespace-pre-wrap"
            >
              We took the time to improve the recipe - better ingredients, better recipe, better flavour.
            </p>
            
            <button
              onClick={() => document.getElementById("products-grid")?.scrollIntoView({ behavior: 'smooth' })}
              className="hero-text-el inline-flex items-center justify-center px-8 py-4 text-sm md:text-base font-bold text-brand-cream bg-[#E29B52] rounded-full hover:bg-white hover:text-brand-brown transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
            >
              Explore Our Cookies
            </button>
          </div>
        </div>
      </div>

      {/* PRODUCT GRID SECTION */}
      <div id="products-grid" className="products-grid-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center max-w-4xl mx-auto mb-16 flex flex-col items-center">
          <span className="text-brand-gold font-sans font-bold text-xs uppercase tracking-[3px] mb-2 block">Handcrafted Selection</span>
          <h2
            style={{ fontFamily: "'Amsterdam Signature', serif" }}
            className="font-normal leading-none mb-6 pt-4 pb-4 flex flex-col sm:flex-row sm:items-baseline sm:flex-wrap gap-x-4 gap-y-2 justify-center"
          >
            <span className="text-brand-gold text-2xl md:text-3xl lg:text-[3rem]">Our Cookie</span>
            <span className="text-brand-brown text-7xl md:text-8xl lg:text-[6rem]">Collection</span>
          </h2>
          <p className="text-base md:text-lg text-brand-text-secondary leading-relaxed max-w-2xl mx-auto font-light">
            Discover our delicious range of premium millet cookies crafted with wholesome ingredients,
            rich flavours, and freshly baked goodness.
          </p>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mounted && products.map((item) => {
            const isWishlisted = user?.wishlist?.some((w) => w.id === item.id.toString());
            return (
              <div
                key={item.id}
                className="product-card group relative bg-white/95 backdrop-blur-md rounded-[2rem] overflow-hidden border border-brand-brown/10 shadow-[0_8px_30px_rgba(92,51,23,0.03)] hover:shadow-[0_20px_50px_rgba(92,51,23,0.12)] hover:border-brand-gold/40 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between"
              >
                {/* Wishlist and Badge Header Overlay */}
                <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
                  {(item.featuredBadgeText || item.isFeatured) ? (
                    <span className="bg-brand-brown/90 backdrop-blur-md text-brand-cream text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      {item.featuredBadgeText || "Featured"}
                    </span>
                  ) : (
                    <div />
                  )}
                  <button
                    onClick={(e) => handleWishlistToggle(e, item)}
                    className="p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-md hover:bg-white hover:scale-110 active:scale-95 transition-all pointer-events-auto cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isWishlisted ? "fill-brand-gold text-brand-gold" : "text-brand-brown/60 hover:text-brand-gold"
                      }`}
                    />
                  </button>
                </div>

                {/* Image Section */}
                <Link href={`/product/${item.id}`} className="relative aspect-[4/3] w-full bg-brand-light overflow-hidden block">
                  <Image
                    src={item.image || "/premium_cookie.png"}
                    alt={item.name}
                    fill
                    className="object-cover transform group-hover:scale-108 transition-transform duration-700"
                  />
                  {item.inStock === false && (
                    <div className="absolute inset-0 bg-brand-brown/40 backdrop-blur-sm z-10 flex items-center justify-center">
                      <span className="bg-brand-error text-white font-bold text-xs uppercase px-4 py-2 rounded-xl shadow-lg tracking-wider">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </Link>

                {/* Body Content */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="flex-grow">
                    {/* Category */}
                    <span className="text-[10px] font-bold tracking-[2.5px] text-brand-gold uppercase block mb-1">
                      {item.category || "Cookie"}
                    </span>

                    {/* Title */}
                    <Link href={`/product/${item.id}`}>
                      <h3 className="text-xl font-serif font-bold text-brand-brown hover:text-brand-gold transition-colors duration-300 line-clamp-1">
                        {item.name}
                      </h3>
                    </Link>

                    {/* Stars & Rating */}
                    <div className="flex items-center space-x-1.5 mt-2 mb-3">
                      <div className="flex text-brand-gold">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(item.rating || 5)
                                ? "fill-brand-gold text-brand-gold"
                                : "text-brand-brown/20"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-brand-brown/80">{item.rating || 5.0}</span>
                      <span className="text-xs text-brand-text-secondary">({item.reviews || 0})</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-brand-text-secondary leading-relaxed font-sans font-light line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Footer Price Row */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-brand-brown/5">
                    <div className="flex flex-col">
                      {item.discountPrice ? (
                        <>
                          <span className="font-bold text-xl text-brand-brown">₹{item.discountPrice}</span>
                          <span className="text-xs line-through text-brand-text-secondary">₹{item.price}</span>
                        </>
                      ) : (
                        <span className="font-bold text-xl text-brand-brown">₹{item.price}</span>
                      )}
                    </div>

                    {item.inStock === false ? (
                      <span className="text-xs font-bold text-brand-error uppercase tracking-wider bg-brand-error/10 px-3 py-1.5 rounded-lg border border-brand-error/20">
                        Sold Out
                      </span>
                    ) : (
                      <button
                        onClick={(e) => handleAddToCart(e, item)}
                        className="p-3 bg-brand-light text-brand-brown rounded-full hover:bg-brand-brown hover:text-white transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md cursor-pointer"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* HIGHLIGHTS SECTION */}
      <div className="highlights-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center flex flex-col items-center">
        <span className="text-brand-gold font-sans font-bold text-xs uppercase tracking-[3px] mb-2 block">Crafted for Wellness</span>
        <h2
          style={{ fontFamily: "'Amsterdam Signature', serif" }}
          className="font-normal leading-none mb-12 pt-4 pb-4 flex flex-col sm:flex-row sm:items-baseline sm:flex-wrap gap-x-4 gap-y-2 justify-center"
        >
          <span className="text-brand-gold text-2xl md:text-3xl lg:text-[3rem]">Product</span>
          <span className="text-brand-brown text-7xl md:text-8xl lg:text-[6rem]">Highlights</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full">
          {[
            { title: "No Maida", desc: "100% whole grain millet flour", icon: <Leaf className="w-6 h-6 text-brand-gold" /> },
            { title: "No Preservatives", desc: "Pure, clean-label recipe", icon: <Shield className="w-6 h-6 text-brand-gold" /> },
            { title: "Freshly Baked", desc: "Baked in small batches", icon: <Flame className="w-6 h-6 text-brand-gold" /> },
            { title: "Premium Sourced", desc: "Wholesome, rich ingredients", icon: <Award className="w-6 h-6 text-brand-gold" /> },
            { title: "High Fiber", desc: "Supports healthy digestion", icon: <Sparkles className="w-6 h-6 text-brand-gold" /> }
          ].map((item, index) => (
            <div 
              key={index}
              className="highlight-card bg-white p-6 rounded-[2rem] border border-brand-brown/10 shadow-[0_8px_30px_rgba(92,51,23,0.02)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-serif font-bold text-lg text-brand-brown mb-2">{item.title}</h3>
              <p className="text-xs text-brand-text-secondary font-light font-sans">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* THE POWER OF MILLETS SECTION */}
      <div className="bg-[#FDFBF7] border-t border-b border-brand-brown/5 text-brand-text-primary py-24 px-4 sm:px-6 lg:px-8 mt-12 relative overflow-hidden">
        {/* Decorative background blur elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-gold/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#5C3317]/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left - Visual Banner */}
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl group border border-brand-brown/10">
              <Image
                src="/premium_cookie.png"
                alt="Nutritious Millet Cookies"
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-brand-brown/5 mix-blend-overlay" />
            </div>

            {/* Right - Text Content */}
            <div className="flex flex-col items-start text-left">
              <h2
                style={{ fontFamily: "'Amsterdam Signature', serif" }}
                className="font-normal leading-none mb-6 pt-4 pb-4 flex flex-col sm:flex-row sm:items-baseline sm:flex-wrap gap-x-4 gap-y-2"
              >
                <span className="text-brand-gold text-2xl md:text-3xl lg:text-[3rem]">The Power of</span>
                <span className="text-brand-brown text-7xl md:text-8xl lg:text-[6rem]">Millets</span>
              </h2>

              <p className="text-base sm:text-lg text-brand-text-secondary leading-relaxed font-light mb-6 font-sans">
                Millets are ancient super grains packed with essential nutrients, fiber, protein, vitamins, and minerals.
                Naturally gluten-free and low in glycemic index, they support healthy growth in children, better digestion,
                and overall wellness for the entire family.
              </p>

              <p className="text-base sm:text-lg text-brand-text-secondary leading-relaxed font-light font-sans mb-8">
                At LOAVIA™, we transform these nutritious grains into delicious cookies that are wholesome,
                satisfying, and enjoyable without compromising on taste.
              </p>
              
              <Link 
                href="/about" 
                className="inline-flex items-center text-sm font-bold text-brand-gold hover:text-brand-brown transition-colors group"
              >
                <span>Read Our Story</span>
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-16">
            {[
              { title: "Rich in Fiber", icon: "🌾" },
              { title: "Low GI Index", icon: "📉" },
              { title: "Better Digestion", icon: "✨" },
              { title: "Nutrient Rich", icon: "🔋" },
              { title: "Natural Energy", icon: "⚡" },
              { title: "Smart Snacking", icon: "🍪" }
            ].map((benefit, i) => (
              <div 
                key={i} 
                className="bg-[#FDFBF7]/90 backdrop-blur-md border border-brand-brown/10 p-5 rounded-2xl flex flex-col items-center text-center hover:border-brand-gold/30 hover:shadow-md transition-all duration-300 shadow-sm"
              >
                <span className="text-3xl mb-3">{benefit.icon}</span>
                <span className="text-sm font-semibold tracking-wide text-brand-brown">{benefit.title}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}