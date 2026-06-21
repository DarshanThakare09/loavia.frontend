"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Filter, ChevronDown, ShoppingCart, Star, Heart, ArrowRight } from "lucide-react";
import { useProductStore } from "@/store/productStore";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CATEGORIES = ["All", "Classic", "Vegan", "Gluten-Free", "Stuffed", "Specialty"];
const FLAVORS = ["Sweet", "Chocolate", "Healthy", "Fruity", "Nutty", "Tea", "Citrus", "Caramel", "Premium", "Happy", "Cozy", "Energetic", "Relaxed"];
const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" }
];

export default function ShopPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popular");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);
  const { user, toggleWishlist } = useAuthStore();
  
  const { products: storeProducts } = useProductStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const products = mounted ? storeProducts : [];

  // Filtering Logic
  const filteredProducts = products.filter(product => {
    if (selectedCategory !== "All" && product.category !== selectedCategory) return false;
    if (selectedFlavors.length > 0 && !selectedFlavors.some(tag => product.tags.includes(tag) || (product as any).moods?.includes(tag))) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return b.reviews - a.reviews; // default popular
  });

  useGSAP(() => {
    if (!mounted) return;

    // Header and Sidebar animations on load
    const tl = gsap.timeline();
    tl.fromTo(".shop-header-el",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.15 }
    )
    .fromTo(".shop-sidebar-el",
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=0.6"
    );

    // Staggered entry for product cards on scroll/load
    gsap.fromTo(".product-card-el",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".shop-grid-container",
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, { dependencies: [mounted, filteredProducts.length], scope: containerRef });

  const toggleFlavor = (flavor: string) => {
    if (selectedFlavors.includes(flavor)) {
      setSelectedFlavors(selectedFlavors.filter(f => f !== flavor));
    } else {
      setSelectedFlavors([...selectedFlavors, flavor]);
    }
  };

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.image,
      quantity: 1
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div ref={containerRef} className="bg-[#FDFBF7] min-h-screen pt-12 pb-24 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-brand-brown/10 pb-8 relative z-20">
          <div className="text-left">
            <span className="shop-header-el text-brand-gold font-sans font-bold text-xs uppercase tracking-[3px] mb-2 block">Freshly Baked Menu</span>
            <h1
              style={{ fontFamily: "'Amsterdam Signature', serif" }}
              className="shop-header-el font-normal leading-none mb-4 pt-2 flex flex-col sm:flex-row sm:items-baseline sm:flex-wrap gap-x-4 gap-y-2"
            >
              <span className="text-brand-gold text-2xl md:text-3xl lg:text-[3rem]">Our Fresh</span>
              <span className="text-brand-brown text-7xl md:text-8xl lg:text-[6rem]">Menu</span>
            </h1>
            <p className="shop-header-el text-brand-text-secondary font-sans font-light mt-2">
              Freshly baked with premium, wholesome ingredients. Find your craving.
            </p>
          </div>
          
          <div className="shop-header-el mt-6 md:mt-0 flex items-center space-x-4">
            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="md:hidden flex items-center px-5 py-2.5 bg-white rounded-full text-brand-brown font-medium shadow-sm border border-brand-brown/10 hover:border-brand-gold/40 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2 text-brand-gold" /> 
              <span>Filters</span>
            </button>
            
            {/* Custom Sort Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center justify-between min-w-[180px] bg-white border border-brand-brown/10 text-brand-brown py-2.5 px-5 rounded-full font-medium shadow-sm hover:border-brand-gold/40 transition-all text-sm font-sans cursor-pointer"
              >
                <span>{SORT_OPTIONS.find(o => o.value === sortBy)?.label}</span>
                <ChevronDown className={`w-4 h-4 text-brand-gold ml-2 transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`} />
              </button>
              
              {isSortOpen && (
                <div className="absolute right-0 top-full mt-2 min-w-[200px] bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-brand-brown/10 z-30 p-2 transform origin-top-right transition-all duration-300">
                  {SORT_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left py-2 px-4 rounded-xl text-sm font-sans font-medium transition-all duration-200 ${
                        sortBy === option.value 
                          ? "text-brand-gold bg-brand-gold/5 font-semibold" 
                          : "text-brand-brown/85 hover:text-brand-gold hover:bg-brand-brown/5"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className={`shop-sidebar-el ${isMobileFilterOpen ? "block" : "hidden"} md:block w-full md:w-64 flex-shrink-0 z-10`}>
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] shadow-[0_8px_30px_rgba(92,51,23,0.02)] border border-brand-brown/10 sticky top-28">
              
              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="font-serif font-bold text-lg text-brand-brown mb-4 border-b border-brand-brown/10 pb-2">Category</h3>
                <ul className="space-y-1.5">
                  {CATEGORIES.map(category => (
                    <li key={category}>
                      <button 
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left py-2 px-3 rounded-xl transition-all duration-300 font-sans text-sm flex items-center justify-between ${
                          selectedCategory === category 
                            ? "text-brand-gold bg-brand-gold/5 font-semibold" 
                            : "text-brand-text-secondary hover:text-brand-brown hover:bg-brand-brown/5"
                        }`}
                      >
                        <span>{category}</span>
                        {selectedCategory === category && (
                          <span className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Flavor Filter */}
              <div>
                <h3 className="font-serif font-bold text-lg text-brand-brown mb-4 border-b border-brand-brown/10 pb-2">Flavors & Mood</h3>
                <div className="flex flex-wrap gap-2">
                  {FLAVORS.map(flavor => {
                    const isSelected = selectedFlavors.includes(flavor);
                    return (
                      <button
                        key={flavor}
                        onClick={() => toggleFlavor(flavor)}
                        className={`px-3 py-1.5 text-xs font-sans font-medium rounded-full transition-all duration-300 border ${
                          isSelected 
                            ? "bg-brand-brown border-brand-brown text-white shadow-sm" 
                            : "bg-[#FDFBF7] border-brand-brown/10 text-brand-text-secondary hover:border-brand-brown/30 hover:text-brand-brown"
                        }`}
                      >
                        {flavor}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reset Filters */}
              {(selectedCategory !== "All" || selectedFlavors.length > 0) && (
                <button
                  onClick={() => { setSelectedCategory("All"); setSelectedFlavors([]); }}
                  className="mt-8 w-full text-center text-xs font-semibold text-brand-gold hover:text-brand-brown hover:underline transition-colors py-2.5 border border-dashed border-brand-gold/30 rounded-xl cursor-pointer"
                >
                  Reset All Filters
                </button>
              )}

            </div>
          </aside>

          {/* Product Grid */}
          <main className="shop-grid-container flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="product-card-el group relative bg-white/95 backdrop-blur-md rounded-[2rem] overflow-hidden border border-brand-brown/10 shadow-[0_8px_30px_rgba(92,51,23,0.02)] hover:shadow-[0_20px_50px_rgba(92,51,23,0.1)] hover:border-brand-gold/40 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between"
                >
                  {/* Badge & Wishlist overlay */}
                  <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
                    {product.isFeatured ? (
                      <span className="bg-brand-brown/90 backdrop-blur-md text-brand-cream text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                        Featured
                      </span>
                    ) : (
                      <div />
                    )}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!user) {
                          toast.error("Please login to use wishlist");
                          return;
                        }
                        toggleWishlist({ ...product, id: product.id.toString(), price: product.price, image: typeof product.image === 'string' ? product.image : "/premium_cookie.png" });
                        toast.success(user?.wishlist?.some(w => w.id === product.id.toString()) ? "Removed from wishlist" : "Added to wishlist");
                      }}
                      className="p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-md hover:bg-white hover:scale-110 active:scale-95 transition-all pointer-events-auto cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 transition-colors ${user?.wishlist?.some(w => w.id === product.id.toString()) ? "fill-brand-gold text-brand-gold" : "text-brand-brown/60 hover:text-brand-gold"}`} />
                    </button>
                  </div>
                  
                  {/* Image wrapper */}
                  <Link href={`/product/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-brand-light">
                    <Image
                      src={product.primaryImage || product.images?.[0] || product.image || "/premium_cookie.png"}
                      alt={product.name}
                      fill
                      className="object-cover transform group-hover:scale-108 transition-transform duration-700"
                    />
                    {product.inStock === false && (
                      <div className="absolute inset-0 bg-brand-brown/40 backdrop-blur-sm z-10 flex items-center justify-center">
                        <span className="bg-brand-error text-white font-bold text-xs uppercase px-4 py-2 rounded-xl shadow-lg tracking-wider">Out of Stock</span>
                      </div>
                    )}
                  </Link>

                  {/* Card Content */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      {/* Category Tag */}
                      <span className="text-[10px] font-bold tracking-[2.5px] text-brand-gold uppercase block mb-1">
                        {product.category || "Cookie"}
                      </span>
                      
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-serif font-bold text-xl text-brand-brown hover:text-brand-gold transition-colors duration-300 line-clamp-1 mb-1">
                          {product.name}
                        </h3>
                      </Link>
                      
                      {/* Rating block */}
                      <div className="flex items-center space-x-1.5 mb-3">
                        <div className="flex text-brand-gold">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < Math.floor(product.rating || 5)
                                  ? "fill-brand-gold text-brand-gold"
                                  : "text-brand-brown/20"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-brand-brown/85">{product.rating}</span>
                        <span className="text-xs text-brand-text-secondary">({product.reviews})</span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-brand-text-secondary leading-relaxed font-sans font-light line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Price Row */}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-brand-brown/5">
                      <div className="flex flex-col">
                        {product.discountPrice ? (
                          <>
                            <span className="font-bold text-xl text-brand-brown">₹{product.discountPrice}</span>
                            <span className="text-xs line-through text-brand-text-secondary">₹{product.price}</span>
                          </>
                        ) : (
                          <span className="font-bold text-xl text-brand-brown">₹{product.price}</span>
                        )}
                      </div>
                      {product.inStock === false ? (
                        <span className="text-xs font-bold text-brand-error uppercase tracking-wider bg-brand-error/10 px-3 py-1.5 rounded-lg border border-brand-error/20">Sold Out</span>
                      ) : (
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          className="p-3 bg-brand-light text-brand-brown rounded-full hover:bg-brand-brown hover:text-white transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md cursor-pointer"
                          aria-label="Add to cart"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[2rem] border border-brand-brown/10 shadow-[0_8px_30px_rgba(92,51,23,0.02)]">
                <span className="text-4xl mb-4 block">🍪</span>
                <p className="text-brand-brown text-lg font-serif font-bold mb-2">No Cookies Found</p>
                <p className="text-brand-text-secondary text-sm font-sans mb-6 max-w-xs mx-auto">We couldn't find any cookies matching your selected filters.</p>
                <button 
                  onClick={() => { setSelectedCategory("All"); setSelectedFlavors([]); }}
                  className="px-6 py-2.5 text-xs font-bold text-brand-cream bg-[#E29B52] rounded-full hover:bg-brand-brown transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
