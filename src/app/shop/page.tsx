"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Filter, ChevronDown, ShoppingCart, Star, Heart } from "lucide-react";
import { PRODUCTS } from "@/lib/mockData";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

const CATEGORIES = ["All", "Classic", "Vegan", "Gluten-Free", "Stuffed", "Specialty"];
const FLAVORS = ["Sweet", "Chocolate", "Healthy", "Fruity", "Nutty", "Tea", "Citrus", "Caramel", "Premium", "Happy", "Cozy", "Energetic", "Relaxed"];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popular");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { user, toggleWishlist } = useAuthStore();

  // Filtering Logic
  const filteredProducts = PRODUCTS.filter(product => {
    if (selectedCategory !== "All" && product.category !== selectedCategory) return false;
    if (selectedFlavors.length > 0 && !selectedFlavors.some(tag => product.tags.includes(tag) || (product as any).moods?.includes(tag))) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return b.reviews - a.reviews; // default popular
  });

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
      price: product.price,
      image: product.image,
      quantity: 1
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="bg-brand-cream min-h-screen pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-brand-brown/10 pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-2">Our Menu</h1>
            <p className="text-brand-text-secondary">Freshly baked, premium ingredients. Find your craving.</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="md:hidden flex items-center px-4 py-2 bg-white rounded-full text-brand-brown font-medium shadow-sm border border-brand-brown/10"
            >
              <Filter className="w-4 h-4 mr-2" /> Filters
            </button>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-brand-brown/10 text-brand-text-primary py-2 pl-4 pr-10 rounded-full font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-secondary pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className={`${isMobileFilterOpen ? "block" : "hidden"} md:block w-full md:w-64 flex-shrink-0`}>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-brown/5 sticky top-24">
              
              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="font-serif font-bold text-lg text-brand-brown mb-4 border-b border-brand-brown/10 pb-2">Category</h3>
                <ul className="space-y-2">
                  {CATEGORIES.map(category => (
                    <li key={category}>
                      <button 
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left py-1 transition-colors ${selectedCategory === category ? "text-brand-gold font-bold" : "text-brand-text-secondary hover:text-brand-brown"}`}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Flavor Filter */}
              <div className="mb-8">
                <h3 className="font-serif font-bold text-lg text-brand-brown mb-4 border-b border-brand-brown/10 pb-2">Flavors & Mood</h3>
                <div className="flex flex-wrap gap-2">
                  {FLAVORS.map(flavor => (
                    <button
                      key={flavor}
                      onClick={() => toggleFlavor(flavor)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                        selectedFlavors.includes(flavor) 
                          ? "bg-brand-brown text-white" 
                          : "bg-brand-light text-brand-text-secondary hover:bg-brand-brown/10"
                      }`}
                    >
                      {flavor}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-4 right-4 z-10">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        if (!user) {
                          toast.error("Please login to use wishlist");
                          return;
                        }
                        toggleWishlist({ ...product, id: product.id.toString(), price: product.price, image: typeof product.image === 'string' ? product.image : "/premium_cookie.png" });
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

                  <div className="p-5">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-bold text-lg text-brand-text-primary hover:text-brand-gold transition-colors line-clamp-1 mb-1">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center space-x-1 mb-3 text-sm text-brand-text-secondary">
                      <Star className="w-4 h-4 fill-brand-gold text-brand-gold" />
                      <span>{product.rating}</span>
                      <span>({product.reviews})</span>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-brand-brown/10">
                      <span className="font-bold text-xl text-brand-brown">₹{product.price}</span>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="p-2.5 rounded-full bg-brand-light text-brand-brown hover:bg-brand-brown hover:text-white transition-colors"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-brand-brown/5">
                <p className="text-brand-text-secondary text-lg">No cookies found matching your criteria.</p>
                <button 
                  onClick={() => { setSelectedCategory("All"); setSelectedFlavors([]); }}
                  className="mt-4 text-brand-gold font-bold hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
