"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ArrowRight, Tag, Heart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export default function CartPage() {
  const { items: cart, updateQuantity, removeItem, getCartTotal } = useCartStore();
  const { user, toggleWishlist } = useAuthStore();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === "WELCOME10") {
      setDiscount(0.1); // 10% off
    } else {
      alert("Invalid promo code");
      setDiscount(0);
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 1000 ? 0 : 99; // Free shipping over ₹1000
  const discountAmount = subtotal * discount;
  const total = subtotal + shipping - discountAmount;

  if (!mounted) return null;

  return (
    <div className="bg-brand-cream min-h-screen pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-brown mb-8 border-b border-brand-brown/10 pb-6">
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl shadow-sm border border-brand-brown/5">
            <h2 className="text-2xl font-bold text-brand-brown mb-4">Your cart is empty</h2>
            <p className="text-brand-text-secondary mb-8">Looks like you haven't added any cookies yet.</p>
            <Link 
              href="/shop" 
              className="inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-brand-brown rounded-full hover:bg-brand-gold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Cart Items */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-3xl shadow-sm border border-brand-brown/5 overflow-hidden">
                <div className="hidden sm:grid grid-cols-12 gap-4 p-6 bg-brand-light text-brand-brown font-bold uppercase text-sm tracking-wider border-b border-brand-brown/10">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                  <div className="col-span-1"></div>
                </div>
                
                <div className="divide-y divide-brand-brown/10">
                  {cart.map(item => (
                    <div key={item.id} className="p-6 flex flex-col sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center">
                      
                      {/* Product Info */}
                      <div className="col-span-6 flex items-center space-x-4 mb-4 sm:mb-0">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-brand-light flex-shrink-0">
                          <Image src={item.image || "/premium_cookie.png"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-brand-brown line-clamp-2">{item.name}</h3>
                          <p className="text-brand-text-secondary">₹{item.price}</p>
                        </div>
                      </div>
                      
                      {/* Quantity */}
                      <div className="col-span-3 flex justify-start sm:justify-center mb-4 sm:mb-0">
                        <div className="flex items-center justify-between border-2 border-brand-brown/20 rounded-full px-4 py-2 w-32">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-brand-brown hover:text-brand-gold">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-center w-8">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-brand-brown hover:text-brand-gold">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Total */}
                      <div className="col-span-2 flex justify-between sm:justify-end items-center font-bold text-lg text-brand-brown">
                        <span className="sm:hidden text-brand-text-secondary text-sm font-normal">Subtotal: </span>
                        ₹{item.price * item.quantity}
                      </div>

                      {/* Remove */}
                      <div className="col-span-1 flex justify-end mt-4 sm:mt-0">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-brand-text-secondary hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          aria-label="Remove item"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-brand-brown/5 sticky top-24">
                <h2 className="text-2xl font-serif font-bold text-brand-brown mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6 border-b border-brand-brown/10 pb-6 text-brand-text-primary">
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Subtotal</span>
                    <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-text-secondary">Shipping</span>
                    <span className="font-bold">{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (10%)</span>
                      <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-bold text-brand-brown">Total</span>
                  <span className="text-3xl font-bold text-brand-brown">₹{total.toFixed(2)}</span>
                </div>

                {/* Promo Code */}
                <form onSubmit={applyPromo} className="mb-8 relative">
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
                    <input 
                      type="text" 
                      placeholder="Promo Code" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-full py-4 pl-12 pr-24 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300"
                    />
                    <button 
                      type="submit" 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 font-bold text-brand-gold hover:text-brand-brown px-4 py-2 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {discount > 0 && <p className="text-green-600 text-sm font-medium mt-2 ml-4">Promo code applied!</p>}
                </form>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (!user) {
                      toast.error("Please login to save to wishlist");
                      return;
                    }
                    cart.forEach(item => {
                      const currentWishlist = user.wishlist || [];
                      if (!currentWishlist.some(w => w.id === item.id)) {
                        toggleWishlist({ 
                          id: item.id, 
                          name: item.name, 
                          price: item.price, 
                          image: typeof item.image === 'string' ? item.image : "/premium_cookie.png" 
                        });
                      }
                    });
                    toast.success("Cart saved to wishlist!");
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-8 py-4 mb-4 font-bold text-brand-brown border-2 border-brand-brown rounded-full hover:bg-brand-brown hover:text-white transition-all duration-300"
                >
                  <Heart className="w-5 h-5" />
                  <span>Save Cart to Wishlist</span>
                </button>

                <Link 
                  href="/checkout" 
                  className="w-full flex items-center justify-center space-x-2 px-8 py-4 font-bold text-white bg-brand-brown rounded-full hover:bg-brand-gold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                
                <p className="text-center text-sm text-brand-text-secondary mt-6">
                  Taxes and shipping calculated at checkout.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
