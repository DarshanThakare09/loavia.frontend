"use client";

import { useState } from "react";
import Image from "next/image";
import { Package, Minus, Plus, ShoppingCart, CheckCircle } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { PRODUCTS } from "@/lib/mockData";

export default function BuildBoxPage() {
  const [boxSize, setBoxSize] = useState(6);
  const [selections, setSelections] = useState<{ [id: string]: number }>({});
  
  const { addItem } = useCartStore();

  const totalSelected = Object.values(selections).reduce((a, b) => a + b, 0);
  const remaining = boxSize - totalSelected;

  const handleUpdate = (id: string, delta: number) => {
    const current = selections[id] || 0;
    const newCount = current + delta;
    
    if (newCount < 0) return;
    if (delta > 0 && remaining <= 0) return;
    
    setSelections({ ...selections, [id]: newCount });
  };

  const handleAddToCart = () => {
    const price = boxSize === 6 ? 1799 : boxSize === 12 ? 3499 : 6799;
    addItem({
      id: `custom-box-${Date.now()}`,
      name: `Custom Box (${boxSize} Pack)`,
      price: price,
      image: "/cookie_gift_box.png",
      quantity: 1,
      isCustomBox: true
    });
    toast.success(`Custom ${boxSize}-Pack added to cart`);
    
    // Reset selection after adding
    setSelections({});
  };

  return (
    <div className="bg-brand-cream min-h-screen pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-4">Build Your Box</h1>
          <p className="text-brand-text-secondary text-lg max-w-2xl mx-auto">Mix and match your favorite flavors. Choose a size and fill it up to your heart's content.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            
            {/* Box Size Selector */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand-brown/5 mb-8">
              <h2 className="text-xl font-bold text-brand-brown mb-4 flex items-center"><Package className="w-5 h-5 mr-2 text-brand-gold" /> Step 1: Choose Size</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[6, 12, 24].map(size => (
                  <button 
                    key={size}
                    onClick={() => {
                      setBoxSize(size);
                      setSelections({});
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all text-center ${
                      boxSize === size 
                        ? "border-brand-brown bg-brand-brown text-white shadow-md" 
                        : "border-brand-brown/10 bg-white text-brand-brown hover:border-brand-brown/30"
                    }`}
                  >
                    <span className="block text-2xl font-bold mb-1">{size} Pack</span>
                    <span className={boxSize === size ? "text-brand-cream/80" : "text-brand-text-secondary"}>
                      ₹{size === 6 ? "1799" : size === 12 ? "3499" : "6799"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Flavor Selector */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-brand-brown/5">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-brand-brown flex items-center"><CheckCircle className="w-5 h-5 mr-2 text-brand-gold" /> Step 2: Fill Your Box</h2>
                <span className={`px-4 py-1 rounded-full text-sm font-bold ${remaining === 0 ? "bg-green-100 text-green-700" : "bg-brand-light text-brand-brown"}`}>
                  {remaining === 0 ? "Box is Full!" : `${remaining} slots left`}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {PRODUCTS.slice(0, 6).map(cookie => {
                  const count = selections[cookie.id] || 0;
                  return (
                    <div key={cookie.id} className="flex items-center space-x-4 p-4 border border-brand-brown/10 rounded-2xl hover:border-brand-brown/30 transition-colors">
                      <div className="relative w-20 h-20 bg-brand-light rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={cookie.image} alt={cookie.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm text-brand-brown mb-2 line-clamp-2">{cookie.name}</h3>
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => handleUpdate(cookie.id, -1)}
                            disabled={count === 0}
                            className={`w-8 h-8 rounded-full flex items-center justify-center border ${count === 0 ? "border-gray-200 text-gray-300" : "border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white"}`}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold w-4 text-center">{count}</span>
                          <button 
                            onClick={() => handleUpdate(cookie.id, 1)}
                            disabled={remaining === 0}
                            className={`w-8 h-8 rounded-full flex items-center justify-center border ${remaining === 0 ? "border-gray-200 text-gray-300" : "border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white"}`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand-brown/5 sticky top-24">
              <h3 className="text-xl font-serif font-bold text-brand-brown mb-6">Your Box ({boxSize}-Pack)</h3>
              
              <div className="grid grid-cols-3 gap-2 mb-8">
                {Array.from({ length: boxSize }).map((_, i) => {
                  // Figure out which cookie is in this slot based on selections
                  const flatSelections = Object.entries(selections).flatMap(([id, count]) => Array(count).fill(id));
                  const cookieId = flatSelections[i];
                  const cookie = PRODUCTS.find(c => c.id === cookieId);

                  return (
                    <div key={i} className="aspect-square rounded-xl bg-brand-light border-2 border-dashed border-brand-brown/20 flex items-center justify-center relative overflow-hidden">
                      {cookie ? (
                        <Image src={cookie.image} alt={cookie.name} fill className="object-cover" />
                      ) : (
                        <span className="text-brand-brown/30 font-bold text-sm">Empty</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-brand-brown/10 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-brand-brown">Total Price</span>
                  <span className="font-bold text-2xl text-brand-brown">₹{boxSize === 6 ? "1799" : boxSize === 12 ? "3499" : "6799"}</span>
                </div>
                <button 
                  disabled={remaining > 0}
                  onClick={handleAddToCart}
                  className={`w-full flex items-center justify-center space-x-2 px-8 py-4 font-bold rounded-full transition-all ${
                    remaining === 0 
                      ? "bg-brand-brown text-white hover:bg-brand-gold shadow-lg hover:-translate-y-1 transform" 
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{remaining === 0 ? "Add to Cart" : `Select ${remaining} more`}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
