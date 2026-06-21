"use client";

import { useState } from "react";
import Image from "next/image";
import { Package, Minus, Plus, ShoppingCart, CheckCircle } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useProductStore } from "@/store/productStore";
import { toast } from "sonner";
import { PRODUCTS } from "@/lib/mockData";

export default function BuildBoxPage() {
  const { products: storeProducts } = useProductStore();
  const productsList = storeProducts.length > 0 ? storeProducts : PRODUCTS;

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
    <div className="bg-[#FDFBF7] min-h-screen pt-8 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="text-brand-gold font-sans font-bold text-xs uppercase tracking-[3px] mb-2 block">Custom Creation</span>
          <h1
            style={{ fontFamily: "'Amsterdam Signature', serif" }}
            className="font-normal leading-none mb-6 pt-4 pb-4 flex flex-col sm:flex-row sm:items-baseline sm:flex-wrap gap-x-4 gap-y-2 justify-center"
          >
            <span className="text-brand-gold text-2xl md:text-3xl lg:text-[3rem]">Build Your</span>
            <span className="text-brand-brown text-7xl md:text-8xl lg:text-[6rem]">Box</span>
          </h1>
          <p className="text-brand-text-secondary text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Mix and match your favorite flavors. Choose a size and fill it up to your heart's content.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            
            {/* Box Size Selector */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgba(92,51,23,0.02)] border border-brand-brown/5 mb-8">
              <h2 className="text-lg font-extrabold text-brand-brown mb-6 flex items-center tracking-wide">
                <Package className="w-5 h-5 mr-3 text-brand-gold" /> Step 1: Choose Size
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[6, 12, 24].map(size => (
                  <button 
                    key={size}
                    onClick={() => {
                      setBoxSize(size);
                      setSelections({});
                    }}
                    className={`p-6 rounded-[2rem] border-2 transition-all duration-300 text-center cursor-pointer ${
                      boxSize === size 
                        ? "border-brand-brown bg-brand-brown text-white shadow-lg scale-[1.02]" 
                        : "border-brand-brown/10 bg-white text-brand-brown hover:border-brand-gold/40 hover:bg-[#FDFBF7]"
                    }`}
                  >
                    <span className="block text-2xl font-black mb-1">{size} Pack</span>
                    <span className={`font-bold ${boxSize === size ? "text-brand-cream" : "text-brand-gold"}`}>
                      ₹{size === 6 ? "1799" : size === 12 ? "3499" : "6799"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Flavor Selector */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgba(92,51,23,0.02)] border border-brand-brown/5">
              <div className="flex justify-between items-center mb-8 border-b border-brand-brown/5 pb-4">
                <h2 className="text-lg font-extrabold text-brand-brown flex items-center tracking-wide">
                  <CheckCircle className="w-5 h-5 mr-3 text-brand-gold" /> Step 2: Fill Your Box
                </h2>
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${remaining === 0 ? "bg-green-100 text-green-700" : "bg-brand-gold/10 text-brand-gold"}`}>
                  {remaining === 0 ? "Box is Full!" : `${remaining} slots left`}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {productsList.slice(0, 6).map(cookie => {
                  const count = selections[cookie.id] || 0;
                  return (
                    <div key={cookie.id} className="flex items-center space-x-4 p-4 border border-brand-brown/10 rounded-2xl hover:border-brand-gold/30 hover:shadow-sm transition-all duration-300 bg-[#FDFBF7]/40 group">
                      <div className="relative w-20 h-20 bg-brand-light rounded-xl overflow-hidden flex-shrink-0 border border-brand-brown/5 group-hover:scale-95 transition-transform duration-300">
                        <Image src={cookie.image} alt={cookie.name} fill className="object-cover" sizes="80px" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-extrabold text-sm text-brand-brown mb-3 line-clamp-2 leading-tight">{cookie.name}</h3>
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => handleUpdate(cookie.id, -1)}
                            disabled={count === 0}
                            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
                              count === 0 
                                ? "border-gray-200 text-gray-300 cursor-not-allowed" 
                                : "border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white"
                            }`}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-extrabold text-brand-brown w-4 text-center">{count}</span>
                          <button 
                            onClick={() => handleUpdate(cookie.id, 1)}
                            disabled={remaining === 0}
                            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
                              remaining === 0 
                                ? "border-gray-200 text-gray-300 cursor-not-allowed" 
                                : "border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white"
                            }`}
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
            <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgba(92,51,23,0.02)] border border-brand-brown/5 sticky top-24">
              <h3 className="text-xl font-bold text-brand-brown mb-6 border-b border-brand-brown/5 pb-4">
                Your Box ({boxSize}-Pack)
              </h3>
              
              <div className="grid grid-cols-3 gap-3 mb-8">
                {Array.from({ length: boxSize }).map((_, i) => {
                  const flatSelections = Object.entries(selections).flatMap(([id, count]) => Array(count).fill(id));
                  const cookieId = flatSelections[i];
                  const cookie = productsList.find(c => c.id === cookieId);

                  return (
                    <div key={i} className="aspect-square rounded-2xl bg-[#FDFBF7] border-2 border-dashed border-brand-brown/15 flex items-center justify-center relative overflow-hidden group shadow-inner">
                       {cookie ? (
                        <Image src={cookie.image} alt={cookie.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="90px" />
                      ) : (
                        <span className="text-brand-brown/25 font-bold text-xs select-none">Empty</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-brand-brown/5 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-extrabold text-brand-brown text-sm uppercase tracking-wider">Total Price</span>
                  <span className="font-black text-2xl text-brand-brown">₹{boxSize === 6 ? "1799" : boxSize === 12 ? "3499" : "6799"}</span>
                </div>
                <button 
                  disabled={remaining > 0}
                  onClick={handleAddToCart}
                  className={`w-full flex items-center justify-center space-x-2 px-8 py-4 font-bold rounded-full transition-all duration-300 cursor-pointer ${
                    remaining === 0 
                      ? "bg-brand-brown text-white hover:bg-brand-gold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" 
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
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
