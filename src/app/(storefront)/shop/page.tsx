"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Filter, ChevronDown, ShoppingCart, Star, Heart, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { catalogService } from "@/services/catalogService";
import { Product } from "@/store/productStore";
import { PaginationMeta } from "@/types/catalog";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  
  const [categories, setCategories] = useState<string[]>(["All", "Classic", "Vegan", "Gluten-Free", "Stuffed", "Specialty"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popular");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  // Backend dynamic state
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { user, toggleWishlist } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    // Parse search from URL on client mount
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const search = params.get("search");
      if (search) setSearchQuery(search);
      const categoryParam = params.get("category");
      if (categoryParam) {
        // Find matching category (case-insensitive)
        const matched = ["Classic", "Vegan", "Gluten-Free", "Stuffed", "Specialty"].find(
          c => c.toLowerCase() === categoryParam.toLowerCase()
        );
        if (matched) setSelectedCategory(matched);
      }
    }
  }, []);

  // Fetch Categories from Backend
  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await catalogService.getCategories();
        if (cats && cats.length > 0) {
          setCategories(["All", ...cats.map(c => c.name)]);
        }
      } catch (err) {
        console.error("Failed to load categories from backend, using defaults", err);
      }
    }
    loadCategories();
  }, []);

  // Fetch Products based on parameters
  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const categorySlug = selectedCategory !== "All" 
        ? selectedCategory.toLowerCase().replace(/[^a-z0-9]+/g, "-") 
        : undefined;

      // Map flavors
      const tagSlug = selectedFlavors.length > 0 
        ? selectedFlavors[0].toLowerCase().replace(/[^a-z0-9]+/g, "-") 
        : undefined;

      // Map sort
      let mappedSortBy: any = "popular";
      if (sortBy === "price-low") mappedSortBy = "price_asc";
      if (sortBy === "price-high") mappedSortBy = "price_desc";
      if (sortBy === "rating") mappedSortBy = "rated";

      const res = await catalogService.getProducts({
        categorySlug,
        tagSlug,
        sortBy: mappedSortBy,
        search: searchQuery || undefined,
        page,
        limit: 6
      });

      let loadedProducts = res.products;

      // Apply client-side multi-flavor check if user checked multiple flavors (hybrid approach)
      if (selectedFlavors.length > 1) {
        loadedProducts = loadedProducts.filter(p => {
          return selectedFlavors.slice(1).every(flavor => 
            p.tags.some(t => t.toLowerCase() === flavor.toLowerCase()) || 
            p.moods.some(m => m.toLowerCase() === flavor.toLowerCase())
          );
        });
      }

      setProducts(loadedProducts);
      setPagination(res.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      loadProducts();
    }
  }, [selectedCategory, selectedFlavors, sortBy, page, searchQuery, mounted]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
  }, { dependencies: [mounted], scope: containerRef });

  useGSAP(() => {
    if (!mounted || isLoading) return;

    // Staggered entry for product cards after loading completes
    gsap.fromTo(".product-card-el",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
      }
    );
  }, { dependencies: [isLoading, products.length], scope: containerRef });

  const toggleFlavor = (flavor: string) => {
    setPage(1);
    if (selectedFlavors.includes(flavor)) {
      setSelectedFlavors(selectedFlavors.filter(f => f !== flavor));
    } else {
      setSelectedFlavors([...selectedFlavors, flavor]);
    }
  };

  const handleAddToCart = (product: any) => {
    const defaultVariant = product.variants?.find((v: any) => v.isDefault) || product.variants?.[0];
    if (!defaultVariant) {
      toast.error("Product variant not available");
      return;
    }
    addItem({
      id: defaultVariant.id,
      variantId: defaultVariant.id,
      name: product.name,
      price: defaultVariant.discountPrice || defaultVariant.price,
      image: product.image,
      quantity: 1
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleCategoryChange = (category: string) => {
    setPage(1);
    setSelectedCategory(category);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
            {searchQuery && (
              <p className="shop-header-el text-brand-gold font-sans font-medium text-sm mt-3 bg-brand-gold/10 px-4 py-1.5 rounded-full border border-brand-gold/10 w-fit">
                Search results for: <span className="font-extrabold text-brand-brown">"{searchQuery}"</span>
                <button onClick={() => { setSearchQuery(""); setPage(1); window.history.replaceState({}, "", "/shop"); }} className="ml-3 font-extrabold text-brand-error hover:underline cursor-pointer">×</button>
              </p>
            )}
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
                        setPage(1);
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
                  {categories.map(category => (
                    <li key={category}>
                      <button 
                        onClick={() => handleCategoryChange(category)}
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
              {(selectedCategory !== "All" || selectedFlavors.length > 0 || searchQuery) && (
                <button
                  onClick={() => { setSelectedCategory("All"); setSelectedFlavors([]); setSearchQuery(""); setPage(1); window.history.replaceState({}, "", "/shop"); }}
                  className="mt-8 w-full text-center text-xs font-semibold text-brand-gold hover:text-brand-brown hover:underline transition-colors py-2.5 border border-dashed border-brand-gold/30 rounded-xl cursor-pointer"
                >
                  Reset All Filters
                </button>
              )}

            </div>
          </aside>

          {/* Product Grid */}
          <main className="shop-grid-container flex-1">
            {isLoading ? (
              // Loading Skeleton Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-[2rem] border border-brand-brown/10 overflow-hidden h-[420px] flex flex-col justify-between p-6">
                    <div className="bg-brand-light aspect-[4/3] w-full rounded-2xl"></div>
                    <div className="space-y-3 mt-6 flex-grow">
                      <div className="h-2.5 bg-brand-light rounded w-1/4"></div>
                      <div className="h-5 bg-brand-light rounded w-3/4"></div>
                      <div className="h-3 bg-brand-light rounded w-full"></div>
                      <div className="h-3 bg-brand-light rounded w-5/6"></div>
                    </div>
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-brand-light">
                      <div className="h-6 bg-brand-light rounded w-1/4"></div>
                      <div className="h-10 bg-brand-light rounded-full w-10"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              // Error Alert
              <div className="text-center py-20 bg-white rounded-[2rem] border border-brand-error/20 p-8 shadow-sm">
                <span className="text-4xl mb-4 block">⚠️</span>
                <p className="text-brand-error text-lg font-serif font-bold mb-2">Something went wrong</p>
                <p className="text-brand-text-secondary text-sm font-sans mb-6 max-w-xs mx-auto">{error}</p>
                <button 
                  onClick={loadProducts}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-brand-brown rounded-full hover:bg-brand-gold transition-colors cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              // Empty State
              <div className="text-center py-20 bg-white rounded-[2rem] border border-brand-brown/10 shadow-[0_8px_30px_rgba(92,51,23,0.02)]">
                <span className="text-4xl mb-4 block">🍪</span>
                <p className="text-brand-brown text-lg font-serif font-bold mb-2">No Cookies Found</p>
                <p className="text-brand-text-secondary text-sm font-sans mb-6 max-w-xs mx-auto">We couldn't find any cookies matching your selected filters.</p>
                <button 
                  onClick={() => { setSelectedCategory("All"); setSelectedFlavors([]); setSearchQuery(""); setPage(1); window.history.replaceState({}, "", "/shop"); }}
                  className="px-6 py-2.5 text-xs font-bold text-brand-cream bg-[#E29B52] rounded-full hover:bg-brand-brown transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              // Products Display
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
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
                      <Link href={`/product/${product.slug || product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-brand-light">
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
                          
                          <Link href={`/product/${product.slug || product.id}`}>
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

                {/* Pagination Controls */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center mt-16 space-x-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 text-sm font-sans font-bold rounded-full bg-white border border-brand-brown/10 text-brand-brown hover:border-brand-gold hover:text-brand-gold disabled:opacity-40 disabled:hover:text-brand-brown disabled:hover:border-brand-brown/10 transition-all cursor-pointer"
                    >
                      ← Prev
                    </button>
                    {[...Array(pagination.totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-full font-sans font-bold text-sm transition-all cursor-pointer ${
                            page === pageNum
                              ? "bg-brand-brown text-white shadow-md"
                              : "bg-white border border-brand-brown/10 text-brand-brown hover:border-brand-gold hover:text-brand-gold"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === pagination.totalPages}
                      className="px-4 py-2 text-sm font-sans font-bold rounded-full bg-white border border-brand-brown/10 text-brand-brown hover:border-brand-gold hover:text-brand-gold disabled:opacity-40 disabled:hover:text-brand-brown disabled:hover:border-brand-brown/10 transition-all cursor-pointer"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
