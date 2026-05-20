"use client";

import { useCartStore } from "@/store/cartStore";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function MiniCart() {
  const { isMiniCartOpen, closeMiniCart, items, updateQuantity, removeItem, getCartTotal } = useCartStore();
  
  // Prevent hydration mismatch for persisted store
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const total = getCartTotal();

  return (
    <>
      {/* Overlay */}
      {isMiniCartOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity"
          onClick={closeMiniCart}
        />
      )}

      {/* Slide-out Panel */}
      <div 
        className={`fixed inset-y-0 right-0 z-[101] w-full max-w-md bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col ${
          isMiniCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-brown/10">
          <h2 className="text-xl font-serif font-bold text-brand-brown flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Your Cart ({items.reduce((acc, item) => acc + item.quantity, 0)})
          </h2>
          <button 
            onClick={closeMiniCart}
            className="p-2 text-brand-text-secondary hover:text-brand-brown rounded-full hover:bg-brand-light transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-brand-text-secondary space-y-4">
              <ShoppingBag className="w-16 h-16 text-brand-brown/20" />
              <p className="text-lg">Your cart is empty.</p>
              <Link href="/shop" onClick={closeMiniCart} className="text-brand-gold font-bold hover:underline">
                Continue Shopping
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-20 h-20 bg-brand-light rounded-xl overflow-hidden flex-shrink-0 border border-brand-brown/5">
                  <Image src={item.image || "/premium_cookie.png"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm text-brand-brown line-clamp-2 pr-2">{item.name}</h3>
                    <button onClick={() => removeItem(item.id)} className="text-brand-text-secondary hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-brand-brown/20 rounded-full bg-white">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-brand-brown hover:text-brand-gold transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-brand-brown">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-brand-brown hover:text-brand-gold transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-bold text-brand-brown">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-brand-brown/10 p-6 bg-brand-light/50">
            <div className="flex justify-between mb-4 text-brand-text-secondary">
              <span>Subtotal</span>
              <span className="font-bold text-brand-brown">₹{total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-brand-text-secondary text-center mb-4">Shipping and taxes calculated at checkout.</p>
            <div className="space-y-3">
              <Link 
                href="/cart" 
                onClick={closeMiniCart}
                className="block w-full py-3 px-4 bg-white border border-brand-brown/20 text-brand-brown text-center font-bold rounded-xl hover:bg-brand-brown hover:text-white transition-colors"
              >
                View Cart
              </Link>
              <Link 
                href="/checkout" 
                onClick={closeMiniCart}
                className="block w-full py-3 px-4 bg-brand-brown text-white text-center font-bold rounded-xl hover:bg-brand-gold hover:shadow-lg transition-all"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
