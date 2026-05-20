"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, CreditCard, Truck, MapPin, Tag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { items, getCartTotal, clearCart } = useCartStore();
  const { isAuthenticated, user, addOrder } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/auth?redirect=/checkout");
    }
  }, [mounted, isAuthenticated, router]);

  const subtotal = getCartTotal();
  const shipping = subtotal > 1000 ? 0 : 99;
  const total = subtotal + shipping;

  const handleNext = () => setStep(step + 1);
  
  const handlePlaceOrder = () => {
    // Generate an order
    const orderId = `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    addOrder({
      id: orderId,
      date: new Date().toISOString(),
      total: total,
      status: "Processing",
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }))
    });

    clearCart();
    
    // Navigate to order ID confirmation
    router.push(`/orders/${orderId}`);
  };

  if (!mounted || !isAuthenticated) return null;

  return (
    <div className="bg-brand-cream min-h-screen pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Checkout Flow */}
          <div className="w-full lg:w-2/3">
            
            {/* Steps Progress */}
            <div className="flex items-center justify-between mb-8 relative z-0">
              <div className="absolute left-[1.25rem] right-[1.25rem] top-[1.25rem] h-1 bg-brand-brown/20 -z-10 transform -translate-y-1/2"></div>
              <div className="absolute left-[1.25rem] right-[1.25rem] top-[1.25rem] h-1 -z-10 transform -translate-y-1/2">
                <div className={`h-full bg-brand-brown transition-all duration-500`} style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
              </div>
              
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors duration-300 ${step >= 1 ? "bg-brand-brown" : "bg-brand-brown/20 text-brand-brown"}`}>1</div>
                <span className="text-xs font-bold mt-2 text-brand-brown">Address</span>
              </div>
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300 ${step >= 2 ? "bg-brand-brown text-white" : "bg-white border-2 border-brand-brown/20 text-brand-brown"}`}>2</div>
                <span className="text-xs font-bold mt-2 text-brand-text-secondary">Delivery</span>
              </div>
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300 ${step >= 3 ? "bg-brand-brown text-white" : "bg-white border-2 border-brand-brown/20 text-brand-brown"}`}>3</div>
                <span className="text-xs font-bold mt-2 text-brand-text-secondary">Payment</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-brand-brown/5">
              
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-bold text-brand-brown mb-6 flex items-center"><MapPin className="w-6 h-6 mr-2 text-brand-gold" /> Shipping Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-text-secondary mb-2">First Name</label>
                      <input type="text" defaultValue="John" className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-text-secondary mb-2">Last Name</label>
                      <input type="text" defaultValue="Doe" className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-text-secondary mb-2">Street Address</label>
                      <input type="text" defaultValue="123 Cookie Lane" className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-text-secondary mb-2">City</label>
                      <input type="text" defaultValue="Mumbai" className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-text-secondary mb-2">Postal Code</label>
                      <input type="text" defaultValue="400001" className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" />
                    </div>
                  </div>
                  <button onClick={handleNext} className="w-full flex items-center justify-center space-x-2 px-8 py-4 font-bold text-white bg-brand-brown rounded-xl hover:bg-brand-gold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 mt-8">
                    <span>Continue to Delivery</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-bold text-brand-brown mb-6 flex items-center"><Truck className="w-6 h-6 mr-2 text-brand-gold" /> Delivery Method</h2>
                  <div className="space-y-4 mb-8">
                    <label className="flex items-center p-4 border-2 border-brand-gold bg-brand-gold/5 rounded-2xl cursor-pointer shadow-sm transition-all duration-300">
                      <input type="radio" name="delivery" defaultChecked className="w-5 h-5 text-brand-gold focus:ring-brand-gold" />
                      <div className="ml-4 flex-1">
                        <span className="block font-bold text-brand-brown text-lg">Standard Delivery</span>
                        <span className="block text-sm text-brand-text-secondary">3-5 Business Days</span>
                      </div>
                      <span className="font-bold text-brand-brown">Free</span>
                    </label>
                    <label className="flex items-center p-4 border-2 border-transparent hover:border-brand-brown/20 bg-brand-light hover:bg-white rounded-2xl cursor-pointer transition-all duration-300">
                      <input type="radio" name="delivery" className="w-5 h-5 text-brand-brown focus:ring-brand-gold" />
                      <div className="ml-4 flex-1">
                        <span className="block font-bold text-brand-brown text-lg">Express Delivery</span>
                        <span className="block text-sm text-brand-text-secondary">1-2 Business Days</span>
                      </div>
                      <span className="font-bold text-brand-brown">₹149</span>
                    </label>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="w-1/3 px-8 py-4 font-bold text-brand-brown bg-brand-light rounded-xl hover:bg-brand-brown/10 transition-colors">Back</button>
                    <button onClick={handleNext} className="w-2/3 flex items-center justify-center space-x-2 px-8 py-4 font-bold text-white bg-brand-brown rounded-xl hover:bg-brand-gold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5">
                      <span>Continue to Payment</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-bold text-brand-brown mb-6 flex items-center"><CreditCard className="w-6 h-6 mr-2 text-brand-gold" /> Payment</h2>
                  
                  <div className="p-6 bg-brand-light rounded-2xl mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-brand-brown">Credit/Debit Card</span>
                      <div className="flex space-x-2">
                        <div className="w-8 h-5 bg-gray-300 rounded"></div>
                        <div className="w-8 h-5 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <input type="text" placeholder="Card Number" className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="MM/YY" className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" />
                        <input type="text" placeholder="CVC" className="w-full bg-white border border-brand-brown/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 rounded-xl py-3 px-4 outline-none font-medium text-brand-brown shadow-sm transition-all duration-300" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="w-1/3 px-8 py-4 font-bold text-brand-brown bg-brand-light rounded-xl hover:bg-brand-brown/10 transition-colors">Back</button>
                    <button onClick={handlePlaceOrder} className="w-2/3 flex items-center justify-center space-x-2 px-8 py-4 font-bold text-white bg-brand-gold rounded-xl hover:bg-brand-brown transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Pay ₹{total.toFixed(2)}</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-brand-brown/5 sticky top-24">
              <h3 className="font-serif font-bold text-xl text-brand-brown mb-4 border-b border-brand-brown/10 pb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-brand-light flex-shrink-0">
                      <Image src={item.image || "/premium_cookie.png"} alt={item.name} fill className="object-cover" />
                      <span className="absolute -top-2 -right-2 bg-brand-brown text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-brand-brown line-clamp-1">{item.name}</h4>
                      <span className="text-brand-text-secondary text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-brand-brown/10 pt-4 space-y-2 text-sm text-brand-text-primary">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold">{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-brand-brown/10 mt-2">
                  <span className="font-bold text-lg text-brand-brown">Total</span>
                  <span className="font-bold text-2xl text-brand-brown">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
