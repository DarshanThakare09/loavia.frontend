"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Star, Minus, Plus, ShoppingCart, Truck, RefreshCw, ShieldCheck } from "lucide-react";
import { PRODUCTS } from "@/lib/mockData";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  
  const { addItem } = useCartStore();

  // Find product, fallback to first if not found
  const product = PRODUCTS.find(p => p.id === slug) || PRODUCTS[0];

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image[0] || "/premium_cookie.png",
      quantity: quantity
    });
    toast.success(`${quantity} x ${product.name} added to cart`);
  };

  return (
    <div className="bg-white min-h-screen pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex text-sm text-brand-text-secondary mb-8">
          <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-brand-gold transition-colors">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-text-primary font-medium">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12 mb-16">
          
          {/* Image Gallery */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-brand-light mb-4 shadow-sm border border-brand-brown/5">
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === index ? "border-brand-gold shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-brand-brown mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center text-brand-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-current" : ""}`} />
                ))}
              </div>
              <span className="text-brand-text-secondary text-sm">{product.rating} ({product.reviews} reviews)</span>
            </div>
            
            <div className="text-3xl font-bold text-brand-brown mb-8">
              ₹{product.price}
            </div>

            <p className="text-brand-text-secondary text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center justify-between border-2 border-brand-brown/20 rounded-full px-6 py-4 w-full sm:w-1/3">
                <button onClick={decrementQuantity} className="text-brand-brown hover:text-brand-gold transition-colors">
                  <Minus className="w-5 h-5" />
                </button>
                <span className="font-bold text-xl w-8 text-center">{quantity}</span>
                <button onClick={incrementQuantity} className="text-brand-brown hover:text-brand-gold transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center space-x-2 bg-brand-brown text-white font-bold text-lg rounded-full py-4 hover:bg-brand-gold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart - ₹{product.price * quantity}</span>
              </button>
            </div>

            {/* Features list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-y border-brand-brown/10 mb-8">
              <div className="flex items-center text-brand-text-secondary">
                <Truck className="w-5 h-5 mr-3 text-brand-gold" />
                <span className="text-sm font-medium">Pan-India Delivery</span>
              </div>
              <div className="flex items-center text-brand-text-secondary">
                <RefreshCw className="w-5 h-5 mr-3 text-brand-gold" />
                <span className="text-sm font-medium">Baked Fresh Daily</span>
              </div>
              <div className="flex items-center text-brand-text-secondary">
                <ShieldCheck className="w-5 h-5 mr-3 text-brand-gold" />
                <span className="text-sm font-medium">100% Secure Checkout</span>
              </div>
            </div>
            
            {/* Accordion / Tabs */}
            <div className="mt-auto">
              <div className="flex space-x-8 border-b border-brand-brown/10 mb-6">
                <button 
                  onClick={() => setActiveTab("description")}
                  className={`pb-4 font-bold text-lg transition-colors relative ${activeTab === "description" ? "text-brand-brown" : "text-brand-text-secondary hover:text-brand-brown"}`}
                >
                  Description
                  {activeTab === "description" && <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-gold rounded-t-full"></div>}
                </button>
                <button 
                  onClick={() => setActiveTab("ingredients")}
                  className={`pb-4 font-bold text-lg transition-colors relative ${activeTab === "ingredients" ? "text-brand-brown" : "text-brand-text-secondary hover:text-brand-brown"}`}
                >
                  Ingredients
                  {activeTab === "ingredients" && <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-gold rounded-t-full"></div>}
                </button>
              </div>
              
              <div className="min-h-[100px]">
                {activeTab === "description" && (
                  <p className="text-brand-text-secondary leading-relaxed animate-in fade-in duration-300">
                    {product.description}
                  </p>
                )}
                {activeTab === "ingredients" && (
                  <div className="animate-in fade-in duration-300 mt-4">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-brand-brown/10 shadow-sm w-full text-brand-brown max-w-md">
                      <h3 className="text-2xl font-bold mb-3 font-serif">Ingredients</h3>
                      <p className="text-sm leading-relaxed text-brand-text-secondary mb-6">
                        Organic All-Purpose Flour, Grass-fed Butter, Brown Sugar, Organic Cane Sugar, Pasture-raised Eggs, Belgian Dark Chocolate Chunks (54%), Pure Vanilla Extract, Sea Salt, Baking Soda.
                      </p>
                      
                      <div className="h-1 bg-brand-brown/20 w-full mb-4 rounded-full"></div>
                      
                      <h3 className="text-xl font-bold font-serif flex justify-between items-end mb-2">
                        Nutrition Facts
                      </h3>
                      <div className="flex justify-between text-sm font-medium border-b border-brand-brown/10 pb-2 mb-2">
                        <span className="text-brand-text-secondary">Serving Size 11g</span>
                        <span className="font-bold">150g</span>
                      </div>
                      
                      <div className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider border-b border-brand-brown/10 pb-1 mb-2">Amount Per Serving</div>
                      
                      <div className="flex justify-between text-base font-bold border-b-2 border-brand-brown/20 pb-2 mb-4">
                        <span>Calories 46</span>
                        <span className="text-brand-text-secondary font-medium text-sm mt-1">Calories from fat 27%</span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-brand-brown/5 pb-1.5">
                          <span><span className="font-bold">Total Fat</span> 3.0g</span>
                          <span className="font-bold">5%</span>
                        </div>
                        <div className="flex justify-between border-b border-brand-brown/5 pb-1.5 pl-4 text-brand-text-secondary">
                          <span>Saturated Fat 0.6g</span>
                          <span className="font-medium">3%</span>
                        </div>
                        <div className="flex justify-between border-b border-brand-brown/5 pb-1.5">
                          <span><span className="font-bold text-brand-brown">Cholesterol</span> 0mg</span>
                          <span className="font-bold">0%</span>
                        </div>
                        <div className="flex justify-between border-b border-brand-brown/5 pb-1.5">
                          <span><span className="font-bold text-brand-brown">Sodium</span> 35mg</span>
                          <span className="font-bold">1%</span>
                        </div>
                        <div className="flex justify-between border-b border-brand-brown/5 pb-1.5">
                          <span><span className="font-bold text-brand-brown">Potassium</span> 41mg</span>
                          <span className="font-bold">1%</span>
                        </div>
                        <div className="flex justify-between border-b border-brand-brown/5 pb-1.5">
                          <span><span className="font-bold text-brand-brown">Total Carbohydrates</span> 2.7g</span>
                          <span className="font-bold">1%</span>
                        </div>
                        <div className="flex justify-between border-b border-brand-brown/5 pb-1.5 pl-4 text-brand-text-secondary">
                          <span>Sugars 2.1g</span>
                          <span></span>
                        </div>
                      </div>
                      <div className="h-0.5 bg-brand-brown/20 w-full mt-4 mb-3"></div>
                      <div className="flex justify-between text-sm">
                        <span><span className="font-bold text-brand-brown">Protein</span> 2.7g</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
